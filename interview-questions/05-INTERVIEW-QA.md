# ❓ 05 — Interview Questions & Answers

> 100+ questions organized by topic. Study these to crack any MERN stack interview.

---

## 🟠 SECTION 1: JavaScript Fundamentals

---

**Q1: What is the difference between `var`, `let`, and `const`?**

| | `var` | `let` | `const` |
|--|-------|-------|---------|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Re-declare | Yes | No | No |
| Re-assign | Yes | Yes | No |
| Hoisted | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |

- `var` — old, avoid using, causes confusing bugs
- `let` — for variables that will change
- `const` — for variables that won't be reassigned (prefer this)

```javascript
const name = "Yatharth";  // Best practice — can't reassign
let count = 0;              // Use when value will change
count = 1;                  // OK
```

---

**Q2: What is the difference between `==` and `===`?**

- `==` (loose equality) — converts types before comparing: `0 == false` → `true`
- `===` (strict equality) — no type conversion: `0 === false` → `false`

**Always use `===` in professional code!**

---

**Q3: What is a Promise? What is async/await?**

A **Promise** is an object representing a future value (pending, fulfilled, or rejected).

```javascript
// Promise style
fetch('/api/user')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await style (cleaner, same thing underneath)
const getUser = async () => {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};
```

`async/await` is syntactic sugar over Promises — makes async code look synchronous.

---

**Q4: What is destructuring?**

Extract values from objects/arrays into variables:

```javascript
// Object destructuring
const { name, email, password } = req.body;
// Same as: const name = req.body.name; const email = req.body.email;

// Array destructuring
const [profiles, setProfiles] = useState([]);
// profiles = first element, setProfiles = second element

// With renaming
const { data: userData } = response;  // data renamed to userData
```

---

**Q5: What is the spread operator (`...`)?**

Spread = "spread out" the contents of an object/array:

```javascript
// Spread in objects
const user = { name: "Yath", email: "y@mail.com" };
const updated = { ...user, name: "Updated Name" };
// { name: "Updated Name", email: "y@mail.com" }

// In React state updates
setEditUser({ ...editUser, name: e.target.value });
// Spread all existing fields, override just 'name'

// Spread in arrays
const newBookings = [...bookings, newBooking];
```

---

**Q6: What is optional chaining (`?.`)?**

Safely access nested properties without crashing if intermediate value is null/undefined:

```javascript
// Without optional chaining — crashes if err.response is undefined
err.response.data.error  // TypeError!

// With optional chaining — returns undefined instead of crashing
err.response?.data?.error  // undefined (safe)

// In your Login.jsx:
showSnackbar(err.response?.data?.error || 'Login failed', 'error');
```

---

**Q7: What is a closure?**

A closure is a function that has access to variables from its outer scope even after the outer function returns.

```javascript
const generateToken = (id) => {
    // 'id' is closed over — jwt.sign can access it
    return jwt.sign({ id }, process.env.JWT_SECRET);
};
```

---

**Q8: What is the difference between `null` and `undefined`?**

- `undefined` — variable declared but no value assigned
- `null` — intentionally set to "no value"

```javascript
let x;          // undefined
let y = null;   // null (intentional empty)
```

---

## 🔴 SECTION 2: Node.js Questions

---

**Q9: What is Node.js? Why is it popular?**

Node.js is a **JavaScript runtime** built on Chrome's V8 engine that lets JavaScript run on the server side. 

Popular because:
1. Same language (JavaScript) for frontend and backend
2. Non-blocking, event-driven architecture — handles many concurrent requests
3. Huge npm ecosystem (1M+ packages)
4. Fast I/O operations

---

**Q10: What is the Event Loop?**

The Event Loop is what makes Node.js non-blocking. It constantly checks:
1. Is there code to execute? → Run it
2. Is there a callback ready from an async operation? → Execute it
3. Repeat

This allows Node.js to handle thousands of connections without creating a new thread for each (unlike Java/PHP).

---

**Q11: What is the difference between CommonJS and ES Modules?**

| | CommonJS | ES Modules |
|--|---------|------------|
| Import | `require()` | `import` |
| Export | `module.exports` | `export` |
| When loaded | Runtime (dynamic) | Parse time (static) |
| File extension | `.js` | `.mjs` or `.js` with `"type":"module"` |
| Used in | Your backend | Your frontend (React) |

Your backend uses CommonJS: `const express = require('express')`  
Your frontend uses ES Modules: `import React from 'react'`

---

**Q12: What is `process.env`?**

`process.env` is a Node.js object containing environment variables. `dotenv` reads your `.env` file and injects values into it:

```javascript
dotenv.config();                        // Read .env
const port = process.env.PORT;          // Access values
const dbUri = process.env.MONGODB_URI;
```

Why use it? Security — secrets never hard-coded in source code.

---

**Q13: What is `npm`? What is `package.json`?**

- `npm` (Node Package Manager) — tool to install/manage JavaScript packages
- `package.json` — manifest file listing your project's dependencies, scripts, metadata

```json
{
  "scripts": {
    "start": "node server.js",    // npm start → production
    "dev": "nodemon server.js"    // npm run dev → development
  },
  "dependencies": {
    "express": "^5.2.1"           // ^ means compatible versions allowed
  },
  "devDependencies": {
    "nodemon": "^3.1.14"          // Only needed during development
  }
}
```

---

## 🟡 SECTION 3: Express.js Questions

---

**Q14: What is Express.js? Why use it over plain Node.js?**

Express is a minimal web framework for Node.js. Without Express, handling routes and requests requires hundreds of lines. Express provides:
- Simple routing API
- Middleware system
- Request/response utilities
- Error handling

---

**Q15: What is middleware in Express?**

Middleware is a function that has access to `req`, `res`, and `next`. It runs between the incoming request and the route handler.

```javascript
// Middleware signature
const myMiddleware = (req, res, next) => {
    // Do something with req or res
    next();   // Must call next() to continue the chain
};

app.use(myMiddleware);         // Apply to all routes
router.get('/me', protect, getMe);  // Apply to specific route
```

Types of middleware:
1. **Application-level**: `app.use(cors())`
2. **Router-level**: `router.use(protect)`
3. **Error-handling**: 4 parameters `(err, req, res, next)`
4. **Built-in**: `express.json()`, `express.static()`
5. **Third-party**: `cors()`, `morgan()`

---

**Q16: What is the difference between `app.use()` and `app.get()`?**

- `app.use()` — matches ALL HTTP methods, any URL starting with path
- `app.get()` — only matches GET requests at exact path

```javascript
app.use('/api', router);     // POST /api/auth, GET /api/user — all match
app.get('/health', handler); // Only GET /health
```

---

**Q17: How do you handle errors in Express?**

1. **try-catch in controllers** (what your project does):
```javascript
try { ... } catch (error) { res.status(400).json({ error: error.message }); }
```

2. **Global error handling middleware** (best practice):
```javascript
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
});
```

3. **`next(error)`** — pass error to error-handling middleware:
```javascript
try { ... } catch (err) { next(err); }
```

---

**Q18: What is REST API? What makes an API RESTful?**

REST (Representational State Transfer) is an architectural style for APIs.

RESTful principles:
1. **Stateless** — server doesn't store client session; each request is self-contained
2. **Client-Server** — frontend and backend are separated
3. **Uniform Interface** — consistent URL structure
4. **HTTP methods** used correctly (GET, POST, PUT, DELETE)

Your API is RESTful:
```
GET    /api/bookings      → Get all bookings
POST   /api/bookings      → Create booking
GET    /api/bookings/:id  → Get one booking
PUT    /api/bookings/:id  → Update booking
DELETE /api/bookings/:id  → Delete booking
```

---

**Q19: What is CORS? Why does it occur?**

CORS (Cross-Origin Resource Sharing) is a browser security mechanism. It blocks requests from a different origin (protocol + domain + port).

Your frontend at `http://localhost:5173` calling `http://localhost:3001` = different origin (different port).

Fix: Add `app.use(cors())` on the backend server, which adds HTTP headers allowing the browser to accept the response.

---

## 🟢 SECTION 4: MongoDB & Mongoose Questions

---

**Q20: What is MongoDB? How is it different from SQL databases?**

| SQL (e.g., MySQL) | MongoDB (NoSQL) |
|-------------------|-----------------|
| Tables with rows/columns | Collections with documents |
| Fixed schema (schema changes are hard) | Flexible schema |
| SQL query language | MongoDB query language (BSON/JSON-like) |
| JOINS for relations | Embedded documents or references |
| Better for complex transactions | Better for large-scale, flexible data |

---

**Q21: What is Mongoose? What is a Schema vs Model?**

**Mongoose** is an ODM (Object Document Mapper) for MongoDB in Node.js.

- **Schema** = Blueprint defining document structure, types, validations
- **Model** = JavaScript class compiled from schema, used to interact with a collection

```javascript
// Schema (blueprint)
const userSchema = new mongoose.Schema({ name: String, email: String });

// Model (interface to DB)
const User = mongoose.model('User', userSchema);
// Collection name: 'users' (auto pluralized + lowercased)

// Use model:
User.create({ name: 'Yath' });
User.findOne({ email: 'y@mail.com' });
```

---

**Q22: What is `populate()` in Mongoose?**

`populate()` replaces an ObjectId reference with the actual document data.

```javascript
// Without populate — you get only the ID
const booking = await Booking.findById(id);
// booking.user = "64abc123..."  (just an ID)

// With populate — you get the full user document
const booking = await Booking.findById(id).populate('user', 'name email');
// booking.user = { name: "Yath", email: "y@mail.com" }
```

---

**Q23: What is `select: false` in Mongoose?**

When a field has `select: false`, it's excluded from query results by default.

In your User model: `password: { type: String, select: false }`

```javascript
const user = await User.findOne({ email }); 
// user.password = undefined (excluded by default — safe!)

// To include it when needed (login):
const user = await User.findOne({ email }).select('+password');
// user.password = "$2b$10$..." (included now)
```

---

**Q24: What is the difference between `find()`, `findOne()`, `findById()`?**

```javascript
User.find({ role: 'admin' })        // Returns array of all matching documents
User.findOne({ email: 'y@m.com' }) // Returns first matching document (or null)
User.findById('64abc123')           // findOne by _id — most efficient
```

---

**Q25: What are Mongoose Lifecycle hooks (middleware)?**

Mongoose hooks run at specific points in the document lifecycle:

```javascript
// pre — runs BEFORE the operation
userSchema.pre('save', async function(next) { /* hash password */ });

// post — runs AFTER the operation  
userSchema.post('save', function(doc, next) { /* send welcome email */ });
```

Types: `save`, `validate`, `remove`, `updateOne`, `findOne`, etc.

---

## 🔵 SECTION 5: Authentication & Security

---

**Q26: What is JWT? How does it work?**

JWT (JSON Web Token) is a compact, self-contained token for authentication.

Structure: `header.payload.signature`

```
eyJhbGciOiJIUzI1NiJ9  ←  Header (base64)
.eyJpZCI6IjY0YWJjIn0  ←  Payload (base64, e.g., { id: "64abc" })
.HMAC_SIGNATURE        ←  Signature (header + payload + secret key)
```

**Flow:**
1. User logs in → server creates JWT with user ID
2. Server sends JWT to client
3. Client stores JWT (localStorage)
4. Client sends JWT in every request header: `Authorization: Bearer <token>`
5. Server verifies JWT signature on each request

**Advantages:** Stateless — server doesn't need to store sessions.

---

**Q27: What is the difference between JWT and Sessions?**

| JWT | Sessions |
|----|---------|
| Stateless — no server storage | Stateful — session stored on server |
| Token stored on client (localStorage) | Session ID stored in cookie |
| Scales easily (any server can verify) | Requires session store (Redis) for scaling |
| Can't invalidate before expiry | Easy to invalidate (delete session) |
| Your project uses this | Traditional websites use this |

---

**Q28: Why do we hash passwords? What is bcrypt?**

**Never store plain-text passwords.** If your database is compromised, plain text = all users' passwords exposed.

**Hashing** = one-way transformation. You can't reverse a hash.

**bcrypt** adds a random **salt** (prevents rainbow table attacks) and runs multiple rounds of hashing (slows brute force).

```javascript
const salt = await bcrypt.genSalt(10);   // Generate random salt (2^10 = 1024 iterations)
const hash = await bcrypt.hash('mypassword', salt);
// "$2b$10$7c8x9z3k5n1m..."

// To verify:
const isMatch = await bcrypt.compare('mypassword', hash);  // true
```

---

**Q29: What is localStorage? When should you use it?**

`localStorage` is browser storage that persists across sessions (unlike `sessionStorage` which clears on tab close).

Your project stores JWT token in localStorage:
```javascript
localStorage.setItem('token', data.token);  // Store
localStorage.getItem('token');               // Retrieve
localStorage.removeItem('token');            // Delete (logout)
```

**Security concern:** localStorage is accessible to JavaScript, making it vulnerable to XSS attacks. An alternative is `httpOnly cookies`, which JavaScript cannot access.

---

**Q30: What is XSS? What is CSRF?**

**XSS (Cross-Site Scripting):** Attacker injects malicious JavaScript into your site. Can steal localStorage tokens.

**CSRF (Cross-Site Request Forgery):** Tricks user's browser into making unauthorized requests using their cookies.

**Mitigations:**
- XSS: Sanitize inputs, use Content Security Policy, httpOnly cookies
- CSRF: CSRF tokens, SameSite cookies

---

## ⚛️ SECTION 6: React Questions

---

**Q31: What is React? What problems does it solve?**

React is a JavaScript library for building UIs with a component-based architecture. It solves:
1. **DOM manipulation complexity** — React handles DOM updates automatically
2. **Code organization** — Components = modular, reusable UI pieces
3. **Performance** — Virtual DOM minimizes real DOM operations
4. **State management** — Predictable data flow

---

**Q32: What is JSX?**

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like code in JavaScript. Babel compiles JSX to `React.createElement()` calls.

```jsx
// JSX
<h1 className="title">Hello</h1>

// What it compiles to
React.createElement('h1', { className: 'title' }, 'Hello');
```

JSX must have ONE root element (or use Fragment `<>...</>`).

---

**Q33: What is the difference between a Class component and a Functional component?**

**Class components** (older way):
```javascript
class MyComponent extends React.Component {
    render() { return <div>Hello</div>; }
}
```

**Functional components** (modern way — what your project uses):
```javascript
const MyComponent = () => <div>Hello</div>;
```

Functional components with Hooks can do everything class components can. Class components are rarely used in new code.

---

**Q34: What are React Hooks?**

Hooks are functions that let functional components use React features (state, lifecycle, context).

| Hook | Purpose |
|------|---------|
| `useState` | Add state to a component |
| `useEffect` | Run code after render (side effects) |
| `useContext` | Consume context (global state) |
| `useCallback` | Memoize functions |
| `useMemo` | Memoize values |
| `useRef` | Access DOM elements / persist values |
| `useNavigate` | Programmatic navigation (React Router) |

**Rules of Hooks:**
1. Only call hooks at the **top level** (not inside loops, conditions)
2. Only call hooks inside **React functions** (components or custom hooks)

---

**Q35: What is `useEffect` and what are its dependency array options?**

`useEffect` runs side effects after render.

```javascript
useEffect(() => { /* effect */ });          // Runs after EVERY render (usually wrong)
useEffect(() => { /* effect */ }, []);      // Runs ONCE (on mount)
useEffect(() => { /* effect */ }, [id]);   // Runs when 'id' changes
useEffect(() => {
  // Return a cleanup function
  return () => { /* cleanup */ };           // Runs before next effect or on unmount
}, []);
```

---

**Q36: What is the Virtual DOM?**

The Virtual DOM is a JavaScript copy of the real DOM.

When state changes:
1. React creates a new Virtual DOM
2. Compares with previous Virtual DOM (diffing/reconciliation)
3. Finds the minimal set of changes
4. Applies only those changes to the real DOM

**Benefit:** Real DOM operations are expensive. Batching and minimizing them makes React fast.

---

**Q37: What is prop drilling? How does Context API solve it?**

**Prop drilling** = Passing props through many layers of components that don't use them:
```
App (has user) → Layout → Sidebar → UserInfo (needs user)
// user passed through Layout and Sidebar unnecessarily
```

**Context API** = Global state accessible from any component:
```javascript
// Create context, wrap app in Provider, consume anywhere with useContext
const showSnackbar = useSnackbar();  // Available anywhere in the tree!
```

---

**Q38: What is the difference between `useState` and `useReducer`?**

- `useState` — for simple, independent state values
- `useReducer` — for complex state logic with multiple sub-values or when next state depends on previous

```javascript
// useState
const [count, setCount] = useState(0);

// useReducer
const reducer = (state, action) => {
    switch(action.type) {
        case 'INCREMENT': return { count: state.count + 1 };
        case 'DECREMENT': return { count: state.count - 1 };
    }
};
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'INCREMENT' });
```

---

**Q39: What is React Router? How does it work?**

React Router enables client-side routing — URL changes without page reloads.

- `BrowserRouter` — uses HTML5 History API
- `Routes` — renders only the matching route
- `Route path="/login" element={<Login />}` — defines URL-to-component mapping
- `Link` — navigation without reload
- `Navigate` — programmatic redirect
- `useNavigate` — hook for navigation in event handlers

---

**Q40: What is a controlled vs uncontrolled component?**

**Controlled:** Form data managed by React state (what your project uses):
```jsx
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

**Uncontrolled:** Form data managed by DOM itself:
```jsx
const inputRef = useRef();
<input ref={inputRef} />
// Access: inputRef.current.value
```

Controlled = React is the single source of truth. Preferred approach.

---

## 🏗️ SECTION 7: System Design & Architecture

---

**Q41: Explain the MVC architecture.**

MVC (Model-View-Controller):
- **Model** — Data layer (your Mongoose models: User.js, Booking.js)
- **View** — UI layer (your React components/pages)
- **Controller** — Business logic (your authController.js, bookingController.js)

Your project follows a variant of MVC on the backend:
- Routes → define endpoints
- Controllers → handle business logic
- Models → interact with database

---

**Q42: What is the difference between authentication and authorization?**

- **Authentication** = "Who are you?" — verifying identity (login with email+password)
- **Authorization** = "What can you do?" — verifying permissions (admin vs regular user)

Your JWT `protect` middleware does authentication. Authorization would be an additional role-check middleware.

---

**Q43: Explain the complete flow when a user logs in to QuickFixRide.**

1. User fills login form → clicks "Sign in"
2. `handleSubmit` is called, `e.preventDefault()` prevents page reload
3. Axios sends `POST http://localhost:3001/api/auth/login` with `{ email, password }`
4. Express receives request, `express.json()` parses body
5. Router matches `/api/auth/login` → calls `login` controller
6. Controller finds user by email, `.select('+password')` to include password
7. `bcrypt.compare()` checks if entered password matches hash
8. If match: `jwt.sign({ id: user._id }, JWT_SECRET)` creates token
9. Response: `{ success: true, token: "eyJhbGci..." }`
10. Frontend: `localStorage.setItem('token', data.token)`
11. `navigate('/')` → redirects to home page
12. `showSnackbar('Login successful!', 'success')` shows notification

---

**Q44: How would you improve the security of this project?**

1. Store JWT in `httpOnly` cookies instead of localStorage (prevents XSS)
2. Add rate limiting (prevent brute force) — `express-rate-limit`
3. Use HTTPS in production
4. Add input sanitization — `express-validator` or `joi`
5. Implement refresh tokens for better UX without long-lived tokens
6. Add proper logging (morgan, winston)
7. Use Helmet.js for HTTP security headers
8. Move `JWT_SECRET` to a proper secret manager

---

**Q45: What is the difference between `PUT` and `PATCH`?**

- `PUT` — Replace the **entire resource** with new data
- `PATCH` — Update **only specific fields** of the resource

```
PUT  /api/users/123  { name: "New", email: "new@mail.com" }  → Full replace
PATCH /api/users/123  { name: "New Name" }                   → Only update name
```

---

## 🌐 SECTION 8: General Web Development

---

**Q46: What is the difference between SQL and NoSQL databases?**

| SQL | NoSQL |
|----|-------|
| Structured tables | Flexible documents/collections |
| Fixed schema | Dynamic schema |
| ACID transactions | Eventual consistency (usually) |
| MySQL, PostgreSQL | MongoDB, Redis, Cassandra |
| Best for: complex queries, relations | Best for: large scale, flexible data |

---

**Q47: What is async programming? Why is it important in Node.js?**

Async programming allows operations (I/O, API calls, DB queries) to run in the background without blocking the main thread.

In Node.js (single-threaded), if DB queries were synchronous, the server would freeze while waiting. Async allows handling other requests while waiting for DB response.

---

**Q48: Explain `try-catch` and why it's used in controllers.**

`try-catch` handles runtime errors gracefully:
```javascript
try {
    // Code that might throw an error
    const user = await User.create(userData);
    res.status(201).json({ success: true });
} catch (error) {
    // Handle the error — don't crash the server
    res.status(400).json({ success: false, error: error.message });
}
```

Without try-catch: An uncaught error in an async function crashes the entire Node process.

---

**Q49: What is `nodemon`? Why is it a devDependency?**

`nodemon` automatically restarts the Node server whenever you save a file (great for development).

It's in `devDependencies` because you don't need it in production — only during development.

---

**Q50: What is Vite? Why is it used instead of Create React App?**

Vite is a modern build tool for frontend development.
- Faster than CRA (uses native ES modules)
- Hot Module Replacement (HMR) is much faster
- Smaller bundle sizes
- Better TypeScript support

Your frontend uses Vite: `vite.config.js` in frontend folder.

---

## 💡 BONUS — Questions About YOUR Project

---

**Q: Tell me about this project. What does QuickFixRide do?**

"QuickFixRide is a full-stack MERN application that provides vehicle-related services. Users can book rides, find nearby mechanics, and book car wash services. The app has user authentication with JWT, protected routes on both frontend and backend, booking management, and an AI-powered chatbot using Google's Generative AI. The backend is built with Node.js, Express, and MongoDB, while the frontend is built with React using Vite as the build tool."

---

**Q: What was challenging about this project?**

"Implementing JWT authentication was interesting — understanding the full flow from generating the token on registration/login, storing it in localStorage on the frontend, and verifying it via middleware on every protected API call. Also, understanding conditional required fields in Mongoose (fields required only for specific service types) was a good learning experience."

---

**Q: How does the protected route work?**

"On the frontend, `ProtectedRoute` checks if a JWT token exists in localStorage. If not, it redirects to the login page. On the backend, the `protect` middleware extracts the token from the Authorization header, verifies it using `jwt.verify()`, fetches the user from the database, and attaches it to `req.user`. This dual-layer protection ensures that even if someone bypasses the frontend guard, they can't access data without a valid token."

---

*Next → Read `06-BEST-PRACTICES.md` to learn what senior engineers do differently!*
