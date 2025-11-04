import React, { useState, useEffect } from 'react';
import { getAirService } from '../services/airService';
import { TrendingUp, Filter, ShoppingCart, Award, MapPin, Calendar } from 'lucide-react';
import './SecondaryMarket.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://carbonchain.coinsspor.com';

function SecondaryMarket() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    registry: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'recent'
  });
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.registry !== 'all') params.append('registry', filters.registry);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await fetch(`${BACKEND_URL}/api/market/listings?${params}`);
      const data = await response.json();

      if (data.success) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listing) => {
    try {
      setPurchasing(listing.id);
      
      const airService = getAirService();
      const userInfo = await airService.getUserInfo();
      
      const response = await fetch(`${BACKEND_URL}/api/market/buy/${listing.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: userInfo.user.abstractAccountAddress
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Purchase successful!\n\nPlatform Fee: $${data.transaction.platformFee}\nSeller receives: $${data.transaction.sellerAmount}`);
        fetchListings();
      } else {
        alert('Purchase failed: ' + data.error);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="secondary-market">
      <div className="market-header">
        <div className="header-content">
          <h1 className="gradient-text">Secondary Market</h1>
          <p className="market-subtitle">Trade verified carbon credits peer-to-peer</p>
        </div>
        <div className="market-stats">
          <div className="stat">
            <TrendingUp size={20} />
            <span>{listings.length} Active Listings</span>
          </div>
        </div>
      </div>

      <div className="market-info">
        <Award size={20} />
        <div>
          <strong>Platform Fee: 2.5%</strong>
          <p>All trades are verified through AIR Protocol with transparent fee structure</p>
        </div>
      </div>

      <div className="market-filters">
        <div className="filter-group">
          <label>Registry</label>
          <select 
            value={filters.registry}
            onChange={(e) => setFilters({...filters, registry: e.target.value})}
          >
            <option value="all">All Registries</option>
            <option value="verra">Verra</option>
            <option value="gold-standard">Gold Standard</option>
            <option value="american-carbon-registry">American Carbon Registry</option>
            <option value="climate-action-reserve">Climate Action Reserve</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price ($/ton)</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />
        </div>

        <div className="filter-group">
          <label>Max Price ($/ton)</label>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          >
            <option value="recent">Most Recent</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="market-loading">
          <div className="spinner"></div>
          <p>Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="no-listings">
          <TrendingUp size={64} />
          <h3>No Active Listings</h3>
          <p>Be the first to list your carbon credits for sale!</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div className="listing-header">
                <span className="registry-badge">{listing.registry}</span>
                <span className="listing-status">Active</span>
              </div>

              <h3 className="listing-title">{listing.projectName}</h3>

              <div className="listing-details">
                <div className="detail-item">
                  <Award size={16} />
                  <span>{formatNumber(listing.quantity)} tCO2</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Listed {formatDate(listing.listedAt)}</span>
                </div>
              </div>

              <div className="listing-price">
                <div className="price-info">
                  <span className="price-label">Price per ton</span>
                  <span className="price-value">${listing.pricePerTon.toFixed(2)}</span>
                </div>
                <div className="price-info">
                  <span className="price-label">Total Price</span>
                  <span className="price-total">${listing.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="listing-fee">
                <span>Platform fee (2.5%): ${(listing.totalPrice * 0.025).toFixed(2)}</span>
              </div>

              <button 
                className="btn-buy"
                onClick={() => handleBuy(listing)}
                disabled={purchasing === listing.id}
              >
                {purchasing === listing.id ? (
                  <>
                    <div className="spinner-small"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SecondaryMarket;
