import React, { useState, useEffect } from 'react';
import logo from '../Utils/logo.png';
import './NavBar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToFeatures = () => {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
       <a href="/" className="nav-logo">
        <div className="nav-logo">
          <span className="logo-icon"><img src={logo} style={{height:"100px", width:"100px"}} ></img></span>
          <span className="logo-text">NeuroAi</span>
        </div>
       </a>
        <div className="nav-links">
          <a href="#features" onClick={scrollToFeatures}>Features</a>
          <a href="#about">About</a>
          <a href="#contact">Support</a>
          <a href="/login" className="nav-button login-btn">Sign In</a>
          <a href="/signup" className="nav-button signup-btn">Sign Up</a>
        </div>
        <div className="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
