const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables from the correct path
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - Temporarily disabled for testing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// CORS configuration
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploaded images with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/team', require('./routes/team'));
app.use('/api/contact', require('./routes/contact'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Eazy Property Solution Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? 'Found' : 'Not found');
console.log('NODE_ENV:', process.env.NODE_ENV);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eazyproperty';
console.log('Connecting to MongoDB with URI:', mongoUri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Create default admin user
  const User = require('./models/User');
  const createDefaultAdmin = async () => {
    try {
      const adminExists = await User.findOne({ email: 'sannikumargupta43@gmail.com' });
      if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('sanni@123', 12);
        
        const defaultAdmin = new User({
          name: 'Sanni Kumar Gupta',
          email: 'sannikumargupta43@gmail.com',
          password: hashedPassword,
          role: 'admin',
          isVerified: true
        });
        
        await defaultAdmin.save();
        console.log('Default admin created successfully');
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  };
  
  createDefaultAdmin();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
