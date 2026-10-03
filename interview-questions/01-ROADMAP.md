# 📍 01 — MERN Stack Learning Roadmap

> From Zero to Interview-Ready. Follow this roadmap step by step.

---

## 🗺️ The Big Picture — What is MERN?

MERN is a **full-stack JavaScript framework** made of 4 technologies:

```
M — MongoDB     → Database (where data lives)
E — Express.js  → Backend web server framework
R — React.js    → Frontend UI library
N — Node.js     → JavaScript runtime (lets JS run on server)
```

**Think of it like a restaurant:**
- **MongoDB** = The kitchen storage (where all food/data is stored)
- **Express/Node** = The kitchen + chef (processes orders, cooks food)
- **React** = The restaurant front (what customers see and interact with)
- **HTTP/API** = The waiter (carries requests and responses back and forth)

---

## 📅 Phase 1 — Foundations (Week 1-2)

### 1.1 How the Internet Works (Must Know!)

**Before writing any code, understand this flow:**

```
You type: http://localhost:3001/api/auth/login
          ↓
Browser sends an HTTP REQUEST to the server
          ↓
Server receives it, processes it
          ↓
Server sends back an HTTP RESPONSE
          ↓
Browser displays the result
```

**HTTP Methods — The 4 most important:**

| Method | Meaning | Example |
|--------|---------|---------|
| `GET` | Fetch/Read data | Get my profile |
| `POST` | Create new data | Register new user |
| `PUT` / `PATCH` | Update data | Update my name |
| `DELETE` | Remove data | Delete my account |

**HTTP Status Codes — What server replies with:**

| Code | Meaning |
|------|---------|
| `200` | OK — Success |
| `201` | Created — New resource created |
| `400` | Bad Request — You sent wrong data |
| `401` | Unauthorized — Not logged in |
| `403` | Forbidden — Logged in but no permission |
| `404` | Not Found — Resource doesn't exist |
| `500` | Internal Server Error — Server crashed |

---

### 1.2 What is Node.js?

- Node.js lets you run **JavaScript outside the browser** (on your computer/server)
- Before Node.js, JavaScript only ran in browsers
- Node.js is built on Chrome's V8 JavaScript engine
- It is **non-blocking** and **event-driven** — meaning it can handle many requests at once without waiting

**Simple analogy:** 
- Old way (blocking): A cashier serves one customer completely before moving to next
- Node.js (non-blocking): A cashier takes orders from everyone, then serves when ready

---

### 1.3 What is Express.js?

- Express is a **minimal web framework** built on top of Node.js
- It makes building APIs and web servers much easier
- Without Express, you'd write 100 lines to handle one route
- With Express, it's just a few lines

**What Express gives you:**
- Route handling (`app.get`, `app.post`, etc.)
- Middleware system
- Request/Response objects
- Easy JSON handling

---

### 1.4 What is MongoDB?

- MongoDB is a **NoSQL database** — stores data as documents (like JSON objects)
- Unlike SQL (tables with rows/columns), MongoDB uses **collections** and **documents**
- Very flexible — no strict schema required (though Mongoose adds schema)

**SQL vs MongoDB:**

```
SQL Database:
  Table: users
  | id | name  | email          |
  |----|-------|----------------|
  | 1  | Yath  | y@example.com  |

MongoDB:
  Collection: users
  Document: {
    _id: "64abc...",
    name: "Yath",
    email: "y@example.com"
  }
```

---

### 1.5 What is React.js?

- React is a **JavaScript library** for building user interfaces
- Instead of writing HTML directly, you write **components** (reusable pieces of UI)
- React updates only what changes on the page (Virtual DOM) — very fast!

**Key React concepts:**
1. **Components** — Reusable UI pieces (like Login form, Navbar, Footer)
2. **JSX** — HTML-like syntax in JavaScript
3. **Props** — Data passed from parent to child component
4. **State** — Data that changes over time within a component
5. **Hooks** — Special functions to add state/lifecycle to functional components

---

## 📅 Phase 2 — Backend Deep Dive (Week 3-4)

### Topics to master:
- [ ] Node.js modules (CommonJS vs ES Modules)
- [ ] Express routing and middleware
- [ ] REST API design principles
- [ ] MongoDB + Mongoose (schemas, models, queries)
- [ ] Authentication with JWT
- [ ] Password hashing with bcrypt
- [ ] Environment variables (.env)
- [ ] Error handling
- [ ] CORS

---

## 📅 Phase 3 — Frontend Deep Dive (Week 5-6)

### Topics to master:
- [ ] React functional components
- [ ] JSX syntax
- [ ] useState and useEffect hooks
- [ ] React Router (routing, navigate, protected routes)
- [ ] Axios for API calls
- [ ] Context API (global state)
- [ ] Forms and controlled components
- [ ] Props and component composition

---

## 📅 Phase 4 — Integration & Project Understanding (Week 7)

### Topics to master:
- [ ] How frontend talks to backend (API calls)
- [ ] JWT flow (login → token → protected routes)
- [ ] localStorage for token storage
- [ ] Error handling on both ends
- [ ] Understanding the full QuickFixRide codebase

---

## 📅 Phase 5 — Interview Preparation (Week 8)

### Topics to master:
- [ ] All interview questions in `05-INTERVIEW-QA.md`
- [ ] System design basics
- [ ] Best practices from `06-BEST-PRACTICES.md`
- [ ] Be able to explain every file in your project

---

## ✅ Learning Checklist

### JavaScript Fundamentals (Before MERN):
- [ ] Variables: `var`, `let`, `const`
- [ ] Arrow functions: `() => {}`
- [ ] Template literals: `` `Hello ${name}` ``
- [ ] Destructuring: `const { name, email } = user`
- [ ] Spread operator: `{ ...obj }`
- [ ] Async/Await and Promises
- [ ] Array methods: `map`, `filter`, `find`, `forEach`
- [ ] Modules: `import`/`export` and `require`/`module.exports`

---

## 🎯 Interview Focus Areas

For a **Backend Engineer** role, focus on:
1. REST API design
2. Authentication (JWT)
3. Database design (MongoDB schemas)
4. Middleware and error handling
5. Security best practices
6. Performance and scalability thinking

For a **Full Stack** role, also focus on:
1. React component lifecycle
2. State management
3. Routing (protected routes)
4. API integration

---

*Next → Read `02-THEORY-BACKEND.md` to learn backend in depth!*
