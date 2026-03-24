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
    // ⭐ STARS (DENSE + WHITE)
    // =========================
    const COUNT = 2200; 
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const baseColors = new Float32Array(COUNT * 3); 

    const particles = [];

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * (width + 1200);
      const y = (Math.random() - 0.5) * (height + 1200);

      particles.push({
        x,
        y,
        brightness: 0.5 + Math.random() * 0.5,
        blinkOffset: Math.random() * Math.PI * 2,
        blinkSpeed: 0.01 + Math.random() * 0.02,
        depth: Math.random() * 0.5 + 0.5,
        pulse: Math.random() > 0.8,
        travelSpeed: 1.2 + Math.random() * 2.8,
      });

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;

      // Pure white stars
      baseColors[i * 3] = 1;
      baseColors[i * 3 + 1] = 1;
      baseColors[i * 3 + 2] = 1;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 3.8, 
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // =========================
    // INTERACTION
    // =========================
    let mouse = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
      target.x = (e.clientX - width / 2) * 0.03;
      target.y = -(e.clientY - height / 2) * 0.03;
    });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // =========================
    // ANIMATION
    // =========================
    let time = 0;

    const animate = () => {
      time += 0.01;

      mouse.x += (target.x - mouse.x) * 0.06;
      mouse.y += (target.y - mouse.y) * 0.06;

      const pos = geometry.attributes.position;
      const col = geometry.attributes.color;

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        // 🌌 Trajectory (Radial)
        const dx = p.x;
        const dy = p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const speedFactor = (dist / 200) + 0.35;
        p.x += (dx / dist) * p.travelSpeed * speedFactor;
        p.y += (dy / dist) * p.travelSpeed * speedFactor;

        if (Math.abs(p.x) > width / 2 + 600 || Math.abs(p.y) > height / 2 + 600) {
          p.x = (Math.random() - 0.5) * (width + 400);
          p.y = (Math.random() - 0.5) * (height + 400);
        }

        const fx = p.x + mouse.x * p.depth;
        const fy = p.y + mouse.y * p.depth;

        pos.setXYZ(i, fx, fy, 0);

        // ✨ TWINKLE
        const twinkle = Math.sin(time * p.blinkSpeed + p.blinkOffset);
        let intensity = p.pulse 
          ? p.brightness * (0.3 + twinkle * 0.7)
          : p.brightness * (0.5 + twinkle * 0.5);

        col.setXYZ(i, intensity, intensity, intensity);
      }

      pos.needsUpdate = true;
      col.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
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