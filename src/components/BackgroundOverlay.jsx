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
    const SEGMENTS_COUNT = 100; // Total noodles
    const HISTORY_LENGTH = 15; // Segments per noodle
    const TOTAL_SEGMENTS = SEGMENTS_COUNT * (HISTORY_LENGTH - 1);
    
    const linePositions = new Float32Array(TOTAL_SEGMENTS * 2 * 3);
    const dotPositions = new Float32Array(SEGMENTS_COUNT * 3);
    
    // Initialize properties
    const particles = [];
    for (let i = 0; i < SEGMENTS_COUNT; i++) {
        const x = (Math.random() - 0.5) * window.innerWidth;
        const y = (Math.random() - 0.5) * window.innerHeight;
        
        const history = [];
        for (let j = 0; j < HISTORY_LENGTH; j++) {
            history.push({ x, y });
        }

        particles.push({
            x: x,
            y: y,
            history: history,
            speed: 0.6 + Math.random() * 0.8, // "Slow" lines
            offsetX: Math.random() * 5000,
            offsetY: Math.random() * 5000
        });
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
    });

    const dotMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2.5,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: false
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    
    scene.add(lines);
    scene.add(dots);

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
        time += 0.0008; // "Slow" flow
        const linePosAttr = lineGeometry.attributes.position;
        const dotPosAttr = dotGeometry.attributes.position;
        const width = window.innerWidth;
        const height = window.innerHeight;

        let segmentIdx = 0;

        for (let i = 0; i < SEGMENTS_COUNT; i++) {
            const p = particles[i];

            // Flow field calculation (slimy/smooth)
            const scale = 0.001;
            let angle = Math.sin(p.x * scale + time + p.offsetX) * 2 + Math.cos(p.y * scale + time + p.offsetY) * 2;

            // Interaction calculation
            const dx = p.x - mousePos.x;
            const dy = p.y - mousePos.y;
            const distSq = dx * dx + dy * dy;
            const radiusSq = 40000;

            if (distSq > 0 && distSq < radiusSq) {
                const force = (radiusSq - distSq) / radiusSq;
                const targetAngle = Math.atan2(dy, dx);
                angle += (targetAngle - angle) * force * 2.5;
            }

            const vx = Math.cos(angle);
            const vy = Math.sin(angle);

            p.x += vx * p.speed;
            p.y += vy * p.speed;

            // Wrapping bounds
            const pad = 150;
            let wrapped = false;
            if (p.x < -width/2 - pad) { p.x = width/2 + pad; wrapped = true; }
            else if (p.x > width/2 + pad) { p.x = -width/2 - pad; wrapped = true; }

            if (p.y < -height/2 - pad) { p.y = height/2 + pad; wrapped = true; }
            else if (p.y > height/2 + pad) { p.y = -height/2 - pad; wrapped = true; }

            // Update history
            if (wrapped) {
                for(let j=0; j<HISTORY_LENGTH; j++) {
                    p.history[j].x = p.x;
                    p.history[j].y = p.y;
                }
            } else {
                p.history.unshift({ x: p.x, y: p.y });
                p.history.pop();
            }

            // Update line segments (noodles)
            for (let j = 0; j < HISTORY_LENGTH - 1; j++) {
                const h1 = p.history[j];
                const h2 = p.history[j+1];

                linePosAttr.setXYZ(segmentIdx, h1.x, h1.y, 0);
                linePosAttr.setXYZ(segmentIdx + 1, h2.x, h2.y, 0);
                segmentIdx += 2;
            }

            // Update leading dot
            dotPosAttr.setXYZ(i, p.x, p.y, 0);
        }

        linePosAttr.needsUpdate = true;
        dotPosAttr.needsUpdate = true;
        renderer.render(scene, camera);
        
        animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (currentMount) currentMount.removeChild(renderer.domElement);
        lineGeometry.dispose();
        dotGeometry.dispose();
        lineMaterial.dispose();
        dotMaterial.dispose();
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
