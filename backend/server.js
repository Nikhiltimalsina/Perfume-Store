const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const perfumeRoutes = require('./routes/perfumeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3001', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
}, express.static(process.env.UPLOAD_PATH || 'uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/perfumes', perfumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Perfume E-commerce API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message),
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Duplicate entry',
      field: error.errors[0]?.path,
    });
  }
  
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Invalid reference',
      field: error.fields,
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
    });
  }
  
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

module.exports = app;
