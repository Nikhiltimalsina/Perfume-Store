const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
// Temporarily comment out database imports for testing
// const { db } = require('./database/index.js');
// const { User } = require('./models/user/User.js');

dotenv.config();

const app = express();

// Temporarily comment out database connection for testing
// db().catch(console.error);

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// GET route for testing registration page
app.get('/api/auth/register', (req, res) => {
  res.json({ 
    message: 'Registration endpoint is available',
    method: 'Use POST to register a user',
    example: {
      url: 'POST /api/auth/register',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      }
    }
  });
});

// GET route for testing login page
app.get('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login endpoint is available',
    method: 'Use POST to login',
    example: {
      url: 'POST /api/auth/login',
      body: {
        email: 'test@example.com',
        password: '123456'
      }
    }
  });
});

// Temporary auth routes without database for testing
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register endpoint called');
    console.log('Request body:', req.body);
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['email', 'password', 'name'],
        received: Object.keys(req.body)
      });
    }

    // For now, just return success without database
    res.status(201).json({
      message: 'User registered successfully (temporary - no database)',
      user: { 
        name, 
        email,
        id: Date.now() // temporary ID
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login endpoint called');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        received: Object.keys(req.body)
      });
    }

    // For now, just return success without database validation
    res.json({
      message: 'Login successful (temporary - no database validation)',
      user: { email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Add a simple registration page route
app.get('/register', (req, res) => {
  res.json({
    message: 'Registration page endpoint',
    instructions: 'This is a GET endpoint for the registration page',
    apiEndpoint: 'POST /api/auth/register for actual registration'
  });
});

// Add a simple login page route
app.get('/login', (req, res) => {
  res.json({
    message: 'Login page endpoint',
    instructions: 'This is a GET endpoint for the login page',
    apiEndpoint: 'POST /api/auth/login for actual login'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000; // Change to 3000

// Start server with proper error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`JWT_SECRET loaded: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
  console.log('Available routes:');
  console.log('- GET /test');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('Server is ready to accept requests!');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Register function
const registerUser = async (name, email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login function
const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user profile (protected route)
const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Profile error:', error);
    throw error;
  }
};
