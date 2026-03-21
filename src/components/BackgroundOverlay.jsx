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
    const PARTICLE_COUNT = 2500;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    
    // Use container dimensions
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Jittered Grid for truly uniform distribution
    const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (width / height)));
    const rows = Math.ceil(PARTICLE_COUNT / cols);
    const cellW = width / cols;
    const cellH = height / rows;

    const particles = [];
    let pIdx = 0;
    for (let r = 0; r < rows && pIdx < PARTICLE_COUNT; r++) {
        for (let c = 0; c < cols && pIdx < PARTICLE_COUNT; c++) {
            // Position within cell + jitter
            const x = (c * cellW + Math.random() * cellW) - width / 2;
            const y = -(r * cellH + Math.random() * cellH) + height / 2;
            
            particles.push({
                x: x,
                y: y,
                flowX: x,
                flowY: y,
                vx: 0,
                vy: 0,
                baseSpeed: 0.1 + Math.random() * 0.2, 
                offsetX: Math.random() * 100000,
                offsetY: Math.random() * 100000,
                blinkOffset: Math.random() * Math.PI * 2,
                blinkSpeed: 0.01 + Math.random() * 0.03,
                isBlinker: Math.random() > 0.4,
                dirMult: Math.random() > 0.5 ? 1 : -1 // Multi-directional flow
            });

            positions[pIdx * 3] = x;
            positions[pIdx * 3 + 1] = y;
            positions[pIdx * 3 + 2] = 0;

            colors[pIdx * 3] = 1;
            colors[pIdx * 3 + 1] = 1;
            colors[pIdx * 3 + 2] = 1;
            pIdx++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.2, 
        transparent: true,
        vertexColors: true,
        opacity: 0.7,
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
        time += 0.00015; 
        const posAttr = geometry.attributes.position;
        const colorAttr = geometry.attributes.color;
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];

            // 1. Update the "River Flow" position (the anchor)
            const scale = 0.0004; 
            const noise = (Math.sin(p.flowX * scale + time + p.offsetX) + Math.cos(p.flowY * scale + time + p.offsetY)) * 0.5;
            const flowAngle = (0.7 + noise * 0.6) * p.dirMult; 

            p.flowX += Math.cos(flowAngle) * p.baseSpeed;
            p.flowY += Math.sin(flowAngle) * p.baseSpeed;

            // Wrapping for flow position
            const pad = 100;
            if (p.flowX < -width/2 - pad) p.flowX = width/2 + pad;
            else if (p.flowX > width/2 + pad) p.flowX = -width/2 - pad;
            if (p.flowY < -height/2 - pad) p.flowY = height/2 + pad;
            else if (p.flowY > height/2 + pad) p.flowY = -height/2 - pad;

            // 2. Interaction (Ripple/Push)
            const dx = p.x - mousePos.x;
            const dy = p.y - mousePos.y;
            const distSq = dx * dx + dy * dy;
            const radiusSq = 45000; // Larger area of effect

            if (distSq < radiusSq) {
                const force = (radiusSq - distSq) / radiusSq;
                const repelAngle = Math.atan2(dy, dx);
                // Apply a softer impulse away from mouse for "smoother" push
                p.vx += Math.cos(repelAngle) * force * 0.8;
                p.vy += Math.sin(repelAngle) * force * 0.8;
            }

            // 3. Elastic Return (Snap back to river position)
            const springForce = 0.04; // Slightly slower recovery for "smoothness"
            p.vx += (p.flowX - p.x) * springForce;
            p.vy += (p.flowY - p.y) * springForce;

            // 4. Friction & Physics Update
            p.vx *= 0.94; // Higher friction for a more "viscous/buttery" feel
            p.vy *= 0.94;
            p.x += p.vx;
            p.y += p.vy;

            posAttr.setXYZ(i, p.x, p.y, 0);

            // 5. Twinkle
            if (p.isBlinker) {
                const b = 0.4 + Math.abs(Math.sin(time * 30 * p.blinkSpeed + p.blinkOffset)) * 0.6;
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
