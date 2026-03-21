import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundOverlay = () => {
  const mountRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // --------------------------------------------------------
    // MOUSE TRACKING FOR GLOW
    // --------------------------------------------------------
    const handleMouseMoveGlow = (e) => {
      if (glowRef.current) {
        // Adjust radial gradient center. Provides a soft glow.
        glowRef.current.style.background = `radial-gradient(circle 600px at ${e.clientX}px ${e.clientY}px, rgba(255, 255, 255, 0.05), transparent 40%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMoveGlow);

    // --------------------------------------------------------
    // THREE.JS ANIMATION
    // --------------------------------------------------------
    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pure black

    // Orthographic camera for simplicity & ignoring perspective scaling issues
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      0.1, 10
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap pixel ratio for performance
    currentMount.appendChild(renderer.domElement);

    // 100-200 line segments
    const SEGMENTS_COUNT = 150;
    const SEGMENT_LENGTH = 12;
    
    // Each line has a standard format: [x1, y1, z1, x2, y2, z2]
    const positions = new Float32Array(SEGMENTS_COUNT * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });
    
    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    // Custom data to manage line animation
    const particles = [];
    for (let i = 0; i < SEGMENTS_COUNT; i++) {
        // distribute initially over a larger area
      particles.push({
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        vx: 0,
        vy: 0,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    // Normalized mouse [-1, 1] mapped up to innerWidth, innerHeight space for distance calculation
    const mousePos = { x: -9999, y: -9999 };
    const handleMouseMoveThree = (e) => {
      mousePos.x = e.clientX - window.innerWidth / 2;
      mousePos.y = -(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMoveThree);

    // Window Resize
    const handleResize = () => {
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let time = 0;

    const animate = () => {
      // Pause if tab is inactive
      if (!document.hidden) {
        time += 0.0015;
        const posAttr = geometry.attributes.position;
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < SEGMENTS_COUNT; i++) {
          const p = particles[i];

          // Noise-driven flow field (minimal approximation using sine/cosine combo)
          // scaled by window dimensions for fluid wrapping
          const mapX = p.x * 0.003;
          const mapY = p.y * 0.003;
          
          let angle = Math.sin(mapX * 1.5 + time) * Math.cos(mapY * 1.5 + time) * Math.PI * 2;
          
          // Cursor interaction (distortion)
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = 30000; // interaction radius squared

          if (distSq < radiusSq) {
            const force = (radiusSq - distSq) / radiusSq;
            // Bend towards or away from cursor? "bend away or toward"
            // Let's make it bend away naturally
            angle += Math.atan2(dy, dx) * force * 0.6;
          }

          // Update velocity tracking the angle smoothly
          p.vx += (Math.cos(angle) * p.speed - p.vx) * 0.08;
          p.vy += (Math.sin(angle) * p.speed - p.vy) * 0.08;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges smoothly by checking slightly outside the view
          const pad = 50; 
          if (p.x < -width / 2 - pad) p.x = width / 2 + pad;
          if (p.x > width / 2 + pad) p.x = -width / 2 - pad;
          if (p.y < -height / 2 - pad) p.y = height / 2 + pad;
          if (p.y > height / 2 + pad) p.y = -height / 2 - pad;

          // Trail calculation: Head is pos, Tail is pos - velocity*length
          const headIdx = i * 2;
          const tailIdx = i * 2 + 1;

          // head
          posAttr.setXYZ(headIdx, p.x, p.y, 0);
          // tail
          posAttr.setXYZ(tailIdx, p.x - p.vx * SEGMENT_LENGTH, p.y - p.vy * SEGMENT_LENGTH, 0);
        }

        posAttr.needsUpdate = true;
        renderer.render(scene, camera);
      }
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
    <div className="canvas-container" style={{ background: '#000000', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
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
