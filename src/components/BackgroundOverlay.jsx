import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundOverlay = () => {
  const mountRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Glow tracking
    const handleMouseMoveGlow = (e) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle 600px at ${e.clientX}px ${e.clientY}px, rgba(255, 255, 255, 0.08), transparent 40%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMoveGlow);

    // THREE.JS SETUP
    const currentMount = mountRef.current;
    if (!currentMount) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      -1000, 1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const SEGMENTS_COUNT = 150;
    const SEGMENT_LENGTH = 20;
    
    const positions = new Float32Array(SEGMENTS_COUNT * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4, // increased opacity so it's clearly visible
    });
    
    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    const particles = [];
    for (let i = 0; i < SEGMENTS_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * window.innerWidth,
        y: (Math.random() - 0.5) * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        speed: 1.0 + Math.random() * 2.0,
      });
    }

    const mousePos = { x: -9999, y: -9999 };
    const handleMouseMoveThree = (e) => {
      mousePos.x = e.clientX - window.innerWidth / 2;
      mousePos.y = -(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMoveThree);

    const handleResize = () => {
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.002;
      const posAttr = geometry.attributes.position;
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let i = 0; i < SEGMENTS_COUNT; i++) {
        const p = particles[i];

        const mapX = p.x * 0.002;
        const mapY = p.y * 0.002;
        let angle = Math.sin(mapX * 1.5 + time) * Math.cos(mapY * 1.5 + time) * Math.PI * 2;
        
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = 40000;

        if (distSq < radiusSq) {
          const force = (radiusSq - distSq) / radiusSq;
          angle += Math.atan2(dy, dx) * force * 1.5;
        }

        p.vx += (Math.cos(angle) * p.speed - p.vx) * 0.1;
        p.vy += (Math.sin(angle) * p.speed - p.vy) * 0.1;

        p.x += p.vx;
        p.y += p.vy;

        const pad = 100; 
        if (p.x < -width / 2 - pad) p.x = width / 2 + pad;
        if (p.x > width / 2 + pad) p.x = -width / 2 - pad;
        if (p.y < -height / 2 - pad) p.y = height / 2 + pad;
        if (p.y > height / 2 + pad) p.y = -height / 2 - pad;

        const headIdx = i * 2;
        const tailIdx = i * 2 + 1;

        posAttr.setXYZ(headIdx, p.x, p.y, 0);
        posAttr.setXYZ(tailIdx, p.x - p.vx * SEGMENT_LENGTH, p.y - p.vy * SEGMENT_LENGTH, 0);
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlow);
      window.removeEventListener('mousemove', handleMouseMoveThree);
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
    <div className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      <div 
        ref={glowRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: 1,
          background: 'transparent',
          mixBlendMode: 'screen'
        }} 
      />
    </div>
  );
};

export default BackgroundOverlay;
