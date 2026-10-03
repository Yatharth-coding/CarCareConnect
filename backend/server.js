const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// CORS - restrict origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.) in development
        if (!origin && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many auth attempts, please try again later.' }
});

const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many chat requests, please try again later.' }
});

app.use(generalLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'QuickFixRide API is running',
        healthCheck: '/api/health'
    });
});

// Health check endpoint
let dbConnected = false;

app.get('/api/health', (req, res) => {
    res.status(dbConnected ? 200 : 503).json({
        status: dbConnected ? 'healthy' : 'degraded',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/chat', chatLimiter, require('./routes/chatRoutes'));
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
