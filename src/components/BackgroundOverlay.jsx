import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundOverlay = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Setup (scene, camera, renderer)
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      -1000, 1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    currentMount.appendChild(renderer.domElement);

    // 2. Geometry creation
    const SEGMENTS_COUNT = 150;
    const SEGMENT_LENGTH = 40;
    const positions = new Float32Array(SEGMENTS_COUNT * 2 * 3);
    
    // Initialize properties
    const particles = [];
    for (let i = 0; i < SEGMENTS_COUNT; i++) {
      const x = (Math.random() - 0.5) * window.innerWidth;
      const y = (Math.random() - 0.5) * window.innerHeight;
      
      particles.push({
        x: x,
        y: y,
        speed: 1.5 + Math.random() * 1.5
      });

      // head
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = 0;
      
      // tail
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y - SEGMENT_LENGTH;
      positions[i * 6 + 5] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      linewidth: 1
    });

    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    // 4. Interaction handling
    const mousePos = { x: -9999, y: -9999 };
    const handleMouseMove = (e) => {
      mousePos.x = e.clientX - window.innerWidth / 2;
      mousePos.y = -(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();
      
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 3. Animation loop
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.002;
      const posAttr = geometry.attributes.position;
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let i = 0; i < SEGMENTS_COUNT; i++) {
        const p = particles[i];

        // Ensure safe numeric values
        if (isNaN(p.x)) p.x = 0;
        if (isNaN(p.y)) p.y = 0;

        // Flow field calculation
        const scale = 0.002;
        let angle = Math.sin(p.x * scale + time) + Math.cos(p.y * scale + time);

        // Interaction calculation
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = 25000;

        if (distSq > 0 && distSq < radiusSq) {
          const force = (radiusSq - distSq) / radiusSq;
          const targetAngle = Math.atan2(dy, dx);
          angle += (targetAngle - angle) * force;
        }

        // Convert angle into normalized directional velocity
        const vx = Math.cos(angle);
        const vy = Math.sin(angle);

        // Update position
        p.x += vx * p.speed;
        p.y += vy * p.speed;

        // Wrapping bounds cleanly
        const pad = SEGMENT_LENGTH * 2;
        if (p.x < -width / 2 - pad) {
          p.x = width / 2 + pad;
        } else if (p.x > width / 2 + pad) {
          p.x = -width / 2 - pad;
        }

        if (p.y < -height / 2 - pad) {
          p.y = height / 2 + pad;
        } else if (p.y > height / 2 + pad) {
          p.y = -height / 2 - pad;
        }

        // Render head and tail
        const headIdx = i * 2;
        const tailIdx = i * 2 + 1;

        posAttr.setXYZ(headIdx, p.x, p.y, 0);
        posAttr.setXYZ(tailIdx, p.x - vx * SEGMENT_LENGTH, p.y - vy * SEGMENT_LENGTH, 0);
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
        style={{ 
            position: 'fixed', 
            top: 0, left: 0, 
            width: '100%', height: '100%', 
            zIndex: -1, 
            backgroundColor: '#000000',
            pointerEvents: 'none'
        }} 
        ref={mountRef} 
    />
  );
};

export default BackgroundOverlay;
