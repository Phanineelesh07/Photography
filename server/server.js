const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');

const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS (Top priority)
app.use(cors());

// Set security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body parser (Must be before sanitizers)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prevent NoSQL injections
// app.use(mongoSanitize());

// Prevent http param pollution
// app.use(hpp());

// Compress response bodies
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000, 
  message: 'Too many requests from this IP, please try again in 10 minutes'
});
app.use('/api/', limiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/participant', require('./routes/participantRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
} else {
  // Root route
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handler middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
