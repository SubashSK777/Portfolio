import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="nav-container">
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Index
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Profile
        </NavLink>
        <NavLink to="/experience" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Experience
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Projects
        </NavLink>
        <NavLink to="/publications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Research
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Contact
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
