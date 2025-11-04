import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BUILD_ENV } from '@mocanetwork/airkit';
import { getAirService } from './services/airService';
import { Leaf, Award, Sparkles, Globe } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import SecondaryMarket from './pages/SecondaryMarket';
import Credentials from './pages/Credentials';
import './App.css';
import logo from './assets/carbonchain.jpg';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const airService = getAirService();
      await airService.init({ buildEnv: BUILD_ENV.SANDBOX, enableLogging: true });
      setIsInitialized(true);
      if (airService.isLoggedIn) {
        const userInfo = await airService.getUserInfo();
        setUserData(userInfo.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Init error:', error);
    }
  };

  const handleLogin = async () => {
    if (!isInitialized) return;
    setIsLoading(true);
    try {
      const airService = getAirService();
      const result = await airService.login();
      if (result.isLoggedIn) {
        const userInfo = await airService.getUserInfo();
        setUserData(userInfo.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const airService = getAirService();
    await airService.logout();
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="stars"></div>
        <div className="login-container">
          <div className="logo-section animate-float">
            <img src={logo} alt="CarbonChain" className="logo-image pulse-glow" />
            <h1 className="gradient-text">CarbonChain</h1>
            <p className="tagline">Carbon Credit Marketplace</p>
          </div>
          <div className="login-card glass-effect">
            <h2>Welcome to CarbonChain</h2>
            <p className="description">
              Trade carbon credits and create <span className="highlight">verifiable credentials</span> using <span className="highlight">zero-knowledge proofs</span>.
            </p>
            <button onClick={handleLogin} disabled={isLoading || !isInitialized} className="login-button glow-button">
              {!isInitialized ? <><div className="spinner"></div> Initializing...</> : isLoading ? <><div className="spinner"></div> Connecting...</> : <><Sparkles size={20} /> Login with AIR</>}
            </button>
            <div className="features">
              <div className="feature"><Leaf size={24} /><span>Carbon Credits</span></div>
              <div className="feature"><Award size={24} /><span>Verification</span></div>
              <div className="feature"><Sparkles size={24} /><span>ZK Proofs</span></div>
            </div>
            <div className="powered-by"><Globe size={16} /><span>Powered by Moca Network</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <div className="stars"></div>
        <Navbar 
          onLogout={handleLogout} 
          userAddress={userData?.abstractAccountAddress} 
        />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/credentials" element={<Credentials />} />
            <Route path="/market" element={<SecondaryMarket />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
