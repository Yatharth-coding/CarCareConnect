# 🔧 02 — Backend Theory: Node.js + Express + MongoDB

> Learn backend from scratch, explained simply with examples from your QuickFixRide project.

---

## SECTION 1: Node.js — The Foundation

### What is Node.js?

Node.js is a **runtime environment** — it lets JavaScript run on your computer (server), not just inside a browser.

Before Node.js:
- JavaScript = only browser language
- Server-side code = Java, PHP, Python, Ruby

After Node.js (2009):
- JavaScript can do EVERYTHING — frontend AND backend

### How Node.js Works — Event Loop

Node.js is **single-threaded** but handles many requests using the **Event Loop**.

```
Imagine a chef who:
1. Takes your order (starts a request)
2. Puts it in the oven (async operation — waits in background)
3. Takes the next customer's order while waiting
4. When the oven beeps (callback), serves the food

This is the Event Loop!
```

### CommonJS Modules (What your project uses)

In Node.js (CommonJS style), you share code between files using:

```javascript
// EXPORTING from a file
module.exports = { protect };      // Export an object
module.exports = mongoose.model('User', userSchema);  // Export one thing

// IMPORTING in another file
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
```

**Why this matters for interview:** Interviewers ask about CommonJS vs ES Modules.
- CommonJS (`require`/`module.exports`) — older, synchronous, what your backend uses
- ES Modules (`import`/`export`) — modern, what your frontend uses

---

## SECTION 2: Express.js — Building the API

### What is Express?

Express is a **minimal and flexible Node.js web application framework**. It provides tools for:
1. Defining routes (URLs your app responds to)
2. Handling middleware (functions that run between request and response)
3. Sending responses (JSON, HTML, files)

### The Request-Response Cycle

Every API request goes through this journey:

```
Client Request
    ↓
Middleware 1 (CORS)
    ↓  
Middleware 2 (JSON Parser)
    ↓
Route Handler (e.g., POST /api/auth/login)
    ↓
Controller Function (business logic)
    ↓
Database Query (MongoDB)
    ↓
Response sent back to client
```

### Understanding Middleware

**Middleware** = A function that has access to `req`, `res`, and `next`.
- `req` = the request object (data coming in)
- `res` = the response object (data going out)
- `next` = function to pass control to the next middleware

```javascript
// This is middleware
app.use(cors());            // Runs for EVERY request
app.use(express.json());    // Runs for EVERY request
```

From your `server.js`:
```javascript
app.use(cors());        // Allow cross-origin requests (browser → server)
app.use(express.json()); // Parse JSON bodies from requests
```

**Without `express.json()`**, when the frontend sends `{ email: "...", password: "..." }`, your server cannot read it.

### What is CORS?

**CORS = Cross-Origin Resource Sharing**

Your frontend runs on `http://localhost:5173` (or similar).  
Your backend runs on `http://localhost:3001`.

These are **different origins** (different ports). By default, browsers block cross-origin requests for security.

`app.use(cors())` tells the browser: "Yes, it's OK for other origins to talk to me."

---

## SECTION 3: Routing in Express

### How Routes Work

```javascript
// Pattern: router.METHOD('/path', controllerFunction)
router.post('/register', register);   // POST /api/auth/register
router.post('/login', login);          // POST /api/auth/login
router.get('/me', protect, getMe);     // GET /api/auth/me (protected!)
```

### Route with Middleware

```javascript
router.get('/me', protect, getMe);
//                ↑         ↑
//          runs first   runs second (only if protect calls next())
```

The `protect` middleware verifies the JWT token. If valid, it calls `next()` and `getMe` runs. If invalid, it sends a 401 and stops.

---

## SECTION 4: MongoDB + Mongoose

### MongoDB Basics

MongoDB stores data in **documents** (JSON-like objects) inside **collections**.

```
Database: quickfixride
  ├── Collection: users
  │     ├── Document: { _id: "...", name: "Yath", email: "...", password: "..." }
  │     └── Document: { _id: "...", name: "John", email: "...", password: "..." }
  └── Collection: bookings
        ├── Document: { _id: "...", user: "...", serviceType: "ride", ... }
        └── Document: { _id: "...", user: "...", serviceType: "mechanic", ... }
```

### What is Mongoose?

**Mongoose** is an **ODM (Object Data Modeling)** library for MongoDB.

Without Mongoose: You talk directly to MongoDB, no rules, anything goes.  
With Mongoose: You define a **Schema** (structure/rules) and a **Model** (the interface to the database).

### Schema vs Model

**Schema** = Blueprint / template (defines the shape of the document)

```javascript
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});
```

**Model** = The class you use to actually create, read, update, delete documents

```javascript
const User = mongoose.model('User', userSchema);
// Now you can do:
User.create({ name: "Yath", email: "y@mail.com" });
User.findOne({ email: "y@mail.com" });
User.findById("64abc...");
```

### Common Mongoose Operations (CRUD)

```javascript
// CREATE
const user = await User.create({ name, email, password });

// READ
const user = await User.findOne({ email });        // Find one matching
const user = await User.findById(id);              // Find by _id
const bookings = await Booking.find({ user: id }); // Find all matching

// UPDATE
await User.findByIdAndUpdate(id, { name: "New Name" });

// DELETE
await User.findByIdAndDelete(id);
```

### What is `async/await`?

Database operations take time (network call). JavaScript doesn't wait by default. 

`async/await` lets you write asynchronous code that **looks synchronous** (easy to read).

```javascript
// Without async/await (hard to read - callback hell)
User.findOne({ email }, function(err, user) {
    if (err) { /* handle */ }
    user.matchPassword(password, function(err, match) {
        // nested hell...
    });
});

// With async/await (clean and readable)
const user = await User.findOne({ email });
const isMatch = await user.matchPassword(password);
```

**Rules:**
- Functions that use `await` must be declared with `async`
- `await` can only be used inside `async` functions

---

## SECTION 5: Authentication with JWT

### What is JWT?

**JWT = JSON Web Token**

A JWT is a **secure token** that proves who you are. It's like a digital ID card.

```
Structure: header.payload.signature
Example:   eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0YWJjIn0.HMAC_SIGNATURE
```

Parts:
1. **Header** — Algorithm used to sign (e.g., HS256)
2. **Payload** — Data stored (e.g., `{ id: "user_id" }`)
3. **Signature** — Proves the token wasn't tampered with

### The JWT Authentication Flow

```
Step 1: User logs in → POST /api/auth/login { email, password }
Step 2: Server verifies credentials
Step 3: Server creates JWT token with user's ID
Step 4: Server sends token to client
Step 5: Client stores token in localStorage
Step 6: For protected routes, client sends token in header:
        Authorization: Bearer <token>
Step 7: Server's authMiddleware verifies the token
Step 8: If valid, request proceeds to the controller
```

### JWT in Your Code

**Generating a token** (in `authController.js`):
```javascript
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',  // Token expires in 30 days
    });
};
```
- `jwt.sign(payload, secret, options)` creates the token
- The payload `{ id }` stores the user's ID inside the token
- `JWT_SECRET` is a private key only your server knows

**Verifying a token** (in `authMiddleware.js`):
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id).select('-password');
```
- `jwt.verify()` checks if the token is valid and not expired
- It decodes the payload to get the user's ID
- We then fetch the full user from the database

---

## SECTION 6: Password Security with bcrypt

### Why Hash Passwords?

**NEVER store plain text passwords!**

If your database is hacked, the attacker gets all passwords.

**bcrypt** converts a password into a long, unreadable string (hash):
```
Plain password: "mypassword123"
bcrypt hash:    "$2b$10$7c8x9z3k5n1m2p6q4r8s0uXYZabc..."
```

The hash is **one-way** — you cannot reverse it to get the original password.

### How Password Verification Works

```javascript
// When registering — hash and store
const salt = await bcrypt.genSalt(10);   // Generate randomness (salt rounds)
this.password = await bcrypt.hash(this.password, salt);  // Hash the password

// When logging in — compare
const isMatch = await bcrypt.compare(enteredPassword, this.password);
// bcrypt re-hashes enteredPassword with the same salt and compares
```

**Salt** = Random data added before hashing to prevent "rainbow table" attacks.
**10 rounds** = bcrypt runs the hash 2^10 = 1024 times, making brute force very slow.

### Mongoose Middleware (Pre-save Hook)

In your `User.js`:
```javascript
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();  // If password didn't change, skip hashing
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
```

`pre('save')` runs **before** a document is saved to the database.
`this` refers to the document being saved.
`this.isModified('password')` — if we're only updating `name`, we don't rehash!

---

## SECTION 7: Environment Variables

### What is `.env`?

Sensitive data (API keys, database passwords, JWT secrets) must **never be in code**. They go in a `.env` file.

```env
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickfixride
JWT_SECRET=your_super_secret_key_here
```

**Why?** 
1. Security — not committed to Git
2. Flexibility — different values for development vs production

### How It Works

```javascript
const dotenv = require('dotenv');
dotenv.config();   // Loads .env into process.env

// Now you can access:
process.env.PORT          // 3001
process.env.MONGODB_URI   // mongodb+srv://...
process.env.JWT_SECRET    // your_super_secret_key_here
```

---

## SECTION 8: Error Handling

### try-catch Pattern

Every controller in your project uses `try-catch`:

```javascript
exports.register = async (req, res) => {
    try {
        // Happy path — if everything works
        const user = await User.create({ name, email, password });
        res.status(201).json({ success: true, token: generateToken(user._id) });
    } catch (error) {
        // Error path — if something goes wrong
        res.status(400).json({ success: false, error: error.message });
    }
};
```

This prevents the server from crashing when something fails.

---

*Next → Read `03-THEORY-FRONTEND.md` to learn React!*
