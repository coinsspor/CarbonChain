# 🔧 CarbonChain Backend

Express.js backend for the CarbonChain carbon credit marketplace.

## 📊 Data Status

✅ **10,800+ real carbon credit projects loaded**
- 2.5B tCO2 issued
- 1.1B tCO2 retired
- Multiple registries: Verra, Gold Standard, Berkeley, ART, CAR, CarbonPlan

⚠️ **Data files (~150MB) not included in repository due to size**
- See [DATA_MANAGEMENT.md](../DATA_MANAGEMENT.md) for data handling guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate RSA keys
npm run keys

# Configure environment
cp .env.example .env
# Edit .env with your AIR Kit credentials

# Start server
npm start          # Production
npm run dev        # Development with nodemon
```

Server runs at: `http://localhost:7000`

## 📁 Structure

```
backend/
├── src/
│   ├── index.js              # Express server & routes
│   ├── carbonDataService.js  # Carbon data management
│   ├── airService.js         # AIR Kit integration
│   └── generate-keys.js      # RSA key generator
├── data/
│   ├── projects.json         # Carbon credit projects
│   └── credits.json          # Credit details
├── tests/
│   ├── test-verra.js
│   ├── test-goldstandard.js
│   └── run-all-tests.js
└── keys/                     # Generated RSA keys (gitignored)
```

## 🔑 Environment Variables

Required in `.env`:

```env
# AIR Kit
AIR_PARTNER_ID=your_partner_id
AIR_ISSUER_DID=your_issuer_did
AIR_VERIFIER_DID=your_verifier_did

# Schema & Programs
SCHEMA_ID=your_schema_id
ISSUANCE_PROGRAM_ID=your_issuance_program_id
VERIFICATION_PROGRAM_ID=your_verification_program_id

# Server
PORT=7000
NODE_ENV=development

# Keys
JWKS_PATH=./keys/jwks.json
PRIVATE_KEY_PATH=./keys/private.key
PUBLIC_KEY_PATH=./keys/public.key

# AIR Kit API
AIR_API_URL=https://api.sandbox.air3.com
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Get JWT token

### Carbon Credits
- `GET /api/credits` - List all credits (with filters)
- `GET /api/credits/stats` - Get statistics
- `GET /api/credits/:projectId` - Get project details
- `POST /api/credits/:projectId/purchase` - Purchase credits

### Portfolio
- `GET /api/portfolio/:userId` - Get user portfolio

### Credentials
- `POST /api/credentials/issue` - Issue credential

### Secondary Market
- `POST /api/market/list` - List credit for sale
- `GET /api/market/listings` - Get all listings
- `POST /api/market/buy/:listingId` - Buy from market
- `GET /api/market/my-listings/:userId` - User's listings
- `POST /api/market/cancel/:listingId` - Cancel listing

### JWKS
- `GET /.well-known/jwks.json` - Public key set

## 🔐 Authentication

Uses JWT with RS256 (RSA) signing:

1. Generate keys: `npm run keys`
2. Keys stored in `keys/` folder
3. JWKS endpoint for public key distribution
4. 24-hour token expiration

## 📊 Data Service

The `carbonDataService.js` loads carbon credit data from JSON files:

```javascript
// Load data
const service = new CarbonDataService();
service.getAllProjects();
service.getProjectById(projectId);
service.getStats();
```

### Data Format

`projects.json`:
```json
[
  {
    "id": "VCS1234",
    "name": "Project Name",
    "registry": "verra",
    "country": "Brazil",
    "category": "Renewable Energy",
    "issued": 100000,
    "retired": 50000,
    "vintage": 2024
  }
]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
node tests/test-verra.js
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT handling
- **node-jose** - JWKS generation
- **axios** - HTTP client
- **csv-parser** - CSV processing

## ⚠️ Important Notes

1. **In-Memory Storage**: Currently uses in-memory arrays. Replace with database for production.

2. **Missing Data**: `data/` folder needs to be populated with real carbon credit data.

3. **Keys Security**: Never commit `keys/` folder. Generate fresh keys for each environment.

4. **AIR Integration**: Mock credential issuance - needs real AIR Kit implementation.

## 🚀 Production Checklist

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Implement rate limiting
- [ ] Add input validation (Joi)
- [ ] Use HTTPS
- [ ] Add CORS whitelist
- [ ] Implement session management
- [ ] Add logging (Winston)
- [ ] Set up monitoring
- [ ] Load real carbon credit data
- [ ] Complete AIR Kit integration

## 📝 License

MIT
