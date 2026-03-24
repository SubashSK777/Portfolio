import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundOverlay = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      -1000, 1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // =========================
    // ✨ LUMINOUS SHADER-LIKE STARS
    // =========================
    const COUNT = 2500; 
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const particles = [];

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * (width + 1200);
      const y = (Math.random() - 0.5) * (height + 1200);

      particles.push({
        x,
        y,
        brightness: 0.4 + Math.random() * 0.6,
        blinkOffset: Math.random() * Math.PI * 2,
        blinkSpeed: 0.008 + Math.random() * 0.015,
        depth: Math.random() * 0.5 + 0.5,
        pulse: Math.random() > 0.85,
        travelSpeed: 1.0 + Math.random() * 2.5,
      });

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a circular glow texture for "luminous" effect
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const getStarSize = () => (window.innerWidth < 1024 ? 3.5 : 5.5);

    const material = new THREE.PointsMaterial({
      size: getStarSize(), 
      map: createStarTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending, // Makes them luminous
      depthWrite: false,
      sizeAttenuation: false,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // =========================
    // INTERACTION
    // =========================
    let mouse = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
      target.x = (e.clientX - width / 2) * 0.025;
      target.y = -(e.clientY - height / 2) * 0.025;
    });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.size = getStarSize();
    });

    // =========================
    // ANIMATION
    // =========================
    let time = 0;
    let animationFrameId;

    const animate = () => {
      time += 0.008;

      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;

      const pos = geometry.attributes.position;
      const col = geometry.attributes.color;

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        // Trajectory
        const dx = p.x;
        const dy = p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const speedFactor = (dist / 220) + 0.3;
        p.x += (dx / dist) * p.travelSpeed * speedFactor;
        p.y += (dy / dist) * p.travelSpeed * speedFactor;

        if (Math.abs(p.x) > width / 2 + 700 || Math.abs(p.y) > height / 2 + 700) {
          p.x = (Math.random() - 0.5) * (width + 300);
          p.y = (Math.random() - 0.5) * (height + 300);
        }

        const fx = p.x + mouse.x * p.depth;
        const fy = p.y + mouse.y * p.depth;

        pos.setXYZ(i, fx, fy, 0);

        // ✨ TWINKLE
        const twinkle = Math.sin(time * p.blinkSpeed + p.blinkOffset);
        let intensity = p.pulse 
          ? p.brightness * (0.2 + twinkle * 0.8)
          : p.brightness * (0.4 + twinkle * 0.6);

        col.setXYZ(i, intensity, intensity, intensity);
      }

      pos.needsUpdate = true;
      col.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundOverlay;