# 🌿 CarbonChain - Carbon Credit Marketplace

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://carbonchain.coinsspor.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()
[![Moca Network](https://img.shields.io/badge/Powered%20by-Moca%20Network-blue)]()

> A decentralized carbon credit marketplace with verifiable credentials using AIR Kit and zero-knowledge proofs.

**Live Demo:** [https://carbonchain.coinsspor.com/](https://carbonchain.coinsspor.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Current Status](#-current-status)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [What's Missing](#-whats-missing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

CarbonChain is a **carbon credit marketplace** built for the Moca Network ecosystem. The platform aims to transform carbon credit trading into a **transparent, verifiable, and decentralized marketplace** for businesses.

### Vision (From Moca Network Feedback)

Transform the project into a **secondary marketplace for carbon credits and carbon offsetting**, primarily targeted at businesses. The platform should:

- Create a **decentralized verification and trading infrastructure** for carbon credits
- Enable carbon futures and credit pools (e.g., high-quality credits vs. speculative credits)
- Facilitate risk transfer and price discovery in a fully transparent, on-chain manner
- Minimize greenwashing by ensuring every trade references verifiable credentials via the AIR Stack

---

## 🚀 Current Status

### ✅ Completed Features

#### Backend (Express.js + Node.js)
- [x] RESTful API with Express.js
- [x] JWT authentication system (RS256 with RSA keys)
- [x] JWKS endpoint for public key distribution
- [x] **10,800+ real carbon credit projects loaded** (Verra, Gold Standard, Berkeley, ART, CAR, CarbonPlan)
- [x] **2.5B tCO2 issued, 1.1B tCO2 retired** tracked
- [x] **Carbon credit endpoints** (search, filter, pagination)
- [x] **Purchase system** for primary market
- [x] **Portfolio management** (track user holdings)
- [x] **Secondary market endpoints**
  - List credits for sale
  - Buy from secondary market
  - View/cancel listings
  - Platform fee calculation (2.5%)
- [x] **Mock credential issuance** endpoint
- [x] Real carbon data service with production data
- [x] AIR Kit configuration

#### Frontend (React + Vite)
- [x] Modern UI with React 18 & Vite
- [x] AIR Kit login integration
- [x] Responsive design with CSS animations
- [x] **7 Main Pages:**
  - Dashboard (Overview & Stats)
  - Marketplace (Browse & Purchase Credits)
  - Portfolio (View Holdings)
  - Credentials (AIR Credentials)
  - Secondary Market (P2P Trading)
  - Project Detail (Individual Credit Info)
- [x] Navbar with wallet address display
- [x] Loading states and error handling
- [x] React Router for navigation

---

### ❌ Missing Features (Requested by Moca Network)

#### 1. ~~Real Carbon Credit Data~~ ✅ COMPLETED
- [x] **10,800+ real carbon credit projects** loaded (Verra, Gold Standard, Berkeley, ART, CAR, CarbonPlan)
- [x] Data files populated in `/backend/data/` (projects.json, credits.json)
- [x] 2.5B tCO2 issued, 1.1B tCO2 retired tracked
- ⚠️ **Note:** Data files are too large (~100MB+) to include in GitHub repository
- 💡 **Recommendation:** Use Git LFS or external storage for data files

#### 2. AIR Credential Integration
- [ ] Full AIR Credential verification system
- [ ] Each carbon credit should be mapped to an AIR Credential representing:
  - Source project
  - Location
  - Methodology
  - Vintage
  - Audit history
  - Ownership history
- [ ] AIR-credentialed credits need to be tokenized into **tradeable assets**

#### 3. Blockchain Transparency
- [ ] On-chain transaction tracking
- [ ] Verifiable trade history
- [ ] Every trade must reference verifiable credentials via AIR Stack

#### 4. Advanced Trading Features
- [ ] **Carbon futures** implementation
- [ ] **Credit pools** (high-quality vs. speculative)
- [ ] Risk transfer mechanisms
- [ ] Price discovery features
- [ ] Real-time market data

#### 5. Greenwashing Prevention
- [ ] Verification that every trade references valid credentials
- [ ] Quality scoring system
- [ ] Audit trail for each credit

---

## ✨ Features

### Primary Market
- Browse 5,000+ carbon credit projects (when data is loaded)
- Filter by registry (Verra, Gold Standard, etc.)
- Filter by country and category
- Search functionality
- Pagination support
- Purchase credits directly

### Secondary Market
- List your credits for resale
- Set custom prices
- View active marketplace listings
- Filter and sort by price
- Platform fee: 2.5%

### Portfolio Management
- View all your holdings
- Track purchase history
- Monitor credit status
- See total investment value

### Authentication
- AIR Kit login integration
- JWT-based authentication
- Wallet address display

---

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Authentication:** JWT (RS256) + node-jose
- **API Calls:** Axios
- **Data Processing:** CSV Parser
- **Environment:** dotenv

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Authentication:** @mocanetwork/airkit

### Infrastructure
- **AIR Kit:** Moca Network's identity & verification system
- **Deployment:** Live at carbonchain.coinsspor.com

---

## 📁 Project Structure

```
carbonchain/
├── backend/
│   ├── src/
│   │   ├── index.js              # Main Express server
│   │   ├── carbonDataService.js  # Carbon data management
│   │   ├── airService.js         # AIR Kit integration
│   │   └── generate-keys.js      # RSA key generation
│   ├── data/
│   │   ├── projects.json         # ⚠️ MISSING - Carbon projects data
│   │   └── credits.json          # ⚠️ MISSING - Credits data
│   ├── tests/
│   │   ├── test-verra.js         # Verra registry tests
│   │   ├── test-goldstandard.js  # Gold Standard tests
│   │   └── run-all-tests.js      # Test runner
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Marketplace.jsx   # Browse & buy credits
│   │   │   ├── Portfolio.jsx     # User holdings
│   │   │   ├── Credentials.jsx   # AIR credentials
│   │   │   ├── SecondaryMarket.jsx # P2P trading
│   │   │   └── ProjectDetail.jsx # Credit details
│   │   ├── services/
│   │   │   └── airService.js     # AIR Kit service
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── .env.example              # Environment variables template
│   └── package.json
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- AIR Kit credentials (Partner ID, DID, Schema ID, Program IDs)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carbonchain.git
   cd carbonchain/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AIR Kit credentials
   ```

4. **Generate RSA keys**
   ```bash
   npm run keys
   ```

5. **⚠️ Add carbon credit data**
   - Place `projects.json` in `data/` folder
   - Place `credits.json` in `data/` folder
   - Or the backend will run with empty data

6. **Start the server**
   ```bash
   npm start          # Production
   npm run dev        # Development with nodemon
   ```

   Backend will run at: `http://localhost:7000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL and AIR Kit credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Frontend will run at: `http://localhost:5173`

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Carbon Credits
- `GET /api/credits` - Get all credits (with filters & pagination)
- `GET /api/credits/stats` - Get statistics
- `GET /api/credits/:projectId` - Get project details

### Primary Market
- `POST /api/credits/:projectId/purchase` - Purchase credits

### Portfolio
- `GET /api/portfolio/:userId` - Get user portfolio

### Credentials
- `POST /api/credentials/issue` - Issue credential (mock)

### Secondary Market
- `POST /api/market/list` - List credit for sale
- `GET /api/market/listings` - Get all active listings
- `POST /api/market/buy/:listingId` - Purchase from secondary market
- `GET /api/market/my-listings/:userId` - Get user's listings
- `POST /api/market/cancel/:listingId` - Cancel listing

### JWKS
- `GET /.well-known/jwks.json` - Public key set for JWT verification

---

## 🗺 Roadmap

### Phase 1: Data Integration ✅ COMPLETED
- [x] Load 10,800+ carbon credit projects from Verra & Gold Standard
- [x] Populate `projects.json` and `credits.json`
- [x] Test data service with real data
- [x] Dashboard shows live statistics

### Phase 2: AIR Credential System (IN PROGRESS)
- [ ] Implement full AIR credential issuance
- [ ] Create CarbonCreditSchema mapping
- [ ] Add credential verification
- [ ] Display credentials in UI

### Phase 3: Blockchain Integration
- [ ] Implement on-chain transaction tracking
- [ ] Add verifiable trade history
- [ ] Create credential-to-trade linking

### Phase 4: Advanced Features
- [ ] Carbon futures implementation
- [ ] Credit pools (quality-based)
- [ ] Risk assessment system
- [ ] Market analytics dashboard

### Phase 5: Production Ready
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication with AIR
- [ ] Payment gateway integration
- [ ] Security audit

---

## ⚠️ What's Missing (Critical for Moca Submission)

### From Moca Network's Feedback:

1. ~~**Real Carbon Data**~~ ✅ **COMPLETED**
   - ✅ 10,800+ projects loaded from Verra, Gold Standard, Berkeley, ART, CAR, CarbonPlan
   - ✅ Data files exist: `projects.json` and `credits.json` in `/backend/data/`
   - ✅ Dashboard shows real statistics: 2.5B tCO2 issued, 1.1B tCO2 retired
   - ⚠️ **Note:** Data files too large for GitHub (100MB+). Not included in repository.
   - 💡 **Solution:** Use Git LFS, external hosting, or provide download link

2. **AIR Credential Mapping**
   - Each carbon credit should be issued as an AIR Credential
   - Credentials should represent: source project, location, methodology, vintage, audit, ownership history
   - Current implementation is mock-only

3. **Tradeable Asset Tokenization**
   - AIR-credentialed credits need to become tradeable assets
   - Blockchain integration for transparency

4. **Futures & Credit Pools**
   - No implementation of carbon futures trading
   - No credit pool system (high-quality vs speculative)

5. **Greenwashing Prevention**
   - Verification system not fully implemented
   - Every trade must reference verifiable credentials (AIR Stack)

---

## 🔒 Security Notes

### ⚠️ DO NOT COMMIT:
- `.env` files (use `.env.example` instead)
- `keys/` folder (contains private RSA keys)
- Any file with actual AIR Kit credentials
- `*.log` files

### Required for Production:
- Use a proper database (MongoDB/PostgreSQL) instead of in-memory storage
- Implement rate limiting
- Add input validation with a library like Joi
- Use HTTPS in production
- Add CORS whitelist for production
- Implement proper session management

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the Moca Network ecosystem. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- **Moca Network** for AIR Kit and feedback
- **Laisha | Moca Network** for guidance on project direction
- Carbon registries: Verra, Gold Standard, CAR, ART

---

## 📞 Contact

Project Link: [https://github.com/coinsspor/CarbonChain](https://github.com/coinsspor/CarbonChain)

Live Demo: [https://carbonchain.coinsspor.com/](https://carbonchain.coinsspor.com/)

---

**Built with 💚 for a sustainable future**
