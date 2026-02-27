import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import BackgroundOverlay from './components/BackgroundOverlay';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import Contact from './pages/Contact';
import './index.css';

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = React.useState({ x: -100, y: -100 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="custom-cursor-dot" style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="custom-cursor-ring" style={{ left: cursorPos.x, top: cursorPos.y }} />
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const attachHoverEvents = () => {
      const interactables = document.querySelectorAll('a, button, .minimal-card');
      interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };
    attachHoverEvents();
    const observer = new MutationObserver(attachHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`app-container ${isHovering ? 'hovering' : ''}`}>
      <CustomCursor />
      <BackgroundOverlay />
      <Router>
        <Navbar />
        <AnimatedRoutes />
      </Router>
    </div>
  );
}

export default App;
