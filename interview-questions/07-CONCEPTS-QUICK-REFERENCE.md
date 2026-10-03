# ⚡ 07 — Quick Reference Cheat Sheet

> Read this the night before your interview. All key concepts in one page.

---

## 🔑 MERN Stack in One Line Each

| | One-line definition |
|---|---|
| **MongoDB** | NoSQL database storing JSON-like documents in collections |
| **Express** | Minimal Node.js framework for building REST APIs and web servers |
| **React** | JavaScript library for building component-based user interfaces |
| **Node.js** | JavaScript runtime that executes JS on the server side |
| **Mongoose** | ODM library that adds schema validation and query API to MongoDB |
| **JWT** | Signed token encoding user identity for stateless authentication |
| **bcrypt** | Password hashing library with salt for secure credential storage |
| **Axios** | Promise-based HTTP client for making API requests from the browser |
| **CORS** | Browser mechanism; `cors()` middleware allows cross-origin requests |
| **Vite** | Fast frontend build tool and development server (replaces CRA) |

---

## 🌐 HTTP Methods Quick Reference

| Method | Action | Controller Pattern |
|--------|--------|--------------------|
| `GET` | Read data | `findById`, `find` |
| `POST` | Create data | `create`, `new Model().save()` |
| `PUT` | Replace resource | `findByIdAndUpdate` (all fields) |
| `PATCH` | Update partial | `findByIdAndUpdate` (some fields) |
| `DELETE` | Remove resource | `findByIdAndDelete` |

## 🔢 HTTP Status Codes to Memorize

```
200 OK            — success (GET, PUT, PATCH)
201 Created       — resource created (POST)
400 Bad Request   — invalid data from client
401 Unauthorized  — no/invalid token (not authenticated)
403 Forbidden     — authenticated but no permission
404 Not Found     — resource doesn't exist
500 Server Error  — unexpected error on server
```

---

## ⚡ Express Middleware Signature

```javascript
const middleware = (req, res, next) => {
  // req  = incoming request
  // res  = outgoing response
  // next = call to move to next middleware
  next();  // MUST call next() or send a response!
};
```

## 🔐 JWT Flow (4 Steps)

```
1. LOGIN  → Server verifies credentials → jwt.sign({ id }, secret, { expiresIn })
2. STORE  → Client saves token: localStorage.setItem('token', token)
3. SEND   → Every request: Authorization: Bearer <token>
4. VERIFY → Middleware: jwt.verify(token, secret) → decoded.id → find user
```

## 🔑 bcrypt in 3 Lines

```javascript
const salt = await bcrypt.genSalt(10);              // Generate random salt
const hash = await bcrypt.hash(plainPassword, salt); // Hash password
const isMatch = await bcrypt.compare(plain, hash);  // Verify password
```

---

## ⚛️ React Hooks Quick Reference

| Hook | When to use |
|------|-------------|
| `useState(val)` | Store local state (form inputs, toggles, data) |
| `useEffect(() => {}, [deps])` | Fetch data, subscriptions, DOM manipulation |
| `useContext(Context)` | Consume global context without prop drilling |
| `useCallback(fn, [deps])` | Memoize functions (pass to children) |
| `useMemo(fn, [deps])` | Memoize expensive computed values |
| `useRef()` | Access DOM element OR persist value without re-render |
| `useNavigate()` | Programmatic routing (React Router) |

## 🗺️ useEffect Dependency Array

```javascript
useEffect(() => {}, )     // ❌ Runs after every render (usually wrong)
useEffect(() => {}, [])   // ✅ Runs ONCE on mount (like componentDidMount)
useEffect(() => {}, [id]) // ✅ Runs when 'id' changes
```

---

## 🏗️ Your Project Structure (Memorize This!)

```
QuickFixRide/
├── backend/
│   ├── server.js              ← Entry point, Express setup
│   ├── config/db.js           ← MongoDB connection
│   ├── models/
│   │   ├── User.js            ← User schema + bcrypt hooks
│   │   └── Booking.js         ← Booking schema + conditional required
│   ├── controllers/
│   │   ├── authController.js  ← register, login, getMe
│   │   └── bookingController.js ← createBooking, getUserBookings
│   ├── routes/
│   │   ├── authRoutes.js      ← /api/auth routes
│   │   └── bookingRoutes.js   ← /api/bookings routes
│   └── middleware/
│       └── authMiddleware.js  ← JWT protect middleware
└── frontend/
    └── src/
        ├── main.jsx           ← React entry point
        ├── App.jsx            ← Router + routes definition
        ├── pages/             ← Login, Signup, Dashboard, etc.
        ├── components/        ← Navbar, Footer, ProtectedRoute, Chatbot
        └── context/
            └── SnackbarContext.jsx ← Global notifications
```

---

## 🔁 API Endpoints in Your Project

| Method | URL | Auth? | What it does |
|--------|-----|-------|--------------|
| POST | `/api/auth/register` | No | Create new user + return JWT |
| POST | `/api/auth/login` | No | Verify credentials + return JWT |
| GET | `/api/auth/me` | Yes | Get logged-in user's data |
| POST | `/api/bookings` | Yes | Create a new booking |
| GET | `/api/bookings` | Yes | Get all bookings for user |
| GET | `/api/config` | No | Get frontend config |
| POST | `/api/chat` | - | AI chatbot endpoint |

---

## ❓ Key Differences (Interviewers Love These!)

### authentication vs authorization
- **Authentication** = Who are you? (login)
- **Authorization** = What can you do? (permissions/roles)

### JWT vs Session
- **JWT** = Stateless, stored on client, scalable
- **Session** = Stateful, stored on server, easy to invalidate

### SQL vs NoSQL  
- **SQL** = Rigid schema, relations (JOINs), transactions
- **NoSQL** = Flexible, scalable, document-based

### `==` vs `===`  
- `==` = loose (converts types before comparing)
- `===` = strict (must be same type AND value)

### PUT vs PATCH
- `PUT` = replace entire resource
- `PATCH` = update partial resource

### props vs state
- **props** = data passed from parent (read-only)
- **state** = data managed within component (can change)

### controlled vs uncontrolled component
- **controlled** = React state is the source of truth for input value
- **uncontrolled** = DOM manages input value (use ref)

### `find()` vs `findOne()` vs `findById()`
- `find()` = returns array of all matches
- `findOne()` = returns first match (or null)
- `findById()` = shorthand for `findOne({ _id: id })`

---

## 💬 How to Answer "Tell me about yourself" as MERN Developer

> "I'm a MERN stack developer who has built a vehicle services booking application called QuickFixRide. It's a full-stack project with a React frontend built using Vite, and a Node.js/Express backend connected to MongoDB. The app includes JWT-based authentication, protected routes on both frontend and backend, booking management, and an AI chatbot. I understand the complete request-response lifecycle — from a user clicking a button in React, to the API call, through Express middleware, MongoDB queries, and back. I'm currently deepening my knowledge of best practices like centralized error handling, input validation, and security hardening."

---

## 🚨 Common Mistakes Junior Developers Make (Don't Do These!)

1. ❌ Storing passwords in plain text
2. ❌ Hard-coding API keys in source code (commit to git)
3. ❌ Not handling errors with try-catch
4. ❌ Returning all database documents without pagination
5. ❌ Not validating user input before saving to DB
6. ❌ Modifying state directly (`state.value = x` instead of `setState`)
7. ❌ Missing `key` prop when rendering lists in React
8. ❌ Using `var` instead of `let`/`const`
9. ❌ Calling APIs in every render (not using `useEffect` dependency array correctly)
10. ❌ Giving specific auth errors ("email not found" vs "invalid credentials")

---

## ✅ Pre-Interview Checklist

- [ ] Can you explain what MERN stands for and each technology's role?
- [ ] Can you draw the request-response flow from browser to MongoDB?
- [ ] Can you explain JWT authentication step by step?
- [ ] Can you explain bcrypt and why we don't store plain passwords?
- [ ] Can you explain what middleware is and give an example?
- [ ] Can you explain React state and why we use setter functions?
- [ ] Can you explain `useEffect` and its dependency array?
- [ ] Can you explain Context API and why it solves prop drilling?
- [ ] Can you explain protected routes (frontend + backend)?
- [ ] Can you walk through a complete login flow?
- [ ] Can you explain SQL vs NoSQL differences?
- [ ] Can you list HTTP methods and status codes?
- [ ] Can you explain Mongoose Schema vs Model?

If you can answer all of these confidently — **you're ready!** 🎯

---

*Good luck! You've got this! 💪*
