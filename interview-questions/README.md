# 🚀 QuickFixRide — MERN Stack Interview Preparation Hub

> Your personal roadmap to crack MERN stack interviews — theory, code explanation, best practices, and interview Q&A — all in one place.

---

## 📁 Files in this folder

| File | Description |
|------|-------------|
| [README.md](./README.md) | This file — the master index |
| [01-ROADMAP.md](./01-ROADMAP.md) | Your complete MERN learning roadmap |
| [02-THEORY-BACKEND.md](./02-THEORY-BACKEND.md) | Deep theory: Node.js, Express, MongoDB |
| [03-THEORY-FRONTEND.md](./03-THEORY-FRONTEND.md) | Deep theory: React, JSX, Hooks, Routing |
| [04-CODE-EXPLAINED.md](./04-CODE-EXPLAINED.md) | Every file in your project explained line-by-line |
| [05-INTERVIEW-QA.md](./05-INTERVIEW-QA.md) | 100+ interview questions with full answers |
| [06-BEST-PRACTICES.md](./06-BEST-PRACTICES.md) | Best practices for Backend Engineer role |
| [07-CONCEPTS-QUICK-REFERENCE.md](./07-CONCEPTS-QUICK-REFERENCE.md) | Cheat sheet — revise before interview |

---

## 🎯 How to use this hub

1. **Start with** `01-ROADMAP.md` — understand the big picture
2. **Read theory** in `02` and `03` — build your foundation  
3. **Study your code** in `04` — connect theory to real code
4. **Practice Q&A** in `05` — speak answers confidently
5. **Remember best practices** in `06` — impress interviewers
6. **Quick revise** from `07` — the night before your interview

---

## 🔥 Your Project: QuickFixRide

A ride-booking + mechanic-finder app built with:

| Layer | Technology |
|-------|-----------|
| **M** — Database | MongoDB + Mongoose |
| **E** — Backend Framework | Express.js |
| **R** — Frontend | React.js (JSX + Hooks) |
| **N** — Runtime | Node.js |
| **Auth** | JWT (JSON Web Token) |
| **Password Security** | bcryptjs |
| **HTTP Client** | Axios (frontend) |
| **Build Tool** | Vite |
| **AI** | Google Generative AI |

---

## 📌 Your Project Architecture (Visual)

```
Browser (React)
      |
      | HTTP Requests (Axios/Fetch)
      |
   Express Server (Node.js) — Port 3001
      |
      |--- /api/auth      → authRoutes.js → authController.js
      |--- /api/bookings  → bookingRoutes.js → bookingController.js
      |--- /api/chat      → chatRoutes.js → chatController.js
      |--- /api/config    → configRoutes.js
      |
      | Middleware: authMiddleware.js (JWT verify)
      |
   MongoDB (via Mongoose)
      |--- User Collection  (User.js model)
      |--- Booking Collection (Booking.js model)
```

---

*Start learning. Stay consistent. You will crack the interview!* 💪
