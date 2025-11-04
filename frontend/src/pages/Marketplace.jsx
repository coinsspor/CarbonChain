import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Award, X, ChevronDown } from 'lucide-react';
import './Marketplace.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://carbonchain.coinsspor.com';

function Marketplace() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    registry: '',
    country: '',
    category: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Debounce search (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch projects when filters, search, or page changes
  useEffect(() => {
    fetchProjects();
  }, [pagination.page, filters, debouncedSearch]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.registry && { registry: filters.registry }),
        ...(filters.country && { country: filters.country }),
        ...(filters.category && { category: filters.category }),
        ...(debouncedSearch && { search: debouncedSearch })
      });

      console.log('🔍 Searching:', params.toString());

      const response = await fetch(`${BACKEND_URL}/api/credits?${params}`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
        setPagination(prev => ({
          ...prev,
          total: data.total,
          totalPages: data.totalPages
        }));
        console.log(`✅ Found ${data.total} projects`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ registry: '', country: '', category: '' });
    setSearchTerm('');
    setDebouncedSearch('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = searchTerm || filters.registry || filters.country || filters.category;

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1 className="gradient-text">Carbon Credit Marketplace</h1>
        <p className="marketplace-subtitle">
          {loading ? (
            'Searching...'
          ) : (
            <>
              {pagination.total.toLocaleString()} verified project{pagination.total !== 1 ? 's' : ''} 
              {hasActiveFilters ? ' found' : ' available'}
            </>
          )}
        </p>
      </div>

      <div className="marketplace-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, country, registry, ID, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X 
              size={18} 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>

        <div className="filters">
          <div className="filter-select">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="forest">Forest</option>
              <option value="REDD+">REDD+</option>
              <option value="renewable">Renewable Energy</option>
              <option value="energy">Energy Efficiency</option>
              <option value="agriculture">Agriculture</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          <div className="filter-select">
            <select
              value={filters.registry}
              onChange={(e) => handleFilterChange('registry', e.target.value)}
            >
              <option value="">All Registries</option>
              <option value="verra">Verra</option>
              <option value="gold-standard">Gold Standard</option>
              <option value="art-trees">ART TREES</option>
              <option value="climate-action-reserve">Climate Action Reserve</option>
              <option value="american-carbon-registry">American Carbon Registry</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          <div className="filter-select">
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">All Countries</option>
              <option value="Turkey">Turkey 🇹🇷</option>
              <option value="United States">United States 🇺🇸</option>
              <option value="India">India 🇮🇳</option>
              <option value="China">China 🇨🇳</option>
              <option value="Brazil">Brazil 🇧🇷</option>
              <option value="Indonesia">Indonesia 🇮🇩</option>
              <option value="Peru">Peru 🇵🇪</option>
              <option value="Kenya">Kenya 🇰🇪</option>
              <option value="Mexico">Mexico 🇲🇽</option>
              <option value="Colombia">Colombia 🇨🇴</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={16} /> Clear All
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <X size={14} onClick={() => setSearchTerm('')} />
            </span>
          )}
          {filters.category && (
            <span className="filter-tag">
              Category: {filters.category}
              <X size={14} onClick={() => handleFilterChange('category', '')} />
            </span>
          )}
          {filters.registry && (
            <span className="filter-tag">
              Registry: {filters.registry}
              <X size={14} onClick={() => handleFilterChange('registry', '')} />
            </span>
          )}
          {filters.country && (
            <span className="filter-tag">
              Country: {filters.country}
              <X size={14} onClick={() => handleFilterChange('country', '')} />
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="marketplace-loading">
          <div className="spinner"></div>
          <p>Searching {pagination.total > 0 && `${pagination.total.toLocaleString()} projects`}...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="no-results">
          <Search size={64} />
          <h3>No projects found</h3>
          <p>Try adjusting your search terms or filters</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            <X size={16} /> Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="project-header">
                  <span className="project-registry">{project.registry}</span>
                  <span className={`project-status ${project.status}`}>
                    {project.status || 'active'}
                  </span>
                </div>

                <h3 className="project-name">{project.name}</h3>

                <div className="project-meta">
                  <div className="project-location">
                    <MapPin size={16} />
                    <span>{project.country}</span>
                  </div>

                  <div className="project-type">
                    <Award size={16} />
                    <span>{project.type || project.category}</span>
                  </div>
                </div>

                <div className="project-stats">
                  <div className="project-stat">
                    <span className="stat-label">Issued</span>
                    <span className="stat-value">{formatNumber(project.issued)} tCO2</span>
                  </div>
                  <div className="project-stat">
                    <span className="stat-label">Retired</span>
                    <span className="stat-value">{formatNumber(project.retired)} tCO2</span>
                  </div>
                </div>

                <button className="view-details-btn">View Details →</button>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>

              <div className="pagination-info">
                <span className="current-page">Page {pagination.page}</span>
                <span className="separator">of</span>
                <span className="total-pages">{pagination.totalPages}</span>
              </div>

              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Marketplace;
