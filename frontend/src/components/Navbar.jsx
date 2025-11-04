import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Wallet, Award, LogOut, TrendingUp } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/carbonchain.jpg';

function Navbar({ onLogout, userAddress }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="CarbonChain" className="navbar-logo-img" />
          <span className="navbar-brand">CarbonChain</span>
        </div>

        <div className="navbar-menu">
          <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <Link to="/marketplace" className={`navbar-link ${isActive('/marketplace') ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span>Marketplace</span>
          </Link>

          <Link to="/market" className={`navbar-link ${isActive('/market') ? 'active' : ''}`}>
            <TrendingUp size={20} />
            <span>Secondary Market</span>
          </Link>

          <Link to="/portfolio" className={`navbar-link ${isActive('/portfolio') ? 'active' : ''}`}>
            <Wallet size={20} />
            <span>Portfolio</span>
          </Link>

          <Link to="/credentials" className={`navbar-link ${isActive('/credentials') ? 'active' : ''}`}>
            <Award size={20} />
            <span>Credentials</span>
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-address">{userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}</div>
          <button onClick={onLogout} className="navbar-logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
