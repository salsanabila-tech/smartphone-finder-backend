# 🔧 Technical Documentation

Dokumentasi teknis lengkap untuk developer yang ingin memahami atau berkontribusi pada project ini.

## 📐 Architecture Overview

### System Architecture

```
┌─────────────────┐
│   Client Side   │
│   (React App)   │
│   - Vite        │
│   - Tailwind    │
│   - Chart.js    │
└────────┬────────┘
         │ HTTPS
         │ REST API
         ▼
┌─────────────────┐
│   Server Side   │
│   (Express.js)  │
│   - JWT Auth    │
│   - CORS        │
│   - bcrypt      │
└────────┬────────┘
         │ MySQL
         │ Protocol
         ▼
┌─────────────────┐
│    Database     │
│     (MySQL)     │
│   - users       │
│   - smartphone  │
│   - activities  │
└─────────────────┘
```

### Deployment Architecture

```
┌──────────────┐         ┌──────────────┐
│   Vercel     │         │   Railway    │
│  (Frontend)  │◄───────►│  (Backend)   │
│              │  HTTPS  │              │
└──────────────┘         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Railway    │
                         │   (MySQL)    │
                         └──────────────┘
```

---

## 🗄️ Database Schema

### Table: users

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `username`
- UNIQUE INDEX on `email`

**Relationships:**
- One-to-Many with `user_activities`

---

### Table: smartphone

```sql
CREATE TABLE smartphone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    nama_hp VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    berat INT NOT NULL,
    kamera INT NOT NULL,
    keunikan INT NOT NULL,
    ram INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- PRIMARY KEY on `id`

**Note:** 
- `user_id` currently defaults to 1 (global data)
- Future: Can be linked to users table for user-specific data

---

### Table: user_activities

```sql
CREATE TABLE user_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- PRIMARY KEY on `id`
- FOREIGN KEY on `user_id`
- INDEX on `activity_type` (recommended for performance)
- INDEX on `created_at` (recommended for date queries)

**Activity Types:**
- `analysis`: User clicked "Mulai Analisis"
- `saved_item`: User added a smartphone
- `comparison`: User viewed the chart

---

## 🔐 Authentication Flow

### Registration Flow

```
Client                  Server                  Database
  │                       │                        │
  ├─POST /register───────►│                        │
  │  {username, email,    │                        │
  │   password}           │                        │
  │                       ├─Validate input         │
  │                       ├─Check existing user────►│
  │                       │                        │
  │                       │◄───────────────────────┤
  │                       ├─Hash password          │
  │                       │  (bcrypt, 10 rounds)   │
  │                       ├─Insert user────────────►│
  │                       │                        │
  │◄──────────────────────┤                        │
  │  {message, userId}    │                        │
```

### Login Flow

```
Client                  Server                  Database
  │                       │                        │
  ├─POST /login──────────►│                        │
  │  {username, password} │                        │
  │                       ├─Query user─────────────►│
  │                       │                        │
  │                       │◄───────────────────────┤
  │                       ├─Compare password       │
  │                       │  (bcrypt.compare)      │
  │                       ├─Generate JWT           │
  │                       │  (expires: 1h)         │
  │◄──────────────────────┤                        │
  │  {token, user}        │                        │
  │                       │                        │
  ├─Store token in        │                        │
  │  localStorage         │                        │
```

### Protected Route Flow

```
Client                  Server                  Database
  │                       │                        │
  ├─GET /profile─────────►│                        │
  │  Header:              │                        │
  │  Authorization:       │                        │
  │  Bearer <token>       │                        │
  │                       ├─Extract token          │
  │                       ├─Verify JWT             │
  │                       │  (jwt.verify)          │
  │                       ├─Query user data────────►│
  │                       │                        │
  │                       │◄───────────────────────┤
  │◄──────────────────────┤                        │
  │  {user data}          │                        │
```

---

## 🧮 SAW Algorithm Implementation

### Formula

```
Score = Σ(wi × ri)

Where:
- wi = weight of criterion i
- ri = normalized rating of criterion i
```

### Weights

```javascript
const weights = {
  harga: 0.30,    // 30% - Cost criterion
  berat: 0.15,    // 15% - Cost criterion
  kamera: 0.25,   // 25% - Benefit criterion
  keunikan: 0.10, // 10% - Benefit criterion
  ram: 0.20       // 20% - Benefit criterion
};
```

### Normalization

**Cost Criteria (lower is better):**
```javascript
normalized = min(values) / value_i
```

**Benefit Criteria (higher is better):**
```javascript
normalized = value_i / max(values)
```

### Implementation

```javascript
// Step 1: Find min/max values
let minHarga = Math.min(...data.map(d => d.harga));
let minBerat = Math.min(...data.map(d => d.berat));
let maxKamera = Math.max(...data.map(d => d.kamera));
let maxKeunikan = Math.max(...data.map(d => d.keunikan));
let maxRam = Math.max(...data.map(d => d.ram));

// Step 2: Normalize and calculate score
let hasil = data.map(d => {
  let rHarga = minHarga / d.harga;
  let rBerat = minBerat / d.berat;
  let rKamera = d.kamera / maxKamera;
  let rKeunikan = d.keunikan / maxKeunikan;
  let rRam = d.ram / maxRam;

  let score = 
    0.3 * rHarga +
    0.15 * rBerat +
    0.25 * rKamera +
    0.1 * rKeunikan +
    0.2 * rRam;

  return {
    id: d.id,
    nama_hp: d.nama_hp,
    score: score
  };
});

// Step 3: Sort by score (descending)
hasil.sort((a, b) => b.score - a.score);
```

### Example Calculation

Given 3 smartphones:

| HP | Harga | Berat | Kamera | Keunikan | RAM |
|----|-------|-------|--------|----------|-----|
| A  | 10M   | 180g  | 50MP   | 8        | 8GB |
| B  | 15M   | 200g  | 108MP  | 9        | 12GB|
| C  | 8M    | 170g  | 64MP   | 7        | 8GB |

**Step 1: Find min/max**
- minHarga = 8M, minBerat = 170g
- maxKamera = 108MP, maxKeunikan = 9, maxRam = 12GB

**Step 2: Normalize**

HP A:
- rHarga = 8M/10M = 0.8
- rBerat = 170/180 = 0.944
- rKamera = 50/108 = 0.463
- rKeunikan = 8/9 = 0.889
- rRam = 8/12 = 0.667

Score A = 0.3(0.8) + 0.15(0.944) + 0.25(0.463) + 0.1(0.889) + 0.2(0.667)
        = 0.24 + 0.142 + 0.116 + 0.089 + 0.133
        = 0.720

**Step 3: Rank**
1. HP C: 0.825
2. HP A: 0.720
3. HP B: 0.685

---

## 🎨 Frontend Architecture

### Component Structure

```
App.jsx (Main Container)
├── Login.jsx
├── Register.jsx
├── Profile.jsx
└── Dashboard (in App.jsx)
    ├── Sidebar Menu
    ├── Hero Section
    ├── Top Ranking Card
    ├── Add Smartphone Form
    ├── Smartphone Cards Grid
    └── Ranking Chart
```

### State Management

Using React Hooks (useState, useEffect):

```javascript
// Authentication state
const [isLogin, setIsLogin] = useState(false);
const [showRegister, setShowRegister] = useState(false);

// Data state
const [smartphones, setSmartphones] = useState([]);
const [ranking, setRanking] = useState([]);

// UI state
const [isDark, setIsDark] = useState(true);
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [currentPage, setCurrentPage] = useState("dashboard");

// Form state
const [form, setForm] = useState({
  nama_hp: "",
  harga: "",
  ram: "",
  kamera: "",
  berat: "",
  keunikan: ""
});
```

### Data Flow

```
User Action
    │
    ▼
Event Handler (onClick, onSubmit)
    │
    ▼
API Call (axios)
    │
    ▼
Backend Processing
    │
    ▼
Database Operation
    │
    ▼
Response
    │
    ▼
Update State (setState)
    │
    ▼
Re-render Component
```

---

## 🎨 Styling System

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      }
    }
  }
}
```

### Design Tokens

**Colors:**
- Primary: Green (#10b981, #059669)
- Background Light: Emerald/Teal/Cyan gradient
- Background Dark: Gray/Slate/Black gradient
- Text Light: Slate-900
- Text Dark: White/Slate-200

**Spacing:**
- Container: max-w-7xl
- Padding: px-6, py-12
- Gap: gap-8, gap-16
- Border Radius: rounded-xl, rounded-2xl

**Effects:**
- Glassmorphism: backdrop-blur-xl, bg-white/80
- Shadows: shadow-lg, shadow-2xl
- Transitions: transition-all, duration-300

---

## 🔌 API Integration

### Axios Configuration

```javascript
const API_URL = import.meta.env.VITE_API_URL || 
  'https://smartphone-finder-backend-production.up.railway.app';

// GET request
const response = await axios.get(`${API_URL}/smartphones`);

// POST request with body
const response = await axios.post(`${API_URL}/smartphones`, data);

// POST request with auth header
const response = await axios.post(
  `${API_URL}/track-activity`,
  { activityType: "analysis" },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

// DELETE request
await axios.delete(`${API_URL}/smartphones/${id}`);
```

### Error Handling

```javascript
try {
  const res = await axios.get(`${API_URL}/smartphones`);
  if (Array.isArray(res.data)) {
    setSmartphones(res.data);
  } else {
    console.error('Response bukan array:', res.data);
    setSmartphones([]);
  }
} catch (err) {
  console.error("ERROR FETCH:", err);
  setSmartphones([]);
  alert("Gagal mengambil data");
}
```

---

## 📱 PWA Implementation

### Manifest Configuration

```json
{
  "name": "Smartphone Finder - SPK SAW",
  "short_name": "SmartFinder",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Strategy

**Cache-First Strategy:**
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new
        return response || fetch(event.request);
      })
  );
});
```

**Assets Cached:**
- index.html
- favicon.svg
- icons.svg
- JavaScript bundles (auto by Vite)
- CSS files (auto by Vite)

---

## 🚀 Build & Deployment

### Frontend Build Process

```bash
# Development
npm run dev
# → Vite dev server on port 5173
# → Hot Module Replacement (HMR)
# → Fast refresh

# Production Build
npm run build
# → Vite builds to /dist
# → Minification
# → Tree shaking
# → Code splitting
# → Asset optimization

# Preview Production Build
npm run preview
# → Serve /dist folder
# → Test production build locally
```

### Backend Deployment (Railway)

**Build Command:** None (Node.js runs directly)

**Start Command:** `node index.js`

**Environment Variables:**
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- DB_PORT
- JWT_SECRET
- PORT

**Auto-deploy:** Triggered on git push to main branch

### Frontend Deployment (Vercel)

**Framework:** Vite

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Root Directory:** `spk-frontend`

**Environment Variables:**
- VITE_API_URL

**Auto-deploy:** Triggered on git push to main branch

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Register with valid data
- [ ] Register with duplicate username
- [ ] Register with invalid email
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Token expiration after 1 hour

**CRUD Operations:**
- [ ] Add smartphone with valid data
- [ ] Add smartphone with missing fields
- [ ] Add smartphone with negative values
- [ ] Delete smartphone
- [ ] View all smartphones

**SAW Algorithm:**
- [ ] Calculate ranking with 1 smartphone
- [ ] Calculate ranking with multiple smartphones
- [ ] Verify score calculation manually
- [ ] Check ranking order

**UI/UX:**
- [ ] Dark/Light mode toggle
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Animations and transitions
- [ ] Loading states
- [ ] Error messages

**PWA:**
- [ ] Install on Android
- [ ] Install on iOS
- [ ] Install on Desktop
- [ ] Offline functionality
- [ ] Service worker registration

### Automated Testing (Future)

**Unit Tests:**
- SAW calculation functions
- Normalization functions
- Validation functions

**Integration Tests:**
- API endpoints
- Database operations
- Authentication flow

**E2E Tests:**
- User registration flow
- Login flow
- Add smartphone flow
- Analysis flow

---

## 🔧 Performance Optimization

### Frontend Optimizations

**Code Splitting:**
- React.lazy() for route-based splitting
- Dynamic imports for heavy components

**Asset Optimization:**
- Image compression
- SVG optimization
- Font subsetting

**Caching:**
- Service Worker caching
- Browser caching headers
- CDN caching (Vercel)

**Bundle Size:**
- Tree shaking (Vite)
- Minification (Vite)
- Gzip compression (Vercel)

### Backend Optimizations

**Database:**
- Indexes on frequently queried columns
- Connection pooling
- Query optimization

**API:**
- Response compression (gzip)
- Caching headers
- Rate limiting (future)

**Server:**
- Node.js clustering (future)
- Load balancing (Railway)
- CDN for static assets

---

## 🔒 Security Considerations

### Implemented Security Measures

**Authentication:**
- JWT with expiration (1 hour)
- Password hashing (bcrypt, 10 rounds)
- Secure token storage (localStorage)

**API:**
- CORS configuration
- Input validation
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)

**Database:**
- Encrypted connections (Railway)
- Environment variables for credentials
- No sensitive data in git

### Future Security Enhancements

- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Content Security Policy (CSP)
- [ ] HTTPS enforcement
- [ ] Input sanitization
- [ ] SQL injection testing
- [ ] Penetration testing

---

## 📊 Monitoring & Logging

### Current Logging

**Backend:**
```javascript
console.log('Koneksi MySQL berhasil 🔥');
console.log('Register request received:', req.body);
console.error('Database error:', err);
```

**Frontend:**
```javascript
console.log('API_URL:', API_URL);
console.error('ERROR FETCH:', err);
```

### Future Monitoring

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] User analytics (Google Analytics)
- [ ] API monitoring (Railway metrics)
- [ ] Database monitoring (Railway metrics)

---

## 🔄 CI/CD Pipeline

### Current Setup

**GitHub → Railway (Backend):**
1. Push to main branch
2. Railway detects changes
3. Auto-deploy backend
4. Run migrations (if any)
5. Restart server

**GitHub → Vercel (Frontend):**
1. Push to main branch
2. Vercel detects changes
3. Run `npm run build`
4. Deploy to CDN
5. Invalidate cache

### Future Enhancements

- [ ] Automated testing before deploy
- [ ] Staging environment
- [ ] Preview deployments for PRs
- [ ] Rollback mechanism
- [ ] Deploy notifications

---

## 📚 Dependencies

### Frontend Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "axios": "^1.7.9",
  "chart.js": "^4.4.7",
  "react-chartjs-2": "^5.3.0",
  "lucide-react": "^0.468.0",
  "react-icons": "^5.4.0"
}
```

### Backend Dependencies

```json
{
  "express": "^4.21.2",
  "mysql2": "^3.11.5",
  "cors": "^2.8.5",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.4.7"
}
```

### Dev Dependencies

```json
{
  "vite": "^6.0.5",
  "tailwindcss": "^3.4.17",
  "postcss": "^8.4.49",
  "autoprefixer": "^10.4.20",
  "@vitejs/plugin-react": "^4.3.4"
}
```

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **No Edit Feature:** Can't edit smartphone data after adding
2. **No Search/Filter:** Can't search or filter smartphones
3. **Global Data:** All users see same smartphone data
4. **No Password Reset:** Can't reset forgotten password
5. **No Pagination:** All data loaded at once
6. **No Data Validation:** Limited client-side validation

### Future Improvements

- [ ] Add edit functionality
- [ ] Implement search and filter
- [ ] User-specific smartphone data
- [ ] Password reset via email
- [ ] Pagination for large datasets
- [ ] Advanced form validation
- [ ] Export results (PDF/Excel)
- [ ] Comparison feature
- [ ] Custom weight configuration

---

## 🤝 Contributing Guidelines

### Code Style

**JavaScript:**
- Use ES6+ syntax
- Prefer const over let
- Use arrow functions
- Async/await over promises

**React:**
- Functional components
- Hooks over class components
- Props destructuring
- Meaningful component names

**CSS:**
- Tailwind utility classes
- Avoid custom CSS when possible
- Use design tokens
- Mobile-first approach

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Make changes and commit
git add .
git commit -m "Feature: deskripsi fitur"

# Push to GitHub
git push origin feature/nama-fitur

# Create Pull Request
# Wait for review
# Merge to main
```

### Commit Message Convention

```
Type: Short description

Types:
- Feature: New feature
- Fix: Bug fix
- Update: Update existing feature
- Refactor: Code refactoring
- Docs: Documentation changes
- Style: Code style changes
- Test: Add or update tests
```

---

## 📞 Support & Contact

**GitHub Issues:** [Open an issue](https://github.com/salsanabila-tech/smartphone-finder-backend/issues)

**Email:** salsanabila2018@gmail.com

---

**Last Updated:** January 2024

**Version:** 1.0.0
