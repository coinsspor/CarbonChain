# 🎨 CarbonChain Frontend

React + Vite frontend for the CarbonChain carbon credit marketplace.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URL and AIR Kit credentials

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs at: `http://localhost:5173`

## 📁 Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main overview
│   │   ├── Marketplace.jsx       # Browse & buy credits
│   │   ├── Portfolio.jsx         # User holdings
│   │   ├── Credentials.jsx       # AIR credentials
│   │   ├── SecondaryMarket.jsx   # P2P trading
│   │   └── ProjectDetail.jsx     # Credit details
│   ├── services/
│   │   └── airService.js         # AIR Kit integration
│   ├── assets/
│   │   └── carbonchain.jpg
│   ├── App.jsx                   # Main app
│   ├── App.css
│   ├── main.jsx                  # Entry point
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## 🔑 Environment Variables

Required in `.env`:

```env
VITE_BACKEND_URL=http://localhost:7000
VITE_AIR_PARTNER_ID=your_partner_id
VITE_AIR_ISSUER_DID=your_issuer_did
VITE_SCHEMA_ID=your_schema_id
VITE_ISSUANCE_PROGRAM_ID=your_issuance_program_id
VITE_VERIFICATION_PROGRAM_ID=your_verification_program_id
```

⚠️ **Note:** All Vite env vars must start with `VITE_`

## 📄 Pages

### 1. Dashboard
- Overview statistics
- Recent activity
- Quick actions
- Market trends

### 2. Marketplace
- Browse carbon credits
- Filter by registry, country, category
- Search functionality
- Pagination
- Purchase credits

### 3. Portfolio
- View holdings
- Track purchases
- Monitor credit status
- Total investment value

### 4. Credentials
- View AIR credentials
- Credential verification
- Issue new credentials
- Credential history

### 5. Secondary Market
- List credits for sale
- View active listings
- Filter and sort
- Buy from other users
- Platform fee: 2.5%

### 6. Project Detail
- Detailed credit information
- Project metadata
- Purchase history
- Related projects

## 🎨 Styling

Uses vanilla CSS with:
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design
- Dark theme

Key CSS features:
- `App.css` - Main styles & animations
- `index.css` - Global styles & variables
- Component-specific CSS files

## 🔐 Authentication

Uses AIR Kit for authentication:

```javascript
import { getAirService } from './services/airService';

const airService = getAirService();
await airService.init({ buildEnv: BUILD_ENV.SANDBOX });
await airService.login();
```

Authentication flow:
1. Initialize AIR Kit on app load
2. User clicks "Login with AIR"
3. AIR Kit handles OAuth flow
4. App receives user data
5. Display wallet address in navbar

## 📡 API Integration

All API calls go through the backend:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Get credits
const response = await axios.get(`${API_URL}/api/credits`);

// Purchase credit
await axios.post(`${API_URL}/api/credits/${projectId}/purchase`, {
  userId, quantity, price
});
```

## 🎯 Key Features

### Marketplace
- Real-time filtering
- Search by name/country
- Pagination (20 items per page)
- Loading states
- Error handling

### Secondary Market
- List credits for sale
- Set custom prices
- Platform fee calculation
- Transaction history
- Cancel listings

### Portfolio
- Total holdings display
- Purchase history
- Active credits list
- Value tracking

## 📦 Dependencies

- **react** 18.2.0 - UI framework
- **react-dom** 18.2.0 - React rendering
- **react-router-dom** 7.9.4 - Routing
- **@mocanetwork/airkit** 1.6.0 - AIR authentication
- **axios** 1.6.0 - HTTP client
- **lucide-react** 0.548.0 - Icons
- **vite** 5.0.0 - Build tool

## 🎨 Design System

### Colors
```css
--primary: #00ff88 (Green)
--secondary: #0088ff (Blue)
--background: #0a0f1e (Dark blue)
--card: rgba(255, 255, 255, 0.05) (Glass)
```

### Typography
- Headings: Bold, gradient
- Body: Regular, white
- Labels: Lighter

### Effects
- Glass morphism cards
- Gradient text
- Glow animations
- Smooth transitions

## 🧪 Testing

Currently no tests implemented. To add:

```bash
npm install --save-dev @testing-library/react vitest
```

## 📱 Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All pages are fully responsive.

## 🚀 Production Build

```bash
# Build
npm run build

# Preview
npm run preview

# Output in dist/
```

Build output:
- HTML, CSS, JS minified
- Assets optimized
- Source maps included

## ⚠️ Known Issues

1. **No Real Data**: Waiting for backend data integration
2. **Mock Credentials**: AIR credential issuance is mocked
3. **No Persistence**: Purchases don't persist (backend in-memory)

## 🔧 Development Tips

1. **Hot Reload**: Vite provides instant HMR
2. **Console Logs**: Check browser console for API errors
3. **React DevTools**: Install for component debugging
4. **Network Tab**: Monitor API calls

## 📝 To-Do

- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add toast notifications
- [ ] Improve accessibility (ARIA labels)
- [ ] Add unit tests
- [ ] Add E2E tests (Playwright)
- [ ] Optimize bundle size
- [ ] Add service worker (PWA)

## 📄 License

MIT
