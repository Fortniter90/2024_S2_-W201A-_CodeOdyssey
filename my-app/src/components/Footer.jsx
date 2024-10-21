import React from "react";
import Star from "./assets/Star";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        {/* Star Asset */}
        <Star size="small" />

        {/* Navigation Links */}
        <nav className='footer-nav roboto-bold'>
          <a href="/" data-testid="home-link">HOME</a>
          <a href="/resources" data-testid="resources-link" className='footer-nav-centered'>RESOURCES</a>
          <a href="/about" data-testid="about-link">ABOUT US</a>
        </nav>

        {/* Horizontal Line */}
        <hr />

        {/* Copyright */}
        <p className='roboto-regular'>&copy; 2024 Code Odyssey. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
