const express = require('express');
const { body, validationResult } = require('express-validator');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const { requireAdmin, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Log all requests to team routes
router.use((req, res, next) => {
  console.log(`\n=== TEAM ROUTE DEBUG ===`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Full URL: ${req.originalUrl}`);
  console.log(`Content-Type: ${req.headers['content-type']}`);
  console.log(`Authorization: ${req.headers.authorization ? 'Present' : 'Missing'}`);
  console.log('========================\n');
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/team/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    console.log('Multer fileFilter - Processing file:', file.originalname);
    console.log('File mimetype:', file.mimetype);
    console.log('File size:', file.size);
    
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log('File accepted by multer filter');
      return cb(null, true);
    } else {
      console.log('File rejected by multer filter');
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all team members for About page (public route - shows all active members)
router.get('/about', async (req, res) => {
  try {
    console.log('Fetching team members for About page');
    
    // For About page, show all active members regardless of showOnWebsite setting
    const teamMembers = await TeamMember.find({ isActive: true })
      .populate('addedBy', 'name')
      .sort({ displayOrder: 1, joiningDate: -1 });

    console.log(`Found ${teamMembers.length} team members for About page`);

    // Separate boss from other members
    const boss = teamMembers.find(member => member.isBoss);
    const otherMembers = teamMembers.filter(member => !member.isBoss);

    res.json({
      success: true,
      data: {
        boss: boss || null,
        teamMembers: otherMembers,
        total: teamMembers.length
      }
    });

  } catch (error) {
    console.error('Error fetching team members for About page:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all team members (public route for website display)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      department,
      isActive = true,
      showOnWebsite = true,
      search,
      showAll = false // New parameter for admin to see all members
    } = req.query;

    // Build filter object
    const filter = {};
    
    // For admin requests with showAll=true, show all active members regardless of showOnWebsite
    if (req.user && req.user.role === 'admin' && showAll === 'true') {
      filter.isActive = true; // Only show active members
      console.log('Admin requesting all team members');
    } else {
      // For public access, only show active members that should be displayed on website
      if (!req.user || req.user.role !== 'admin') {
        filter.isActive = true;
        filter.showOnWebsite = true;
      } else {
        // Admin can see all or filter specifically
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (showOnWebsite !== undefined) filter.showOnWebsite = showOnWebsite === 'true';
      }
    }

    if (department) filter.department = department;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort by display order first, then by joining date
    const teamMembers = await TeamMember.find(filter)
      .populate('addedBy', 'name')
      .sort({ displayOrder: 1, joiningDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TeamMember.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Separate boss from other members for better display
    const boss = teamMembers.find(member => member.isBoss);
    const otherMembers = teamMembers.filter(member => !member.isBoss);

    res.json({
      success: true,
      data: {
        boss: boss || null,
        teamMembers: otherMembers,
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
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching team members'
    });
  }
});

// Get team member by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const filter = { _id: id };
    
    // For public access, only show active members that should be displayed
    if (!req.user || req.user.role !== 'admin') {
      filter.isActive = true;
      filter.showOnWebsite = true;
    }

    const teamMember = await TeamMember.findOne(filter)
      .populate('addedBy', 'name');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: { teamMember }
    });

  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching team member'
    });
  }
});

// Create team member (Admin only)
router.post('/', requireAdmin, upload.single('profileImage'), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('position')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('department')
    .isIn(['management', 'sales', 'marketing', 'construction', 'legal', 'finance', 'hr', 'support'])
    .withMessage('Invalid department'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('userRole')
    .isIn(['user', 'admin'])
    .withMessage('User role must be either user or admin'),
  body('joiningDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid joining date'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('experience.years')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience years must be a positive number'),
  body('isBoss')
    .optional()
    .isBoolean()
    .withMessage('isBoss must be a boolean'),
  body('showOnWebsite')
    .optional()
    .isBoolean()
    .withMessage('showOnWebsite must be a boolean')
], async (req, res) => {
  try {
    console.log('\n=== TEAM MEMBER CREATION START ===');
    console.log('User making request:', req.user ? req.user.email : 'No user');
    console.log('User role:', req.user ? req.user.role : 'No role');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('====================================\n');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, userRole, ...teamMemberData } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User creation failed: Email ${email} already exists`);
      return res.status(400).json({
        success: false,
        message: `User with email ${email} already exists. Please use a different email address.`,
        error: 'DUPLICATE_EMAIL'
      });
    }

    // Check if team member with this email already exists
    const existingTeamMember = await TeamMember.findOne({ email });
    if (existingTeamMember) {
      console.log(`❌ Team member creation failed: Email ${email} already exists in team`);
      return res.status(400).json({
        success: false,
        message: `Team member with email ${email} already exists. Please use a different email address.`,
        error: 'DUPLICATE_TEAM_EMAIL'
      });
    }

    // Create User account first
    const newUser = new User({
      name: teamMemberData.name,
      email: email,
      phone: teamMemberData.phone,
      password: password,
      role: userRole, // 'user' or 'admin'
      isVerified: true // Auto-verify team members
    });

    await newUser.save();
    console.log('Created user account:', newUser.email, 'with role:', newUser.role);

    // Create TeamMember record
    const teamMemberRecord = {
      ...teamMemberData,
      email: email,
      addedBy: req.user._id,
      userId: newUser._id, // Link to the User account
      joiningDate: teamMemberData.joiningDate || new Date() // Default to current date if not provided
    };

    // Handle file upload
    if (req.file) {
      console.log('File uploaded successfully:', req.file.filename);
      teamMemberRecord.profileImage = `/uploads/team/${req.file.filename}`;
      console.log('Profile image path set to:', teamMemberRecord.profileImage);
    } else {
      console.log('No file uploaded for team member');
    }

    // Parse JSON fields if they exist
    if (req.body.qualifications) {
      try {
        teamMemberRecord.qualifications = JSON.parse(req.body.qualifications);
      } catch (e) {
        // Clean up created user if team member creation fails
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({
          success: false,
          message: 'Invalid qualifications format'
        });
      }
    }

    if (req.body.experience) {
      try {
        teamMemberRecord.experience = JSON.parse(req.body.experience);
      } catch (e) {
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({
          success: false,
          message: 'Invalid experience format'
        });
      }
    }

    if (req.body.socialLinks) {
      try {
        teamMemberRecord.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (e) {
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({
          success: false,
          message: 'Invalid social links format'
        });
      }
    }

    if (req.body.address) {
      try {
        teamMemberRecord.address = JSON.parse(req.body.address);
      } catch (e) {
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({
          success: false,
          message: 'Invalid address format'
        });
      }
    }

    if (req.body.emergencyContact) {
      try {
        teamMemberRecord.emergencyContact = JSON.parse(req.body.emergencyContact);
      } catch (e) {
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({
          success: false,
          message: 'Invalid emergency contact format'
        });
      }
    }

    // Parse arrays
    if (req.body.skills) {
      teamMemberRecord.skills = Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim());
    }

    if (req.body.languages) {
      teamMemberRecord.languages = Array.isArray(req.body.languages) ? req.body.languages : req.body.languages.split(',').map(l => l.trim());
    }

    if (req.body.achievements) {
      teamMemberRecord.achievements = Array.isArray(req.body.achievements) ? req.body.achievements : req.body.achievements.split(',').map(a => a.trim());
    }

    const teamMember = new TeamMember(teamMemberRecord);
    console.log('Creating team member with data:', {
      name: teamMemberRecord.name,
      email: teamMemberRecord.email,
      profileImage: teamMemberRecord.profileImage,
      department: teamMemberRecord.department
    });
    
    await teamMember.save();
    console.log('Team member saved successfully with profileImage:', teamMember.profileImage);

    const populatedMember = await TeamMember.findById(teamMember._id)
      .populate('addedBy', 'name')
      .populate('userId', 'email role isVerified');

    res.status(201).json({
      success: true,
      message: `Team member created successfully with ${userRole} account`,
      data: { 
        teamMember: populatedMember,
        userAccount: {
          email: newUser.email,
          role: newUser.role,
          isVerified: newUser.isVerified
        }
      }
    });

  } catch (error) {
    console.error('\n=== TEAM MEMBER CREATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('==================================\n');
    
    res.status(500).json({
      success: false,
      message: 'Server error creating team member',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update team member (Admin only)
router.put('/:id', requireAdmin, upload.single('profileImage'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  body('department')
    .optional()
    .isIn(['management', 'sales', 'marketing', 'construction', 'legal', 'finance', 'hr', 'support'])
    .withMessage('Invalid department'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
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

    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.profileImage = `/uploads/team/${req.file.filename}`;
    }

    // Parse JSON fields if they exist
    ['qualifications', 'experience', 'socialLinks', 'address', 'emergencyContact'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          updateData[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    });

    // Parse arrays
    ['skills', 'languages', 'achievements'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        updateData[field] = req.body[field].split(',').map(item => item.trim());
      }
    });

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: { teamMember }
    });

  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating team member'
    });
  }
});

// Delete team member (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id).populate('userId');

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Delete associated User account if it exists
    if (teamMember.userId) {
      await User.findByIdAndDelete(teamMember.userId);
      console.log('Deleted user account:', teamMember.email);
    }

    // Delete team member record
    await TeamMember.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Team member and associated user account deleted successfully'
    });

  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting team member'
    });
  }
});

// Toggle team member active status (Admin only)
router.patch('/:id/toggle-status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    teamMember.isActive = !teamMember.isActive;
    await teamMember.save();

    res.json({
      success: true,
      message: `Team member ${teamMember.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { teamMember }
    });

  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling status'
    });
  }
});

// Update display order (Admin only)
router.patch('/reorder', requireAdmin, [
  body('memberOrders')
    .isArray()
    .withMessage('Member orders must be an array'),
  body('memberOrders.*.id')
    .isMongoId()
    .withMessage('Invalid member ID'),
  body('memberOrders.*.displayOrder')
    .isInt({ min: 0 })
    .withMessage('Display order must be a positive number')
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

    const { memberOrders } = req.body;

    // Update display orders
    const updatePromises = memberOrders.map(({ id, displayOrder }) =>
      TeamMember.findByIdAndUpdate(id, { displayOrder })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Display order updated successfully'
    });

  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating display order'
    });
  }
});

// Get team statistics (Admin only)
router.get('/stats/overview', requireAdmin, async (req, res) => {
  try {
    const totalMembers = await TeamMember.countDocuments();
    const activeMembers = await TeamMember.countDocuments({ isActive: true });
    const membersByDepartment = await TeamMember.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const averageExperience = await TeamMember.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgExp: { $avg: '$experience.years' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers,
        membersByDepartment,
        averageExperience: averageExperience[0]?.avgExp || 0
      }
    });

  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching team statistics'
    });
  }
});

module.exports = router;