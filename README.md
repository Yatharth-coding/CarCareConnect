# CarCareConnect 🚗💨

> A comprehensive modern web platform for on-demand ride booking, doorstep vehicle maintenance, car care services, and smart AI assistance.

![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI%20Assistant-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 🌟 Overview

**CarCareConnect** bridges the gap between everyday commuters, car owners, and professional automotive service providers. Whether you need an instant ride, doorstep vehicle diagnostics, periodic car maintenance, or a pressure wash, CarCareConnect brings automotive convenience directly to your fingertips.

Additionally, CarCareConnect features an integrated **AI Smart Chatbot** powered by Google Gemini, capable of answering queries regarding vehicle health, bookings, and platform guidance in real-time.

---

## ✨ Key Features

- **🚗 Ride Booking**: Easy booking flow with real-time route calculations.
- **🔧 On-Location Servicing**: Browse and schedule nearby mechanics for general car maintenance.
- **🧼 Doorstep Eco Car Wash**: Book a professional wash right at your location.
- **🤖 Smart AI Automotive Assistant**: Interactive chatbot powered by Google's Gemini LLM to guide users and answer vehicle care questions.
- **🔐 Secure Authentication**: Token-based JSON Web Token (JWT) user authentication with password hashing via `bcryptjs`.
- **📊 User Dashboard**: Real-time overview of your profile and active bookings.
- **🤝 Partner Application**: Driver-partners can submit applications to join the platform.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Modern CSS3 responsive layouts & flex/grid
- **Interactive UI**: Slick Carousel, Leaflet & Leaflet Routing Machine
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB (via Mongoose ODM)
- **AI Integration**: `@google/generative-ai` (Gemini Flash)
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv

---

## 📁 Repository Structure

```plaintext
CarCareConnect/
├── backend/
│   ├── config/             # MongoDB database connection configuration
│   ├── controllers/        # Request handling logic (auth, chat, bookings)
│   ├── middleware/         # Custom authentication & security middleware
│   ├── models/             # Mongoose schemas & data models
│   ├── routes/             # RESTful API route definitions
│   ├── .env.example        # Template for backend environment variables
│   ├── .gitignore          # Backend-specific gitignore rules
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Express app initialization & server entry point
├── frontend/
│   ├── public/             # Static public assets (images, logos, icons)
│   ├── src/
│   │   ├── assets/         # Stylesheets (CSS) and graphics
│   │   ├── components/     # Reusable UI components (Navbar, Footer, Chatbot)
│   │   ├── context/        # React context providers (Snackbar/Alerts)
│   │   ├── pages/          # Application views (Home, Login, BookRide, etc.)
│   │   ├── App.jsx         # Root routing & layout component
│   │   └── main.jsx        # Frontend entry point
│   ├── index.html          # Main HTML template
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite build configuration
├── .gitignore              # Project-wide gitignore exclusions
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to run CarCareConnect on your local machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Yatharth-coding/CarCareConnect.git
cd CarCareConnect
```

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to create your `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Fill in your actual credentials in `.env`:
     ```env
     PORT=3001
     MONGODB_URI=your_mongodb_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     JWT_SECRET=your_jwt_secret_key
     GOMAPS_API_KEY=your_gomaps_api_key
     ```

4. Start the backend server:
   ```bash
   npm start
   # or for auto-reload during development:
   npm run dev
   ```
   *The server will run on `http://localhost:3001`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `POST` | `/api/chat` | Send prompt to Gemini AI assistant | Public |
| `GET` | `/api/bookings` | Retrieve user bookings & history | Protected |
| `POST` | `/api/bookings` | Create a new ride / service booking | Protected |
| `GET` | `/api/config` | Fetch client configuration (maps, etc.) | Public |

---

## 🛡️ Security & Best Practices

- **Zero Tracked Secrets**: Environment files (`.env`) and API keys are strictly excluded from version control via `.gitignore`.
- **Stateless Authentication**: Protected endpoints verify tokens using JSON Web Tokens (JWT).
- **Graceful Fallbacks**: The Gemini AI chatbot includes fallback responses to ensure continuous uptime even during network or quota interruptions.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
