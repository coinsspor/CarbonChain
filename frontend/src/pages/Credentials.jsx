import React, { useState, useEffect } from 'react';
import { getAirService } from '../services/airService';
import { Award, CheckCircle, Calendar, MapPin, ExternalLink, Shield, Download } from 'lucide-react';
import './Credentials.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://carbonchain.coinsspor.com';

function Credentials() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const airService = getAirService();
      const userInfo = await airService.getUserInfo();
      const userAddress = userInfo.user.abstractAccountAddress;

      // Portfolio'dan purchase'ları çek (credentials bunların içinde)
      const response = await fetch(`${BACKEND_URL}/api/portfolio/${userAddress}`);
      const data = await response.json();

      if (data.success && data.portfolio.purchases) {
        // Her purchase için credential oluştur
        const creds = data.portfolio.purchases.map(purchase => ({
          id: purchase.credentialId || purchase.id,
          type: 'CarbonCreditCredential',
          status: 'Verified',
          issuanceDate: purchase.purchaseDate,
          project: {
            name: purchase.projectName,
            registry: purchase.registry,
            id: purchase.projectId
          },
          credits: {
            quantity: purchase.quantity,
            vintage: 2024,
            price: purchase.pricePerTon
          }
        }));
        setCredentials(creds);
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="credentials-loading">
        <div className="spinner"></div>
        <p>Loading your credentials...</p>
      </div>
    );
  }

  const hasCredentials = credentials && credentials.length > 0;

  return (
    <div className="credentials">
      <div className="credentials-header">
        <h1 className="gradient-text">My Credentials</h1>
        <p className="credentials-subtitle">Verifiable carbon credit certificates</p>
      </div>

      <div className="credentials-info-banner">
        <Shield size={24} />
        <div>
          <h3>Powered by AIR Protocol</h3>
          <p>All credentials are cryptographically signed and verifiable on-chain</p>
        </div>
      </div>
<div className="demo-warning">
        <span className="warning-icon">ℹ️</span>
        <div>
          <strong>Demo Mode:</strong> These are demonstration credentials. 
          In production, credentials would be fully issued via AIR Protocol with on-chain verification.
        </div>
      </div>
      {hasCredentials ? (
        <>
          <div className="credentials-stats">
            <div className="stat-item">
              <Award size={20} />
              <span>{credentials.length} Credentials Issued</span>
            </div>
            <div className="stat-item">
              <CheckCircle size={20} />
              <span>All Verified</span>
            </div>
          </div>

          <div className="credentials-grid">
            {credentials.map((credential, index) => (
              <div key={index} className="credential-card">
                <div className="credential-card-header">
                  <div className="credential-type">
                    <Award size={20} />
                    <span>Carbon Credit Certificate</span>
                  </div>
                  <div className="credential-status verified">
                    <CheckCircle size={16} />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="credential-body">
                  <h3 className="credential-title">{credential.project.name}</h3>

                  <div className="credential-details">
                    <div className="detail-row">
                      <span className="detail-icon">
                        <MapPin size={16} />
                      </span>
                      <div className="detail-content">
                        <span className="detail-label">Registry</span>
                        <span className="detail-value">{credential.project.registry}</span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">
                        <Award size={16} />
                      </span>
                      <div className="detail-content">
                        <span className="detail-label">Credits</span>
                        <span className="detail-value">
                          {formatNumber(credential.credits.quantity)} tCO2
                        </span>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">
                        <Calendar size={16} />
                      </span>
                      <div className="detail-content">
                        <span className="detail-label">Issued</span>
                        <span className="detail-value">
                          {formatDate(credential.issuanceDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="credential-id">
                    <span>Credential ID:</span>
                    <code>{credential.id}</code>
                  </div>
                </div>

               <div className="credential-footer">
  <button 
    className="btn-secondary"
    onClick={() => {
      alert(`Credential Details:\n\nID: ${credential.id}\nProject: ${credential.project.name}\nRegistry: ${credential.project.registry}\nCredits: ${formatNumber(credential.credits.quantity)} tCO2\nIssued: ${formatDate(credential.issuanceDate)}`);
    }}
  >
    <ExternalLink size={16} />
    View Details
  </button>
  <button 
    className="btn-primary"
    onClick={() => {
      // JSON olarak indir
      const dataStr = JSON.stringify(credential, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `credential-${credential.id}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }}
  >
    <Download size={16} />
    Download
  </button>
</div>

                <div className="credential-badge">
                  <Shield size={14} />
                  <span>AIR Protocol</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-credentials">
          <Award size={64} />
          <h3>No Credentials Yet</h3>
          <p>Purchase carbon credits to receive verifiable credentials</p>
          <a href="/marketplace" className="cta-button">
            Browse Marketplace
          </a>
        </div>
      )}
    </div>
  );
}

export default Credentials;
