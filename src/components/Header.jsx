// src/components/Header.jsx
import React from 'react';
import logo from '../assets/WattWillstDu.png';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="WattWillstDu Logo" className="logo" />
      </div>
      {/* Andere Header-Elemente, falls vorhanden */}
    </div>
  );
}

export default Header;
