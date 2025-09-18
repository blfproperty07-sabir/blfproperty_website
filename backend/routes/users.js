const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const { authenticateToken, requireAdmin, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// Get user by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin or requesting their own data
    if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If admin is requesting, include additional stats
    let additionalData = {};
    if (req.user.role === 'admin') {
      const propertyCount = await Property.countDocuments({ owner: id });
      const activeProperties = await Property.countDocuments({ 
        owner: id, 
        status: 'approved' 
      });
      
      additionalData = {
        stats: {
          totalProperties: propertyCount,
          activeProperties,
          joinedDate: user.createdAt
        }
      };
    }

    res.json({
      success: true,
      data: {
        user,
        ...additionalData
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

// Update user (Admin can update any user, users can update themselves)
router.put('/:id', requireAuth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'admin'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
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
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user._id.toString() === id;

    // Check permissions
    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Non-admin users cannot change role or isActive
    const allowedUpdates = ['name', 'phone', 'address', 'preferences'];
    if (isAdmin) {
      allowedUpdates.push('role', 'isActive');
    }

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Prevent users from making themselves admin (only existing admins can do this)
    if (!isAdmin && updates.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot assign admin role'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

// Delete/Deactivate user (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (permanent === 'true') {
      // Permanent deletion - also handle related data
      await Property.deleteMany({ owner: id });
      await User.findByIdAndDelete(id);
      
      res.json({
        success: true,
        message: 'User permanently deleted'
      });
    } else {
      // Soft delete - just deactivate
      user.isActive = false;
      await user.save();
      
      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    }

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// Activate user (Admin only)
router.patch('/:id/activate', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User activated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error activating user'
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats/overview', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const buyers = await User.countDocuments({ role: 'buyer' });
    const sellers = await User.countDocuments({ role: 'seller' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByRole: {
          buyers,
          sellers,
          admins
        },
        recentRegistrations
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user statistics'
    });
  }
});

module.exports = router;