import React, { useState, useEffect } from 'react';
import { getAirService } from '../services/airService';
import { Wallet, TrendingUp, Award, Calendar, ExternalLink, Leaf } from 'lucide-react';
import './Portfolio.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://carbonchain.coinsspor.com';

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const airService = getAirService();
      const userInfo = await airService.getUserInfo();
      const userAddress = userInfo.user.abstractAccountAddress;
      setUserId(userAddress);

      const response = await fetch(`${BACKEND_URL}/api/portfolio/${userAddress}`);
      const data = await response.json();

      if (data.success) {
        setPortfolio(data.portfolio);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num || num === null || num === undefined) return '0';
    return num.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner"></div>
        <p>Loading your portfolio...</p>
      </div>
    );
  }

  const hasCredits = portfolio && portfolio.activeCredits && portfolio.activeCredits.length > 0;

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <h1 className="gradient-text">My Portfolio</h1>
        <p className="portfolio-subtitle">Manage your carbon credits</p>
      </div>

      {/* STATS CARDS */}
      <div className="portfolio-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Credits</span>
            <span className="stat-value">{formatNumber(portfolio?.totalQuantity || 0)} tCO2</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">${formatNumber(portfolio?.totalValue?.toFixed(2) || 0)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Purchases</span>
            <span className="stat-value">{portfolio?.totalPurchases || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Leaf size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Retired</span>
            <span className="stat-value">{formatNumber(portfolio?.totalRetired || 0)} tCO2</span>
          </div>
        </div>
      </div>

      {/* ACTIVE CREDITS */}
      <div className="portfolio-section">
        <h2>Active Credits</h2>
        {hasCredits ? (
          <div className="credits-list">
            {portfolio.activeCredits.map((credit, index) => (
              <div key={index} className="credit-card">
                <div className="credit-header">
                  <div className="credit-badge">{credit.registry}</div>
                  <div className="credit-status active">Active</div>
                </div>

                <h3 className="credit-name">{credit.projectName}</h3>

                <div className="credit-details">
                  <div className="credit-detail">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{formatNumber(credit.quantity)} tCO2</span>
                  </div>

                  <div className="credit-detail">
                    <span className="detail-label">Price per ton</span>
                    <span className="detail-value">${credit.pricePerTon}</span>
                  </div>

                  <div className="credit-detail">
                    <span className="detail-label">Total Value</span>
                    <span className="detail-value highlight">${credit.totalPrice?.toFixed(2)}</span>
                  </div>

                  <div className="credit-detail">
                    <span className="detail-label">Purchase Date</span>
                    <span className="detail-value">{formatDate(credit.purchaseDate)}</span>
                  </div>
                </div>

                <div className="credit-id">
                  <Calendar size={14} />
                  <span>ID: {credit.id}</span>
                </div>

                {credit.credentialId && (
                  <div className="credential-badge">
                    <Award size={16} />
                    <span>Verified Credential</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Wallet size={64} />
            <h3>No Active Credits</h3>
            <p>You haven't purchased any carbon credits yet.</p>
            <a href="/marketplace" className="cta-button">
              Browse Marketplace
            </a>
          </div>
        )}
      </div>

      {/* PURCHASE HISTORY */}
      {portfolio && portfolio.purchases && portfolio.purchases.length > 0 && (
        <div className="portfolio-section">
          <h2>Purchase History</h2>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Registry</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.purchases.map((purchase, index) => (
                  <tr key={index}>
                    <td>{formatDate(purchase.purchaseDate)}</td>
                    <td className="project-name">{purchase.projectName}</td>
                    <td>
                      <span className="registry-tag">{purchase.registry}</span>
                    </td>
                    <td>{formatNumber(purchase.quantity)} tCO2</td>
                    <td>${purchase.totalPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`status-tag ${purchase.status}`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RETIREMENTS */}
      {portfolio && portfolio.retirements && portfolio.retirements.length > 0 && (
        <div className="portfolio-section">
          <h2>Retirement History</h2>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Quantity</th>
                  <th>Beneficiary</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.retirements.map((retirement, index) => (
                  <tr key={index}>
                    <td>{formatDate(retirement.retirementDate)}</td>
                    <td className="project-name">{retirement.projectName}</td>
                    <td>{formatNumber(retirement.quantity)} tCO2</td>
                    <td>{retirement.beneficiary}</td>
                    <td>
                      <span className="certificate-link">
                        <ExternalLink size={14} />
                        {retirement.certificateId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
