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
    // 🌫️ NEBULA GRADIENT LAYER
    // =========================
    const nebulaTexture = new THREE.CanvasTexture(generateNebula());
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      map: nebulaTexture,
      transparent: true,
      opacity: 0.25,
    });

    const nebulaMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      nebulaMaterial
    );
    scene.add(nebulaMesh);

    function generateNebula() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
      gradient.addColorStop(0, 'rgba(120,140,255,0.3)');
      gradient.addColorStop(0.5, 'rgba(80,100,255,0.15)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      return canvas;
    }

    // =========================
    // 🌌 MILKY WAY BAND
    // =========================
    const milkyTexture = new THREE.CanvasTexture(generateMilkyWay());
    const milkyMaterial = new THREE.MeshBasicMaterial({
      map: milkyTexture,
      transparent: true,
      opacity: 0.3,
    });

    const milkyWay = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 1.5, height * 0.5),
      milkyMaterial
    );

    milkyWay.rotation.z = -0.3;
    scene.add(milkyWay);

    function generateMilkyWay() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createLinearGradient(0, 128, 512, 128);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.25)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);

      return canvas;
    }

    // =========================
    // ⭐ STARS
    // =========================
    const COUNT = 250;
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
        blinkSpeed: 0.003 + Math.random() * 0.004,
        isBlinker: Math.random() > 0.2,
        depth: Math.random() * 0.5 + 0.5,
      });

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // =========================
    // 🌠 SHOOTING STARS
    // =========================
    const shootingStars = [];

    function spawnShootingStar() {
      const geometry = new THREE.BufferGeometry();
      const verts = new Float32Array([0, 0, 0, 100, -50, 0]);

      geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3));

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });

      const line = new THREE.Line(geometry, material);

      line.position.set(
        Math.random() * width - width / 2,
        height / 2,
        0
      );

      scene.add(line);

      shootingStars.push({
        line,
        life: 0,
      });
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
      time += 0.003;

      mouse.x += (target.x - mouse.x) * 0.03;
      mouse.y += (target.y - mouse.y) * 0.03;

      const pos = starGeo.attributes.position;
      const col = starGeo.attributes.color;

      const pad = 600;
      const drift = 0.015;

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        p.x -= drift;
        p.y -= drift * 0.2;

        if (p.x < -width / 2 - pad) p.x = width / 2 + pad;
        if (p.y < -height / 2 - pad) p.y = height / 2 + pad;

        const fx = p.x + mouse.x * p.depth;
        const fy = p.y + mouse.y * p.depth;

        pos.setXYZ(i, fx, fy, 0);

        const twinkle = Math.sin(time * p.blinkSpeed + p.blinkOffset);
        const intensity = p.brightness * (0.8 + twinkle * 0.2);

        col.setXYZ(i, intensity, intensity, intensity);
      }

      pos.needsUpdate = true;
      col.needsUpdate = true;

      // shooting stars (rare)
      if (Math.random() < 0.002) spawnShootingStar();

      shootingStars.forEach((s, i) => {
        s.line.position.x += 8;
        s.line.position.y -= 4;
        s.life++;

        if (s.life > 60) {
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