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
    // ⭐ STARS (MORE, CLEAN)
    // =========================
    const COUNT = 400;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const particles = [];

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * (width + 1200);
      const y = (Math.random() - 0.5) * (height + 1200);

      particles.push({
        x,
        y,
        brightness: 0.5 + Math.random() * 0.5,
        blinkOffset: Math.random() * Math.PI * 2,
        blinkSpeed: 0.006 + Math.random() * 0.006, // faster twinkle
        depth: Math.random() * 0.5 + 0.5,
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

    const material = new THREE.PointsMaterial({
      size: 1.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // =========================
    // 🌠 SHOOTING STARS (RARE)
    // =========================
    const shootingStars = [];

    function spawnShootingStar() {
      const geometry = new THREE.BufferGeometry();
      const verts = new Float32Array([0, 0, 0, 120, -60, 0]);

      geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3));

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });

      const line = new THREE.Line(geometry, material);

      line.position.set(
        Math.random() * width - width / 2,
        height / 2,
        0
      );

      scene.add(line);

      shootingStars.push({ line, life: 0 });
    }

    // =========================
    // INTERACTION
    // =========================
    let mouse = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
      target.x = (e.clientX - width / 2) * 0.02;
      target.y = -(e.clientY - height / 2) * 0.02;
    });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // =========================
    // ANIMATION
    // =========================
    let time = 0;

    const animate = () => {
      time += 0.005; // slightly faster overall feel

      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;

      const pos = geometry.attributes.position;
      const col = geometry.attributes.color;

      const pad = 600;
      const drift = 0.03; // slightly faster drift

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        p.x -= drift;
        p.y -= drift * 0.2;

        if (p.x < -width / 2 - pad) p.x = width / 2 + pad;
        if (p.y < -height / 2 - pad) p.y = height / 2 + pad;

        const fx = p.x + mouse.x * p.depth;
        const fy = p.y + mouse.y * p.depth;

        pos.setXYZ(i, fx, fy, 0);

        // ✨ stronger, faster twinkle
        const twinkle = Math.sin(time * p.blinkSpeed + p.blinkOffset);
        const intensity = p.brightness * (0.6 + twinkle * 0.4);

        col.setXYZ(i, intensity, intensity, intensity);
      }

      pos.needsUpdate = true;
      col.needsUpdate = true;

      // 🌠 rare shooting stars
      if (Math.random() < 0.003) spawnShootingStar();

      shootingStars.forEach((s, i) => {
        s.line.position.x += 10;
        s.line.position.y -= 5;
        s.life++;

        if (s.life > 50) {
          scene.remove(s.line);
          shootingStars.splice(i, 1);
        }
      });

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