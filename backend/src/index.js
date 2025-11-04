import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import carbonDataService from './carbonDataService.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

let privateKey, publicKey;
try {
  privateKey = readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
  publicKey = readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');
} catch (error) {
  console.error('❌ Keys not found. Run generateKeys.js first.');
  process.exit(1);
}

// In-memory storage (production'da database kullanılmalı)
let purchases = [];
let portfolios = {};
let marketListings = [];

// ====================================
// JWKS ENDPOINT
// ====================================
app.get('/.well-known/jwks.json', (req, res) => {
  try {
    const jwks = JSON.parse(readFileSync(process.env.JWKS_PATH, 'utf8'));
    res.json(jwks);
  } catch (error) {
    console.error('❌ JWKS error:', error);
    res.status(500).json({ error: 'Failed to load JWKS' });
  }
});

// ====================================
// AUTH ENDPOINTS
// ====================================
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const payload = {
      sub: username,
      iss: process.env.AIR_ISSUER_DID,
      aud: 'carbonchain',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid: 'carbonchain-key-1' });

    res.json({
      success: true,
      token,
      user: { username }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ====================================
// CARBON CREDITS ENDPOINTS
// ====================================
app.get('/api/credits', async (req, res) => {
  try {
    const { 
      search, 
      registry, 
      country, 
      category,
      page = 1, 
      limit = 20 
    } = req.query;

    let projects = carbonDataService.getAllProjects();

    // Filters
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(p => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.country?.toLowerCase().includes(searchLower)
      );
    }

    if (registry && registry !== 'all') {
      projects = projects.filter(p => 
        p.registry?.toLowerCase() === registry.toLowerCase()
      );
    }

    if (country && country !== 'all') {
      projects = projects.filter(p => 
        p.country?.toLowerCase() === country.toLowerCase()
      );
    }

    if (category && category !== 'all') {
      projects = projects.filter(p => 
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProjects = projects.slice(startIndex, endIndex);

    res.json({
      success: true,
      total: projects.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(projects.length / parseInt(limit)),
      projects: paginatedProjects
    });

  } catch (error) {
    console.error('❌ Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

app.get('/api/credits/stats', async (req, res) => {
  try {
    const stats = carbonDataService.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/credits/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = carbonDataService.getProjectById(projectId);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ====================================
// PURCHASE ENDPOINTS
// ====================================
app.post('/api/credits/:projectId/purchase', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, quantity, price } = req.body;

    if (!userId || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = carbonDataService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const purchase = {
      id: `PURCHASE-${Date.now()}`,
      userId,
      projectId: project.id,
      projectName: project.name,
      registry: project.registry,
      quantity: parseInt(quantity),
      pricePerTon: parseFloat(price),
      totalPrice: parseInt(quantity) * parseFloat(price),
      status: 'active',
      purchaseDate: new Date().toISOString()
    };

    purchases.push(purchase);

    // Update user portfolio
    if (!portfolios[userId]) {
      portfolios[userId] = {
        totalQuantity: 0,
        totalValue: 0,
        totalPurchases: 0,
        totalRetired: 0,
        activeCredits: [],
        purchases: [],
        retirements: []
      };
    }

    portfolios[userId].totalQuantity += purchase.quantity;
    portfolios[userId].totalValue += purchase.totalPrice;
    portfolios[userId].totalPurchases += 1;
    portfolios[userId].activeCredits.push(purchase);
    portfolios[userId].purchases.push(purchase);

    console.log(`✅ Purchase completed: ${purchase.id}`);

    res.json({
      success: true,
      purchase
    });

  } catch (error) {
    console.error('❌ Purchase error:', error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});

// ====================================
// CREDENTIALS ENDPOINT
// ====================================
app.post('/api/credentials/issue', async (req, res) => {
  try {
    const { projectId, quantity, userId } = req.body;

    if (!projectId || !quantity || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const project = carbonDataService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const credential = {
      credentialId: `CRED-${Date.now()}`,
      type: 'CarbonCreditCredential',
      issuer: process.env.AIR_ISSUER_DID,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: userId,
        creditId: `${project.registry}-${project.id}-${Date.now()}`,
        registry: project.registry,
        projectId: project.id,
        projectName: project.name,
        projectType: project.type || project.category,
        vintage: 2024,
        quantity: parseInt(quantity),
        country: project.country,
        purchaseDate: new Date().toISOString(),
        status: 'Active',
        verified: true
      }
    };

    console.log('✅ Mock credential issued:', credential.credentialId);

    res.json({
      success: true,
      credential
    });

  } catch (error) {
    console.error('❌ Credential error:', error);
    res.status(500).json({ error: 'Failed to issue credential' });
  }
});

// ====================================
// PORTFOLIO ENDPOINT
// ====================================
app.get('/api/portfolio/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = portfolios[userId] || {
      totalQuantity: 0,
      totalValue: 0,
      totalPurchases: 0,
      totalRetired: 0,
      activeCredits: [],
      purchases: [],
      retirements: []
    };

    res.json({
      success: true,
      portfolio
    });

  } catch (error) {
    console.error('❌ Portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// ====================================
// SECONDARY MARKET ENDPOINTS
// ====================================

// List credit for sale
app.post('/api/market/list', async (req, res) => {
  try {
    const { creditId, userId, quantity, pricePerTon, projectName, registry } = req.body;

    if (!creditId || !userId || !quantity || !pricePerTon) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const listing = {
      id: `LISTING-${Date.now()}`,
      creditId,
      sellerId: userId,
      projectName,
      registry,
      quantity: parseInt(quantity),
      pricePerTon: parseFloat(pricePerTon),
      totalPrice: parseInt(quantity) * parseFloat(pricePerTon),
      status: 'active',
      listedAt: new Date().toISOString(),
      views: 0
    };

    marketListings.push(listing);

    console.log('✅ Credit listed for sale:', listing.id);

    res.json({
      success: true,
      listing
    });

  } catch (error) {
    console.error('❌ Listing error:', error);
    res.status(500).json({ error: 'Failed to list credit' });
  }
});

// Get all active listings
app.get('/api/market/listings', async (req, res) => {
  try {
    const { registry, minPrice, maxPrice, sortBy } = req.query;

    let listings = marketListings.filter(l => l.status === 'active');

    // Filter by registry
    if (registry && registry !== 'all') {
      listings = listings.filter(l => l.registry.toLowerCase() === registry.toLowerCase());
    }

    // Filter by price
    if (minPrice) {
      listings = listings.filter(l => l.pricePerTon >= parseFloat(minPrice));
    }
    if (maxPrice) {
      listings = listings.filter(l => l.pricePerTon <= parseFloat(maxPrice));
    }

    // Sort
    if (sortBy === 'price_asc') {
      listings.sort((a, b) => a.pricePerTon - b.pricePerTon);
    } else if (sortBy === 'price_desc') {
      listings.sort((a, b) => b.pricePerTon - a.pricePerTon);
    } else {
      listings.sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
    }

    res.json({
      success: true,
      total: listings.length,
      listings
    });

  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Buy from secondary market
app.post('/api/market/buy/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const { buyerId } = req.body;

    const listing = marketListings.find(l => l.id === listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Listing is not active' });
    }

    // Platform fee: 2.5%
    const platformFee = listing.totalPrice * 0.025;
    const sellerAmount = listing.totalPrice - platformFee;

    // Mark listing as sold
    listing.status = 'sold';
    listing.soldAt = new Date().toISOString();
    listing.buyerId = buyerId;

    console.log(`✅ Secondary sale completed: ${listingId}`);
    console.log(`💰 Platform fee: $${platformFee.toFixed(2)}`);
    console.log(`💵 Seller receives: $${sellerAmount.toFixed(2)}`);

    res.json({
      success: true,
      transaction: {
        listingId: listing.id,
        buyerId,
        sellerId: listing.sellerId,
        quantity: listing.quantity,
        pricePerTon: listing.pricePerTon,
        totalPrice: listing.totalPrice,
        platformFee: platformFee.toFixed(2),
        sellerAmount: sellerAmount.toFixed(2),
        completedAt: listing.soldAt
      }
    });

  } catch (error) {
    console.error('❌ Purchase error:', error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});

// Get user's listings
app.get('/api/market/my-listings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const listings = marketListings.filter(l => l.sellerId === userId);

    res.json({
      success: true,
      total: listings.length,
      listings
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Cancel listing
app.post('/api/market/cancel/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = marketListings.find(l => l.id === listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    listing.status = 'cancelled';
    listing.cancelledAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Listing cancelled'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to cancel listing' });
  }
});

// ====================================
// START SERVER
// ====================================
app.listen(PORT, () => {
  console.log(`🚀 CarbonChain Backend: http://localhost:${PORT}`);
  console.log(`📊 Real Data: LOADED ✅`);
});
