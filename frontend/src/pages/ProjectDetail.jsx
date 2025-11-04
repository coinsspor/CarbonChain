import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Award, Calendar, CheckCircle, ShoppingCart, ExternalLink, X } from 'lucide-react';
import { getAirService } from '../services/airService';
import './ProjectDetail.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://carbonchain.coinsspor.com';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/credits/${projectId}`);
      const data = await response.json();

      if (data.success) {
        setProject(data.project);
      } else {
        console.error('Project not found');
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
  try {
    setPurchasing(true);

    const airService = getAirService();
    const userInfo = await airService.getUserInfo();

    // 1) Backend'e purchase request
    const purchaseResponse = await fetch(`${BACKEND_URL}/api/credits/${projectId}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userInfo.user.abstractAccountAddress,
        quantity: purchaseQuantity,
        price: 15.50
      })
    });

    const purchaseData = await purchaseResponse.json();

    if (!purchaseData.success) {
      throw new Error(purchaseData.error || 'Purchase failed');
    }

    console.log('✅ Purchase recorded:', purchaseData);

    // 2) Backend'den Credential oluştur
    const credentialResponse = await fetch(`${BACKEND_URL}/api/credentials/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project.id,
        quantity: purchaseQuantity,
        userId: userInfo.user.abstractAccountAddress
      })
    });

    const credentialData = await credentialResponse.json();

    if (credentialData.success) {
      console.log('✅ Credential issued:', credentialData.credential);
    } else {
      console.warn('⚠️ Credential issuance failed:', credentialData.error);
    }

    setPurchaseSuccess(true);

    // 2 saniye sonra portfolio'ya yönlendir
    setTimeout(() => {
      navigate('/portfolio');
    }, 2000);

  } catch (error) {
    console.error('❌ Purchase failed:', error);
    alert('Purchase failed: ' + error.message);
  } finally {
    setPurchasing(false);
  }
};

  const formatNumber = (num) => {
    if (!num || num === null || num === undefined) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-not-found">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/marketplace')} className="back-btn">
          <ArrowLeft size={20} /> Back to Marketplace
        </button>
      </div>
    );
  }

  const available = (project.issued || 0) - (project.retired || 0);

  return (
    <div className="project-detail">
      <button onClick={() => navigate('/marketplace')} className="back-btn">
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="project-detail-header">
        <div className="project-badges">
          <span className="badge registry-badge">{project.registry}</span>
          <span className="badge status-badge">{project.status || 'active'}</span>
        </div>
        <h1>{project.name}</h1>
      </div>

      <div className="project-detail-grid">
        {/* LEFT: Main Info */}
        <div className="project-main-info">
          <div className="info-section">
            <h3>Project Information</h3>
            
            <div className="info-item">
              <MapPin size={20} />
              <div>
                <span className="info-label">Location</span>
                <span className="info-value">{project.country}</span>
              </div>
            </div>

            <div className="info-item">
              <Award size={20} />
              <div>
                <span className="info-label">Project Type</span>
                <span className="info-value">{project.type || project.category}</span>
              </div>
            </div>

            {project.proponent && (
              <div className="info-item">
                <CheckCircle size={20} />
                <div>
                  <span className="info-label">Proponent</span>
                  <span className="info-value">{project.proponent}</span>
                </div>
              </div>
            )}

            {project.protocol && (
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <span className="info-label">Protocol</span>
                  <span className="info-value">{project.protocol}</span>
                </div>
              </div>
            )}
          </div>

          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="external-link">
              <ExternalLink size={18} />
              View on Registry
            </a>
          )}
        </div>

        {/* RIGHT: Stats & Purchase */}
        <div className="project-sidebar">
          <div className="stats-card">
            <h3>Carbon Credits</h3>
            
            <div className="stat-row">
              <span className="stat-label">Issued</span>
              <span className="stat-value">{formatNumber(project.issued)} tCO2</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">Retired</span>
              <span className="stat-value">{formatNumber(project.retired)} tCO2</span>
            </div>

            <div className="stat-row highlight">
              <span className="stat-label">Available</span>
              <span className="stat-value">{formatNumber(available)} tCO2</span>
            </div>

            <div className="price-section">
              <span className="price-label">Price per ton</span>
              <span className="price-value">$15.50</span>
            </div>

            <button 
              className="purchase-btn"
              onClick={() => setShowPurchaseModal(true)}
              disabled={available <= 0}
            >
              <ShoppingCart size={20} />
              Purchase Credits
            </button>
          </div>
        </div>
      </div>

      {/* PURCHASE MODAL */}
      {showPurchaseModal && (
        <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Purchase Carbon Credits</h2>
              <button onClick={() => setShowPurchaseModal(false)} className="modal-close">
                <X size={24} />
              </button>
            </div>

            {purchaseSuccess ? (
              <div className="purchase-success">
                <CheckCircle size={64} color="#10b981" />
                <h3>Purchase Successful!</h3>
                <p>Your carbon credits have been purchased and a verifiable credential has been issued.</p>
                <p className="redirect-text">Redirecting to portfolio...</p>
              </div>
            ) : (
              <>
                <div className="modal-body">
                  <div className="purchase-summary">
                    <h4>{project.name}</h4>
                    <p className="project-location">
                      <MapPin size={16} /> {project.country}
                    </p>
                  </div>

                  <div className="quantity-input">
                    <label>Quantity (tons of CO2)</label>
                    <input
                      type="number"
                      min="1"
                      max={available}
                      value={purchaseQuantity}
                      onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="purchase-total">
                    <span>Total Price:</span>
                    <span className="total-price">${(purchaseQuantity * 15.50).toFixed(2)}</span>
                  </div>

                  <div className="credential-notice">
                    <Award size={20} />
                    <p>A verifiable credential will be issued using AIR Protocol</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    onClick={() => setShowPurchaseModal(false)} 
                    className="btn-cancel"
                    disabled={purchasing}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePurchase} 
                    className="btn-confirm"
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      <>
                        <div className="spinner-small"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Confirm Purchase
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
