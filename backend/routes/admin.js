const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Property = require('../models/Property');
const TeamMember = require('../models/TeamMember');
const Contact = require('../models/Contact');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for property images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/properties/');
  },
  filename: function (req, file, cb) {
    cb(null, `property-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Admin Dashboard Overview
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    // Get current date and date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Property statistics
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });
    const newPropertiesToday = await Property.countDocuments({
      createdAt: { $gte: today }
    });

    // Contact/Inquiry statistics
    const totalInquiries = await Contact.countDocuments();
    const newInquiries = await Contact.countDocuments({ status: 'new' });
    const newInquiriesToday = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    // Team statistics
    const totalTeamMembers = await TeamMember.countDocuments();
    const activeTeamMembers = await TeamMember.countDocuments({ isActive: true });

    // Recent activities - Latest properties, users, inquiries
    const recentProperties = await Property.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type status createdAt owner');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentInquiries = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject type status createdAt');

    // Property types breakdown
    const propertyTypes = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly registration trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyUserStats = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          users: {
            total: totalUsers,
            active: activeUsers,
            newToday: newUsersToday,
            newThisMonth: newUsersThisMonth
          },
          properties: {
            total: totalProperties,
            approved: approvedProperties,
            pending: pendingProperties,
            rejected: rejectedProperties,
            newToday: newPropertiesToday
          },
          inquiries: {
            total: totalInquiries,
            new: newInquiries,
            newToday: newInquiriesToday
          },
          team: {
            total: totalTeamMembers,
            active: activeTeamMembers
          }
        },
        recentActivities: {
          properties: recentProperties,
          users: recentUsers,
          inquiries: recentInquiries
        },
        analytics: {
          propertyTypes,
          monthlyUserStats
        }
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// Get all properties (Admin only)
router.get('/properties', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('Admin properties request with params:', req.query);

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (category) filter.category = category;

    console.log('Filter object:', filter);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Found properties:', properties.length);
    console.log('Properties:', properties);

    const total = await Property.countDocuments(filter);
    console.log('Total count:', total);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching properties'
    });
  }
});

// Get pending properties for approval
router.get('/properties/pending', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pendingProperties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments({ status: 'pending' });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        properties: pendingProperties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get pending properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching pending properties'
    });
  }
});

// Approve property
router.patch('/properties/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // TODO: Send notification email to property owner

    res.json({
      success: true,
      message: 'Property approved successfully',
      data: { property }
    });

  } catch (error) {
    console.error('Approve property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving property'
    });
  }
});

// Reject property
router.patch('/properties/:id/reject', requireAdmin, [
  body('reason')
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const property = await Property.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // TODO: Send notification email to property owner with rejection reason

    res.json({
      success: true,
      message: 'Property rejected successfully',
      data: { property }
    });

  } catch (error) {
    console.error('Reject property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting property'
    });
  }
});

// Delete property (Admin only)
router.delete('/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting property'
    });
  }
});

// Create property (Admin only)
router.post('/properties', requireAdmin, upload.array('images', 10), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('type')
    .isIn(['apartment', 'villa', 'house', 'office', 'shop', 'warehouse', 'commercial'])
    .withMessage('Invalid property type'),
  body('category')
    .isIn(['rent', 'sale'])
    .withMessage('Category must be either rent or sale'),
  body('rent')
    .optional()
    .isNumeric()
    .withMessage('Rent must be a number'),
  body('area')
    .isNumeric()
    .withMessage('Area must be a number'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('Address must be between 5 and 300 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be 6 digits'),
  body('description')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Description must be between 5 and 1000 characters')
], async (req, res) => {
  try {
    console.log('=== RENTAL PROPERTY CREATION REQUEST ===');
    console.log('Received rental property data:', req.body);
    console.log('Received files:', req.files?.map(f => ({ name: f.originalname, size: f.size })));
    
    // Check each field individually
    console.log('Field by field check:');
    console.log('title:', req.body.title);
    console.log('type:', req.body.type);
    console.log('rent:', req.body.rent);
    console.log('area:', req.body.area);
    console.log('address:', req.body.address);
    console.log('city:', req.body.city);
    console.log('state:', req.body.state);
    console.log('pincode:', req.body.pincode);
    console.log('description:', req.body.description);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('=== VALIDATION ERRORS ===');
      console.log('Validation errors:', errors.array());
      const errorMessages = errors.array().map(err => `${err.param}: ${err.msg}`).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${errorMessages}`,
        errors: errors.array()
      });
    }

    const {
      title,
      type,
      category,
      rent,
      deposit,
      area,
      bedrooms,
      bathrooms,
      floor,
      furnished,
      address,
      city,
      state,
      pincode,
      description,
      status = 'approved' // Admin-created properties are auto-approved
    } = req.body;

    // Process uploaded images - convert to required format
    const images = req.files ? req.files.map(file => ({
      url: file.filename,
      caption: '',
      isPrimary: false
    })) : [];

    // Set first image as primary if any images exist
    if (images.length > 0) {
      images[0].isPrimary = true;
    }

    // Create property object with proper model structure
    const propertyData = {
      title,
      description,
      type,
      category,
      // Price structure for model
      price: {
        amount: category === 'rent' ? parseFloat(rent || 0) : parseFloat(rent || 0),
        currency: 'INR',
        negotiable: true
      },
      // Area structure for model
      area: {
        size: parseFloat(area),
        unit: 'sqft'
      },
      // Location structure for model
      location: {
        address,
        city,
        state,
        pincode,
        // Default coordinates (you can implement geocoding later)
        coordinates: {
          latitude: 26.8467, // Default to Bihar coordinates
          longitude: 80.9462
        }
      },
      // Features structure for model
      features: {
        bedrooms: bedrooms ? parseInt(bedrooms) : 1,
        bathrooms: bathrooms ? parseInt(bathrooms) : 1,
        parking: 0,
        furnished: furnished || 'unfurnished',
        floor: {
          current: floor ? parseInt(floor) : 1,
          total: (floor ? parseInt(floor) : 1) + 2 // Assume building has 2 more floors
        }
      },
      images,
      owner: req.user._id,
      status,
      amenities: [] // Empty amenities for now
    };

    // Add deposit to additional data if it's a rental
    if (category === 'rent' && deposit) {
      propertyData.deposit = parseFloat(deposit);
    }

    console.log('Creating admin property with data:', propertyData);

    try {
      const property = new Property(propertyData);
      await property.save();

      // Populate owner details for response
      await property.populate('owner', 'name email');

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: { property }
      });
    } catch (saveError) {
      console.error('Property save error:', saveError);
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: `Property validation failed: ${validationErrors.join(', ')}`,
          errors: validationErrors
        });
      }
      throw saveError;
    }

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating property'
    });
  }
});

// Create admin user
router.post('/create-admin', requireAdmin, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new admin user
    const adminUser = new User({
      name,
      email,
      password,
      phone,
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    await adminUser.save();

    // Remove password from response
    const userResponse = adminUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating admin user'
    });
  }
});

// Get all inquiries/contacts
router.get('/inquiries', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const inquiries = await Contact.find(filter)
      .populate('property', 'title type')
      .populate('assignedTo', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching inquiries'
    });
  }
});

// Update inquiry status
router.patch('/inquiries/:id/status', requireAdmin, [
  body('status')
    .isIn(['new', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status'),
  body('response')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Response cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, response } = req.body;

    const updateData = { status };
    
    if (response) {
      updateData.response = {
        message: response,
        respondedBy: req.user._id,
        respondedAt: new Date()
      };
    }

    const inquiry = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('property', 'title')
     .populate('assignedTo', 'name')
     .populate('response.respondedBy', 'name');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: { inquiry }
    });

  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating inquiry status'
    });
  }
});

// Assign inquiry to admin
router.patch('/inquiries/:id/assign', requireAdmin, [
  body('assignedTo')
    .isMongoId()
    .withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { assignedTo } = req.body;

    // Check if assignedTo user is admin
    const assignUser = await User.findById(assignedTo);
    if (!assignUser || assignUser.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Can only assign to admin users'
      });
    }

    const inquiry = await Contact.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry assigned successfully',
      data: { inquiry }
    });

  } catch (error) {
    console.error('Assign inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error assigning inquiry'
    });
  }
});

// Get system statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // User statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Property statistics by status
    const propertyStats = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily registration trends
    const dailyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Property submission trends
    const dailyProperties = await Property.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        period: `${periodDays} days`,
        userStats,
        propertyStats,
        trends: {
          dailyRegistrations,
          dailyProperties
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
});

module.exports = router;