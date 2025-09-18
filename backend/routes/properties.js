const express = require('express');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const Contact = require('../models/Contact');
const { authenticateToken, requireSellerOrAdmin, requireAuth, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for property image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/properties/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per file
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all properties (public route with filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      latitude,
      longitude,
      radius = 10 // km
    } = req.query;

    console.log('Properties route - Request params:', req.query);

    // Build filter object
    const filter = { status: 'approved' };
    console.log('Properties route - Filter object:', filter);
    
    // Debug: Check all properties in database
    const allProperties = await Property.find({}).select('title status createdAt');
    console.log('Properties route - ALL properties in DB:', allProperties.map(p => ({ 
      title: p.title, 
      status: p.status, 
      createdAt: p.createdAt 
    })));
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (featured) filter.featured = featured === 'true';

    // Price range filter
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Bedroom filter
    if (bedrooms) {
      filter['features.bedrooms'] = parseInt(bedrooms);
    }

    // Bathroom filter
    if (bathrooms) {
      filter['features.bathrooms'] = { $gte: parseInt(bathrooms) };
    }

    // Area filter
    if (minArea || maxArea) {
      filter['area.size'] = {};
      if (minArea) filter['area.size'].$gte = parseFloat(minArea);
      if (maxArea) filter['area.size'].$lte = parseFloat(maxArea);
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      filter.amenities = { $in: amenityList };
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Location-based search
    if (latitude && longitude) {
      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort object
    const sort = {};
    if (search && !sortBy) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Get properties with pagination
    const properties = await Property.find(filter)
      .populate('owner', 'name email') // Only name and email for public, NO phone
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-interested'); // Don't expose interested users publicly

    console.log('Properties route - Found properties count:', properties.length);
    console.log('Properties route - Properties:', properties.map(p => ({ 
      id: p._id, 
      title: p.title, 
      status: p.status 
    })));

    // Get total count for pagination
    const total = await Property.countDocuments(filter);
    console.log('Properties route - Total approved properties:', total);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProperties: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
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

// Get property by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate('owner', 'name email') // Only name and email for public, NO phone
      .populate('approvedBy', 'name');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if property is approved for public viewing
    if (property.status !== 'approved' && (!req.user || 
        (req.user._id.toString() !== property.owner._id.toString() && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'Property not available for viewing'
      });
    }

    // Increment views if not owner or admin
    if (!req.user || (req.user._id.toString() !== property.owner._id.toString() && req.user.role !== 'admin')) {
      await property.incrementViews();
    }

    // Get similar properties (same type and city, excluding current property)
    const similarProperties = await Property.find({
      _id: { $ne: id },
      type: property.type,
      'location.city': property.location.city,
      status: 'approved'
    })
    .populate('owner', 'name')
    .limit(4)
    .select('title price area location images type category');

    res.json({
      success: true,
      data: {
        property,
        similarProperties
      }
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching property'
    });
  }
});

// Create property (Seller or Admin only)
router.post('/', requireSellerOrAdmin, upload.array('images', 10), [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('type')
    .isIn(['apartment', 'villa', 'house', 'plot', 'commercial', 'office', 'shop', 'warehouse'])
    .withMessage('Invalid property type'),
  body('category')
    .isIn(['rent', 'sale', 'lease'])
    .withMessage('Invalid property category')
], async (req, res) => {
  try {
    // Parse JSON fields first before validation
    let parsedData = { ...req.body };
    
    try {
      if (req.body.price && typeof req.body.price === 'string') {
        parsedData.price = JSON.parse(req.body.price);
      }
      if (req.body.area && typeof req.body.area === 'string') {
        parsedData.area = JSON.parse(req.body.area);
      }
      if (req.body.location && typeof req.body.location === 'string') {
        parsedData.location = JSON.parse(req.body.location);
      }
      if (req.body.features && typeof req.body.features === 'string') {
        parsedData.features = JSON.parse(req.body.features);
      }
      if (req.body.contact && typeof req.body.contact === 'string') {
        parsedData.contact = JSON.parse(req.body.contact);
      }
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON data in request',
        error: parseError.message
      });
    }

    // Custom validation
    const validationErrors = [];
    
    // Price validation
    if (!parsedData.price || !parsedData.price.amount || parsedData.price.amount <= 0) {
      validationErrors.push({ field: 'price.amount', message: 'Price must be a positive number' });
    }
    
    // Area validation
    if (!parsedData.area || !parsedData.area.size || parsedData.area.size <= 0) {
      validationErrors.push({ field: 'area.size', message: 'Area size must be greater than 0' });
    }
    
    // Location validation
    if (!parsedData.location || !parsedData.location.address) {
      validationErrors.push({ field: 'location.address', message: 'Address is required' });
    }
    if (!parsedData.location || !parsedData.location.city) {
      validationErrors.push({ field: 'location.city', message: 'City is required' });
    }
    if (!parsedData.location || !parsedData.location.state) {
      validationErrors.push({ field: 'location.state', message: 'State is required' });
    }
    if (!parsedData.location || !parsedData.location.pincode || !/^[0-9]{6}$/.test(parsedData.location.pincode)) {
      validationErrors.push({ field: 'location.pincode', message: 'Please provide a valid 6-digit pincode' });
    }
    
    // Coordinates validation
    if (!parsedData.location || !parsedData.location.coordinates) {
      validationErrors.push({ field: 'location.coordinates', message: 'Coordinates are required' });
    } else {
      const lat = parseFloat(parsedData.location.coordinates.latitude);
      const lng = parseFloat(parsedData.location.coordinates.longitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        validationErrors.push({ field: 'location.coordinates.latitude', message: 'Invalid latitude' });
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        validationErrors.push({ field: 'location.coordinates.longitude', message: 'Invalid longitude' });
      }
    }

    // Check for validation errors from express-validator
    const expressValidationErrors = validationResult(req);
    if (!expressValidationErrors.isEmpty()) {
      validationErrors.push(...expressValidationErrors.array());
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one property image is required'
      });
    }

    const propertyData = {
      ...parsedData,
      owner: req.user._id
    };

    // Handle amenities array
    if (propertyData.amenities) {
      propertyData.amenities = Array.isArray(propertyData.amenities) 
        ? propertyData.amenities 
        : propertyData.amenities.split(',').map(a => a.trim());
    }

    // Handle images
    propertyData.images = req.files.map((file, index) => ({
      url: `/uploads/properties/${file.filename}`,
      isPrimary: index === 0,
      caption: `${propertyData.title} - Image ${index + 1}`
    }));

    // Admin can directly approve properties
    if (req.user.role === 'admin') {
      propertyData.status = 'approved';
      propertyData.approvedBy = req.user._id;
      propertyData.approvedAt = new Date();
    }

    const property = new Property(propertyData);
    await property.save();

    const populatedProperty = await Property.findById(property._id)
      .populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: `Property ${property.status === 'approved' ? 'created and approved' : 'submitted for approval'} successfully`,
      data: { property: populatedProperty }
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating property'
    });
  }
});

// Update property (Owner or Admin only)
router.put('/:id', requireAuth, upload.array('newImages', 5), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('price.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
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
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check permissions
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = { ...req.body };

    // Parse JSON fields
    ['price', 'area', 'location', 'features', 'contact'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          updateData[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    });

    // Handle amenities
    if (req.body.amenities) {
      updateData.amenities = Array.isArray(req.body.amenities) 
        ? req.body.amenities 
        : req.body.amenities.split(',').map(a => a.trim());
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/properties/${file.filename}`,
        isPrimary: false,
        caption: `${property.title} - New Image ${index + 1}`
      }));
      
      updateData.images = [...property.images, ...newImages];
    }

    // If not admin and property was approved, reset to pending for re-approval
    if (!isAdmin && property.status === 'approved') {
      updateData.status = 'pending';
      updateData.approvedBy = undefined;
      updateData.approvedAt = undefined;
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property: updatedProperty }
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating property'
    });
  }
});

// Delete property (Owner or Admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check permissions
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
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

// Get user's properties (Owner only)
router.get('/user/my-properties', requireAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      category
    } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(filter);
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
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user properties'
    });
  }
});

// Express interest in property
router.post('/:id/interest', requireAuth, [
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for viewing'
      });
    }

    // Check if user already expressed interest
    const existingInterest = property.interested.find(
      interest => interest.user.toString() === req.user._id.toString()
    );

    if (existingInterest) {
      return res.status(400).json({
        success: false,
        message: 'You have already expressed interest in this property'
      });
    }

    // Add interest
    property.interested.push({
      user: req.user._id,
      message: message || 'Interested in this property'
    });

    await property.save();

    // Create contact inquiry
    const contact = new Contact({
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      subject: `Interest in ${property.title}`,
      message: message || `I am interested in your property: ${property.title}`,
      type: 'property-inquiry',
      property: property._id
    });

    await contact.save();

    res.json({
      success: true,
      message: 'Interest expressed successfully. The property owner will be notified.'
    });

  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error expressing interest'
    });
  }
});

// Get property statistics
router.get('/stats/overview', optionalAuth, async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments({ status: 'approved' });
    const forSale = await Property.countDocuments({ status: 'approved', category: 'sale' });
    const forRent = await Property.countDocuments({ status: 'approved', category: 'rent' });
    const forLease = await Property.countDocuments({ status: 'approved', category: 'lease' });

    // Property types breakdown
    const propertyTypes = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top cities
    const topCities = await Property.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Price ranges
    const priceRanges = await Property.aggregate([
      { $match: { status: 'approved' } },
      {
        $bucket: {
          groupBy: '$price.amount',
          boundaries: [0, 1000000, 5000000, 10000000, 50000000, 100000000, Infinity],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        byCategory: {
          sale: forSale,
          rent: forRent,
          lease: forLease
        },
        propertyTypes,
        topCities,
        priceRanges
      }
    });

  } catch (error) {
    console.error('Get property stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching property statistics'
    });
  }
});

// Search suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const suggestions = [];

    if (type === 'all' || type === 'cities') {
      // City suggestions
      const cities = await Property.distinct('location.city', {
        status: 'approved',
        'location.city': { $regex: q, $options: 'i' }
      });
      suggestions.push(...cities.slice(0, 5).map(city => ({ type: 'city', value: city })));
    }

    if (type === 'all' || type === 'areas') {
      // Area/neighborhood suggestions
      const areas = await Property.distinct('location.neighborhood', {
        status: 'approved',
        'location.neighborhood': { $regex: q, $options: 'i' }
      });
      suggestions.push(...areas.slice(0, 5).map(area => ({ type: 'area', value: area })));
    }

    res.json({
      success: true,
      data: { suggestions: suggestions.slice(0, 10) }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching suggestions'
    });
  }
});

module.exports = router;