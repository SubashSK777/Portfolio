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
    const PARTICLE_COUNT = 4000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    
    // Initialize properties
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * window.innerWidth;
        const y = (Math.random() - 0.5) * window.innerHeight;
        
        particles.push({
            x: x,
            y: y,
            speed: 0.08 + Math.random() * 0.18, // Buttery slow
            offsetX: Math.random() * 40000,
            offsetY: Math.random() * 40000,
            blinkOffset: Math.random() * Math.PI * 2,
            blinkSpeed: 0.01 + Math.random() * 0.03,
            isBlinker: Math.random() > 0.6 // Increased blinkers for "star" effect
        });

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;

        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.0, 
        transparent: true,
        vertexColors: true,
        opacity: 0.65,
        sizeAttenuation: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

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
        time += 0.0001; // Extremely slow
        const posAttr = geometry.attributes.position;
        const colorAttr = geometry.attributes.color;
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];

            // Ultra-large scale noise field for maximum "buttery" smoothness
            const scale = 0.0004; 
            const noise = (Math.sin(p.x * scale + time + p.offsetX) + Math.cos(p.y * scale + time + p.offsetY)) * 0.5;
            
            // Subtle directional bias
            let angle = 0.7 + noise * 0.6; 

            // Peaceful Interaction - very subtle push
            const dx = p.x - mousePos.x;
            const dy = p.y - mousePos.y;
            const distSq = dx * dx + dy * dy;
            const radiusSq = 30000;

            if (distSq > 0 && distSq < radiusSq) {
                const force = (radiusSq - distSq) / radiusSq;
                const targetAngle = Math.atan2(dy, dx);
                angle += (targetAngle - angle) * force * 0.5;
            }

            // Smooth buttery movement
            p.x += Math.cos(angle) * p.speed;
            p.y += Math.sin(angle) * p.speed;

            // Wrapping bounds
            const pad = 40;
            if (p.x < -width/2 - pad) p.x = width/2 + pad;
            else if (p.x > width/2 + pad) p.x = -width/2 - pad;

            if (p.y < -height/2 - pad) p.y = height/2 + pad;
            else if (p.y > height/2 + pad) p.y = -height/2 - pad;

            posAttr.setXYZ(i, p.x, p.y, 0);

            // "Star" twinkling effect
            if (p.isBlinker) {
                const b = 0.35 + Math.abs(Math.sin(time * 25 * p.blinkSpeed + p.blinkOffset)) * 0.65;
                colorAttr.setXYZ(i, b, b, b);
            }
        }

        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
        renderer.render(scene, camera);
        
        animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (currentMount) currentMount.removeChild(renderer.domElement);
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
            zIndex: 0, 
            pointerEvents: 'none'
        }} 
        ref={mountRef} 
    />
  );
};

export default BackgroundOverlay;
