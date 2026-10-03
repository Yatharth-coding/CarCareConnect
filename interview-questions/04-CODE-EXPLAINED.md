# 📖 04 — Your Project Code Explained Line by Line

> Every file in QuickFixRide explained simply, so you can describe it in any interview.

---

## 🔴 BACKEND FILES

---

### FILE 1: `backend/server.js` — The Entry Point

This is the **first file that runs** when you start the backend.

```javascript
// Line 1-3: Import required packages
const express = require('express');
// express — the web framework (helps create the server)

const cors = require('cors');
// cors — allows the frontend (different port/origin) to talk to backend

const dotenv = require('dotenv');
// dotenv — reads the .env file and makes values available via process.env

const connectDB = require('./config/db');
// Our own function that connects to MongoDB

// Line 6-7: Load environment variables FIRST (before using them)
dotenv.config();
// This reads .env file. After this, process.env.PORT, process.env.MONGODB_URI etc. are available

// Line 9-10: Connect to MongoDB database
connectDB();
// Calls our function that uses the connection string to connect to MongoDB Atlas

// Line 12: Create the Express app
const app = express();
// app is your server instance. All routes and middleware attach to this.

// Line 14-16: GLOBAL MIDDLEWARE (runs for EVERY request)
app.use(cors());
// Allows cross-origin requests — frontend at :5173 can talk to backend at :3001

app.use(express.json());
// Parses incoming request body as JSON
// Without this: req.body would be undefined
// With this: req.body = { email: "...", password: "..." }

// Line 18-22: ROUTES — Tell the app which router handles which URL prefix
app.use('/api/auth', require('./routes/authRoutes'));
// Any URL starting with /api/auth → handled by authRoutes.js
// e.g., POST /api/auth/login → authRoutes.js handles it

app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Line 24: Set port from .env or default to 3001
const PORT = process.env.PORT || 3001;
// || means "or" — if PORT is not in .env, use 3001

// Line 26-28: Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Template literal — `` backticks let you embed ${variable} inside strings
});
```

**Interview answer:** "server.js is the entry point of the backend. It initializes Express, connects to MongoDB, registers middleware (cors and express.json), mounts route handlers, and starts listening for requests on the specified port."

---

### FILE 2: `backend/config/db.js` — Database Connection

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // mongoose.connect() takes the MongoDB connection string
        // process.env.MONGODB_URI comes from .env file
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // conn.connection.host — shows which MongoDB server we connected to
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
        // process.exit(1) — exits the Node.js process with error code 1
        // We do this because if DB connection fails, the whole app is useless
    }
};

module.exports = connectDB;
```

**Key concept:** This is an `async` function because `mongoose.connect()` is asynchronous (takes time). We `await` it and wrap in `try-catch` for error handling.

---

### FILE 3: `backend/models/User.js` — User Data Structure

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// bcryptjs — library for hashing (securing) passwords

// STEP 1: Define the Schema (blueprint for what a user document looks like)
const userSchema = new mongoose.Schema({
    name: {
        type: String,           // Must be a string
        required: [true, 'Please add a name']  // Required! Custom error message if missing
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,           // No two users can have the same email
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            // ↑ This is a Regular Expression that validates email format
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,           // Minimum 6 characters
        select: false           // ⚠️ IMPORTANT: By default, password is NOT returned in queries
                                // This prevents accidentally sending password to frontend
    },
    createdAt: {
        type: Date,
        default: Date.now       // Automatically set to current time when user is created
    }
});

// STEP 2: Add a pre-save hook — runs BEFORE saving to database
userSchema.pre('save', async function(next) {
    // 'this' refers to the document being saved (the user)
    
    if (!this.isModified('password')) {
        // If password field wasn't changed (e.g., only updating name),
        // skip hashing and proceed to save
        next();
    }
    // Note: there's a bug here — should have 'return' before next()
    // or use 'else' to prevent continuing

    const salt = await bcrypt.genSalt(10);
    // genSalt(10) — generates random salt with 10 rounds
    // More rounds = slower (harder to brute-force) but also slower on your server

    this.password = await bcrypt.hash(this.password, salt);
    // Replace the plain text password with its bcrypt hash
    // The hash is stored in the database, never the plain password
});

// STEP 3: Add a custom method — can be called on any user instance
userSchema.methods.matchPassword = async function(enteredPassword) {
    // bcrypt.compare:
    // 1. Takes the enteredPassword (plain text)
    // 2. Takes this.password (the hash stored in DB)
    // 3. Re-hashes enteredPassword with the same salt
    // 4. Compares the results
    // 5. Returns true if they match, false otherwise
    return await bcrypt.compare(enteredPassword, this.password);
};

// STEP 4: Create and export the Model
module.exports = mongoose.model('User', userSchema);
// mongoose.model('User', userSchema):
// - 'User' = model name (MongoDB creates collection called 'users' — lowercased + pluralized)
// - userSchema = the schema to use
```

---

### FILE 4: `backend/models/Booking.js` — Booking Data Structure

```javascript
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // ObjectId = MongoDB's unique ID type
        // This field stores a reference (like a foreign key) to the User collection
        required: true,
        ref: 'User'     // Tells Mongoose this ObjectId refers to the User model
        // This enables .populate() — to get full user data instead of just the ID
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['ride', 'mechanic', 'car_wash']
        // enum = only these values are allowed
        // If you try to save 'taxi', it throws a validation error
    },

    // CONDITIONAL FIELDS — required only for specific serviceType
    pickupLocation: {
        type: String,
        required: function() { return this.serviceType === 'ride'; }
        // 'required' can be a function!
        // If serviceType is 'ride', pickupLocation is required
        // If serviceType is 'mechanic', it's not required
    },
    dropoffLocation: {
        type: String,
        required: function() { return this.serviceType === 'ride'; }
    },
    mechanicName: {
        type: String,
        required: function() { return this.serviceType === 'mechanic'; }
    },
    mechanicAddress: {
        type: String,
        required: function() { return this.serviceType === 'mechanic'; }
    },

    // Common fields for all service types
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'confirmed'    // Default value if not provided
    }
}, {
    timestamps: true
    // timestamps: true automatically adds:
    // - createdAt: when the document was created
    // - updatedAt: when it was last modified
    // Very useful for sorting bookings by creation date
});

module.exports = mongoose.model('Booking', bookingSchema);
```

---

### FILE 5: `backend/middleware/authMiddleware.js` — JWT Guard

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    // 'next' = function to call to pass control to the next middleware/controller
    
    let token;

    // Check if Authorization header exists AND starts with 'Bearer'
    // The header format is: "Authorization: Bearer eyJhbGci..."
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token part after 'Bearer '
            // "Bearer eyJhbGci..." → split by space → ["Bearer", "eyJhbGci..."]
            // [1] = the actual token
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret key
            // If expired or tampered with, this throws an error (goes to catch)
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            // decoded = { id: "64abc...", iat: 1234567, exp: 1234567 }
            // iat = issued at, exp = expiry time

            // Fetch the actual user from DB using the ID stored in the token
            // .select('-password') = exclude the password field from the result
            req.user = await User.findById(decoded.id).select('-password');
            // Now req.user is available in ALL subsequent middleware and controllers!

            return next();   // Proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            return res.status(401).json({ 
                success: false, 
                error: 'Not authorized, token failed' 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Not authorized, no token' 
        });
    }
};

module.exports = { protect };
```

**Interview key points:**
- Middleware receives `(req, res, next)` — MUST call `next()` to continue or send a response to stop
- `req.user` is attached here, making user info available to all protected controllers
- `jwt.verify()` can throw errors (expired, invalid signature) — always wrap in try-catch

---

### FILE 6: `backend/routes/authRoutes.js` — URL Mapping

```javascript
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
// Destructuring — importing specific functions from the controller

const { protect } = require('../middleware/authMiddleware');
// Import the JWT guard middleware

const router = express.Router();
// Router = a mini Express app — handles a subset of routes

router.post('/register', register);
// POST /api/auth/register → calls register() from authController
// No middleware — anyone can register

router.post('/login', login);
// POST /api/auth/login → calls login()
// No middleware — anyone can login

router.get('/me', protect, getMe);
// GET /api/auth/me → first runs protect(), then if valid runs getMe()
// Order matters: protect MUST come before getMe

module.exports = router;
// Export the router to be used in server.js
```

**Full URL breakdown:**
- In server.js: `app.use('/api/auth', require('./routes/authRoutes'))`
- In authRoutes.js: `router.post('/register', register)`
- Final URL: `/api/auth` + `/register` = `POST /api/auth/register`

---

### FILE 7: `backend/controllers/authController.js` — Business Logic

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to create a JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },                    // Payload — data stored in the token
        process.env.JWT_SECRET || 'secret123',  // Secret key
        { expiresIn: '30d' }       // Token expires in 30 days
    );
    // { id } is shorthand for { id: id } — ES6 shorthand property
};

// REGISTER CONTROLLER
exports.register = async (req, res) => {
    // exports.register makes this function accessible when imported elsewhere
    
    try {
        const { name, email, password } = req.body;
        // Destructure the data sent by the client
        // req.body is parsed JSON because of express.json() middleware

        const userExists = await User.findOne({ email });
        // Search for a user with this email in MongoDB
        // findOne returns null if not found

        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
            // 400 Bad Request — the client sent invalid data (duplicate email)
            // 'return' stops execution here — don't run the rest of the function
        }

        const user = await User.create({ name, email, password });
        // Mongoose create() = new User({...}).save()
        // The pre('save') hook in User.js will hash the password before saving!

        res.status(201).json({
            // 201 Created — successfully created a resource
            success: true,
            token: generateToken(user._id)  // Send JWT token back to the client
            // user._id is MongoDB's auto-generated unique ID
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        // If validation fails, MongoDB throws an error — we catch it here
    }
};

// LOGIN CONTROLLER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        // Find user by email — but INCLUDE password (normally excluded by select: false)
        const user = await User.findOne({ email }).select('+password');
        // .select('+password') — override the select: false in the schema
        // We need the password to compare!

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
            // 401 Unauthorized — not authenticated
            // We say "Invalid credentials" (not "User not found") for security
            // Giving specific error helps attackers know which emails are registered
        }

        const isMatch = await user.matchPassword(password);
        // Calls the custom method we defined in User.js
        // bcrypt compares enteredPassword with stored hash

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
            // Same generic message — don't reveal which field was wrong
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id)  // Generate and send token
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// GET CURRENT USER CONTROLLER
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // req.user was set by the protect middleware!
        // We use req.user.id to fetch full user data from DB
        
        res.status(200).json({
            success: true,
            data: user   // Send user data (password excluded by default)
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
```

---

## 🔵 FRONTEND FILES

---

### FILE 8: `frontend/src/main.jsx` — React App Entry Point

This is where React starts. It mounts the entire React app into the HTML file.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// document.getElementById('root') → finds <div id="root"> in index.html
// React injects the entire app inside that div
// StrictMode helps detect potential problems in development
```

---

### FILE 9: `frontend/src/App.jsx` — Root Component with Routing

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// BrowserRouter — uses the browser's history API for routing
// Routes — container for Route definitions
// Route — maps a URL path to a component

// Import all pages
import Home from './pages/Home';
import Login from './pages/Login';
// ... (all other pages)

import ProtectedRoute from './components/ProtectedRoute';

// A temporary placeholder for pages not yet built
const Placeholder = ({ title }) => (
  <>
    <Navbar />
    <div style={{ display: 'flex', ... }}>
      <h1>{title}</h1>
      <p>This page is currently under development.</p>
    </div>
    <Footer />
  </>
);
// <> </> = React Fragment — groups elements without adding extra HTML element

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes — no authentication needed */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes — need to be logged in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>  {/* Guard — checks if logged in */}
                <Dashboard />   {/* Only shown if logged in */}
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

---

### FILE 10: `frontend/src/components/ProtectedRoute.jsx` — Route Guard

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Check if a JWT token exists in the browser's localStorage
  // localStorage persists across browser sessions (unlike sessionStorage)

  if (!token) {
    return <Navigate to="/login" replace />;
    // Navigate = redirect component
    // replace: true means this replaces current history entry
    // (so Back button won't return to the protected page)
  }

  return children;
  // If token exists, render the protected component (e.g., <Dashboard />)
  // 'children' is whatever is nested inside <ProtectedRoute>
};

export default ProtectedRoute;
```

**⚠️ Security note for interview:** This is **client-side protection only**. The real security is on the backend — the `protect` middleware verifies the JWT on every API call. Even if someone bypasses this client-side check, they can't get data without a valid token.

---

### FILE 11: `frontend/src/pages/Login.jsx` — Login Page

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

const Login = () => {
  // State for form fields (controlled components)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  // Hook that gives us a function to navigate programmatically
  
  const showSnackbar = useSnackbar();
  // Get the showSnackbar function from Context (global state)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent default form submission (which would reload the page)

    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });
      // axios.post(url, body) — makes a POST request with JSON body
      // { data } = destructure the response — axios puts response body in .data

      localStorage.setItem('token', data.token);
      // Store the JWT token in browser's localStorage
      // This persists across page refreshes!

      showSnackbar('Login successful!', 'success');
      // Show a success notification

      navigate('/');
      // Redirect to home page after successful login
      
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Login failed', 'error');
      // err.response?.data?.error — optional chaining (?.)
      // If err.response exists, and err.response.data exists, get .error
      // If any part is undefined, returns undefined (no crash)
      // || 'Login failed' — fallback message
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            required          {/* HTML5 validation */}
            value={email}     {/* Controlled — React manages this */}
            onChange={(e) => setEmail(e.target.value)}
            {/* e.target.value = current value of the input */}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
        <p>
          <Link to="/signup">Create an account</Link>
          {/* Link = React Router's <a> tag — no page reload */}
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

### FILE 12: `frontend/src/context/SnackbarContext.jsx` — Global Notifications

```jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

// STEP 1: Create the context (an empty container)
const SnackbarContext = createContext();

// STEP 3 (Custom hook for consuming context)
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
    // Safety check — if used outside Provider, give clear error
  }
  return context;
};

// STEP 2: Create the Provider (the component that provides the value)
export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success',  // 'success' | 'error' | 'info'
  });

  const showSnackbar = useCallback((message, type = 'success') => {
    // useCallback memoizes this function — same reference across renders
    // Important for performance when passing as prop to children
    
    setSnackbar({ isOpen: true, message, type });
    
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, isOpen: false }));
      // prev => {...} — functional update — gets previous state
      // Spread prev, then override just isOpen
      // This is safe when new state depends on old state
    }, 3000);   // Close after 3 seconds
  }, []);   // [] = never recreate (no dependencies)

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {/* value={showSnackbar} — the function is what components get */}
      {children}
      {snackbar.isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          // ... styling for the notification popup
        }}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
```

---

*Next → Read `05-INTERVIEW-QA.md` for complete interview preparation!*
