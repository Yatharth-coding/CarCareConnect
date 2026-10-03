const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`FATAL: Required environment variable ${envVar} is not set.`);
        process.exit(1);
    }
}

const app = express();

// Security headers
app.use(helmet());

// Cookie parser for HttpOnly auth cookies
app.use(cookieParser());

// CORS - restrict origins with robust trimming and Vercel domain support
const configuredOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/+$/, '')).filter(Boolean)
    : [];

const localOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) {
            return callback(null, true);
        }
        const cleanOrigin = origin.replace(/\/+$/, '');
        if (
            localOrigins.includes(cleanOrigin) ||
            configuredOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
}));

// Body parsing without restrictive request size limits
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
let dbConnected = false;

app.get('/api/health', (req, res) => {
    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? 'healthy' : 'degraded',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Routes - no rate limiting applied
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/driver-applications', require('./routes/driverApplicationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectDB();
        dbConnected = true;
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        console.warn('Server starting in degraded mode - database unavailable');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
