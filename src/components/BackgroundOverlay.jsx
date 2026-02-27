import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function MovingStars() {
  const ref = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const baseRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse coordinates to -1 -> +1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // 1. Independent constant rotation always ticking forward
    baseRotation.current.x -= 0.0003;
    baseRotation.current.y -= 0.0008;

    // 2. Parallax targets driven by mouse tracker
    const targetParallaxX = mouse.current.y * 0.15;
    const targetParallaxY = mouse.current.x * 0.15;

    // 3. Absolute Target Matrix combining both physical motions
    const targetX = baseRotation.current.x + targetParallaxX;
    const targetY = baseRotation.current.y + targetParallaxY;

    // 4. Smooth easing into the target matrix
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05;
  });

  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={6000} factor={6} saturation={0} fade speed={1} />
    </group>
  );
}

const BackgroundOverlay = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <MovingStars />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, transparent 0%, var(--bg-primary) 80%)', pointerEvents: 'none', zIndex: 1 }} />
    </div>
  );
};

export default BackgroundOverlay;
