# ⭐ 06 — Best Practices for Backend Engineering

> What separates a junior developer from a senior one. Learn these to stand out in interviews.

---

## 🔴 SECTION 1: Code Structure Best Practices

### 1.1 Separation of Concerns

**What it means:** Each file/function should have ONE responsibility.

Your project already follows this pattern:
```
routes/      → Only define URLs and which controller handles them
controllers/ → Only contain business logic
models/      → Only define data structure
middleware/  → Only contain reusable request processors
config/      → Only contain configuration
```

**Bad practice (everything in one file):**
```javascript
app.post('/api/auth/login', async (req, res) => {
    // Validation, DB query, password check, token generation ALL HERE
    // Hard to test, hard to maintain, hard to read
});
```

**Good practice (separate concerns):**
```javascript
// routes/authRoutes.js — only routing
router.post('/login', login);

// controllers/authController.js — only logic
exports.login = async (req, res) => { ... };

// models/User.js — only data structure
const userSchema = new mongoose.Schema({ ... });
```

---

### 1.2 Always Use Environment Variables for Secrets

**❌ Never do this:**
```javascript
const secret = 'myhard_codedSecret';
const dbUri = 'mongodb+srv://user:password@cluster.mongodb.net/db';
```

**✅ Always do this:**
```javascript
const secret = process.env.JWT_SECRET;
const dbUri = process.env.MONGODB_URI;
```

And add `.env` to `.gitignore` — never commit secrets to Git!

---

### 1.3 Proper Error Handling

**❌ Bad — no error handling:**
```javascript
const user = await User.findOne({ email });
res.json({ user });
// If DB is down, server crashes!
```

**✅ Good — try-catch:**
```javascript
try {
    const user = await User.findOne({ email });
    res.json({ user });
} catch (error) {
    res.status(500).json({ success: false, error: error.message });
}
```

**⭐ Best — centralized error handler:**
```javascript
// Create a custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// In controllers, throw it:
throw new AppError('User not found', 404);

// Global error middleware in server.js (add as last middleware):
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});
```

---

### 1.4 Consistent API Response Format

**Best practice:** Always return responses in the same shape.

Your project already does this well:
```javascript
// Success
{ success: true, data: user }
{ success: true, token: "eyJ..." }
{ success: true, count: 5, data: bookings }

// Error
{ success: false, error: "User already exists" }
```

**Why it matters:** Frontend can always check `response.success` to know if request worked.

---

## 🟠 SECTION 2: Security Best Practices

### 2.1 Never Return Sensitive Data

**❌ Bad:**
```javascript
res.json({ user });  // Returns password hash too!
```

**✅ Good — exclude sensitive fields:**
```javascript
// Option 1: select: false in schema (what your project does)
password: { type: String, select: false }

// Option 2: Manually exclude when querying
User.findById(id).select('-password -__v')

// Option 3: Use .toJSON() or transform in schema
```

---

### 2.2 Input Validation

Always validate data coming from the client — don't trust it!

**What your project needs (currently missing):**
```javascript
// Add express-validator
const { body, validationResult } = require('express-validator');

router.post('/register', [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
], register);

// In controller:
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
}
```

---

### 2.3 Generic Error Messages for Auth

**❌ Bad — gives attackers information:**
```javascript
if (!user) return res.status(404).json({ error: 'Email not found' });
if (!isMatch) return res.status(401).json({ error: 'Wrong password' });
```

**✅ Good — same message for both cases (your project does this):**
```javascript
if (!user || !isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
}
```

---

### 2.4 HTTP Security Headers with Helmet

```javascript
const helmet = require('helmet');
app.use(helmet());  // Sets 11 security-related HTTP headers
```

Protects against: Clickjacking, XSS, content sniffing, and more.

---

### 2.5 Rate Limiting

Prevent brute-force attacks on login endpoints:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,                     // Max 5 attempts per 15 minutes
    message: 'Too many login attempts. Try again in 15 minutes.'
});

router.post('/login', loginLimiter, login);
```

---

## 🟡 SECTION 3: Database Best Practices

### 3.1 Index Frequently Queried Fields

MongoDB is fast, but queries on large collections without indexes are slow.

```javascript
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,  // unique: true automatically creates an index!
    }
});

// Manual index for fields you query often
bookingSchema.index({ user: 1, createdAt: -1 });
// 1 = ascending, -1 = descending
// This makes finding bookings by user sorted by date very fast
```

---

### 3.2 Pagination for Large Datasets

**❌ Never return all documents:**
```javascript
const bookings = await Booking.find();  // Returns ALL bookings — dangerous!
```

**✅ Always paginate:**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const bookings = await Booking.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

const total = await Booking.countDocuments({ user: req.user.id });

res.json({
    success: true,
    count: bookings.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: bookings
});
```

---

### 3.3 Use `.lean()` for Read-Only Queries

```javascript
// Without .lean() — returns Mongoose Document (heavier, has methods)
const users = await User.find();

// With .lean() — returns plain JavaScript object (faster, lighter)
const users = await User.find().lean();
// Use when you only need to READ data and send it as JSON
```

---

### 3.4 Avoid Saving Redundant Data

**Bad schema design:**
```javascript
// Storing calculated fields that can be derived
totalPrice: Number,
discountedPrice: Number,
finalPrice: Number,  // Can be calculated: totalPrice - discountedPrice
```

**Good:** Store only what's needed, calculate the rest.

---

## 🔵 SECTION 4: API Design Best Practices

### 4.1 Proper Status Codes

```javascript
200  // OK — GET, PUT, PATCH success
201  // Created — POST success (new resource created)
204  // No Content — DELETE success (nothing to return)
400  // Bad Request — invalid data sent
401  // Unauthorized — not authenticated (no/invalid token)
403  // Forbidden — authenticated but no permission
404  // Not Found — resource doesn't exist
409  // Conflict — duplicate resource (e.g., email exists)
422  // Unprocessable Entity — validation failed
500  // Internal Server Error — unexpected server error
```

---

### 4.2 RESTful URL Naming

```
✅ Good RESTful URLs (nouns, not verbs):
GET    /api/users           → Get all users
POST   /api/users           → Create user
GET    /api/users/:id       → Get one user
PUT    /api/users/:id       → Update user
DELETE /api/users/:id       → Delete user
GET    /api/users/:id/bookings → Get user's bookings

❌ Bad URLs (verbs in URLs — not RESTful):
POST /api/createUser
GET  /api/getUser/123
POST /api/deleteUser/123
```

---

### 4.3 API Versioning

Plan for changes by versioning your API:

```javascript
app.use('/api/v1/auth', require('./routes/v1/authRoutes'));
app.use('/api/v2/auth', require('./routes/v2/authRoutes'));
// Old clients can still use v1 while new clients use v2
```

---

## ⚛️ SECTION 5: React Best Practices

### 5.1 Component Organization

```
src/
  components/     → Reusable UI components (Navbar, Button, Modal)
  pages/          → Page-level components (Login, Dashboard)
  context/        → Context providers and hooks
  hooks/          → Custom hooks (useAuth, useBookings)
  services/       → API call functions (authService.js)
  utils/          → Helper functions
  assets/         → Images, fonts, CSS
```

---

### 5.2 Extract API Calls into Service Files

**Current (mixed with component logic):**
```jsx
// In Login.jsx
const { data } = await axios.post('http://localhost:3001/api/auth/login', { email, password });
```

**Better (separate service file):**
```javascript
// services/authService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const loginUser = (email, password) =>
    axios.post(`${API_URL}/api/auth/login`, { email, password });

// In Login.jsx
const { data } = await loginUser(email, password);
```

**Why?** If your API URL changes, you change it in ONE place.

---

### 5.3 Custom Hooks for Reusable Logic

```javascript
// hooks/useAuth.js
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCurrentUser(token).then(setUser).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return { user, loading, logout };
};

// In any component:
const { user, logout } = useAuth();
```

---

### 5.4 Always Handle Loading and Error States

**Current (missing loading state):**
```jsx
const [bookings, setBookings] = useState([]);
// No feedback to user while data is loading
```

**Better (complete state management):**
```jsx
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    fetchBookings()
        .then(data => setBookings(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

---

### 5.5 Use Axios Instance with Interceptors

Instead of manually adding the token to every request:

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
});

// Request interceptor — automatically adds token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

---

## 🏆 SECTION 6: Professional Habits

### 6.1 Always Write Clear Comments

```javascript
// ❌ Bad comment (what is obvious from code)
// Set password
this.password = hashedPassword;

// ✅ Good comment (explains WHY, not WHAT)
// Pre-save hook: hash password only when it's modified
// Prevents re-hashing on profile updates (name change, etc.)
userSchema.pre('save', async function(next) { ... });
```

---

### 6.2 Use Meaningful Variable Names

```javascript
// ❌ Bad
const d = await User.findOne({ e: req.body.e });
const t = jwt.sign({ i: d._id }, s);

// ✅ Good
const user = await User.findOne({ email: req.body.email });
const token = jwt.sign({ id: user._id }, jwtSecret);
```

---

### 6.3 DRY — Don't Repeat Yourself

Your project has `generateToken` as a shared helper — great!

Look for repeated patterns and extract them:
```javascript
// If you see this pattern repeated:
res.status(400).json({ success: false, error: error.message });

// Extract:
const sendError = (res, statusCode, message) =>
    res.status(statusCode).json({ success: false, error: message });
```

---

### 6.4 Git Best Practices

```bash
# Good commit messages
git commit -m "feat: add JWT authentication for protected routes"
git commit -m "fix: handle duplicate email in registration"
git commit -m "refactor: extract generateToken to utils/jwt.js"
git commit -m "docs: add API documentation"

# Use conventional commits format:
# feat: — new feature
# fix:  — bug fix
# refactor: — code refactor
# docs: — documentation
# test: — tests
```

---

*Next → Read `07-CONCEPTS-QUICK-REFERENCE.md` for your pre-interview revision!*
