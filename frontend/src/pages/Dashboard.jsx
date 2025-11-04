import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Award, DollarSign } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://carbonchain.coinsspor.com';

function Dashboard() {
  const [marketStats, setMarketStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchMarketStats();
  }, []);

  const fetchMarketStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/credits/stats`);
      const data = await response.json();
      if (data.success) {
        setMarketStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

const formatNumber = (num) => {
  if (!num || num === null || num === undefined) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

  if (statsLoading) {
    return (
      <div className="stats-loading">
        <div className="spinner"></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  if (!marketStats) {
    return (
      <div className="stats">
        <h3>Welcome to CarbonChain!</h3>
        <p>Your carbon credit marketplace is ready.</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="stats-header">
        <h2 className="gradient-text">Carbon Credit Market</h2>
        <p className="stats-subtitle">Real-time data from Verra, Gold Standard, and more</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Projects</p>
            <h3 className="stat-value">{formatNumber(marketStats.totalProjects)}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Credits Issued</p>
            <h3 className="stat-value">{formatNumber(marketStats.totalIssued)} tCO2</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Credits Retired</p>
            <h3 className="stat-value">{formatNumber(marketStats.totalRetired)} tCO2</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Available Credits</p>
            <h3 className="stat-value">{formatNumber(marketStats.available)} tCO2</h3>
          </div>
        </div>
      </div>

      <div className="registries-section">
        <h3>Projects by Registry</h3>
        <div className="registry-list">
          {Object.entries(marketStats.byRegistry).map(([registry, count]) => (
            <div key={registry} className="registry-item">
              <span className="registry-name">{registry}</span>
              <span className="registry-count">{formatNumber(count)} projects</span>
            </div>
          ))}
        </div>
      </div>

      <div className="countries-section">
        <h3>Top Countries</h3>
        <div className="country-list">
          {marketStats.topCountries.map((item, index) => (
            <div key={index} className="country-item">
              <span className="country-rank">#{index + 1}</span>
              <span className="country-name">{item.country}</span>
              <span className="country-count">{item.count} projects</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
