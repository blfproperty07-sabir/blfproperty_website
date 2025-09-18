const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// Public route to submit contact form
router.post('/submit', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Subject must be between 3 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['general', 'property-inquiry', 'selling-inquiry', 'support', 'partnership', 'career'])
    .withMessage('Invalid inquiry type'),
  body('property')
    .optional()
    .isMongoId()
    .withMessage('Invalid property ID')
], async (req, res) => {
  try {
    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Received contact data:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      type = 'general',
      property,
      priority = 'medium'
    } = req.body;

    // Create new contact entry
    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
      type,
      priority,
      status: 'new',
      source: 'website',
      isRead: false,
      followUpRequired: true
    };

    // Add property reference if provided
    if (property) {
      contactData.property = property;
      contactData.type = 'property-inquiry';
    }

    console.log('Creating contact entry with data:', contactData);

    const contact = new Contact(contactData);
    await contact.save();

    console.log('Contact entry created successfully:', contact._id);

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        contactId: contact._id,
        status: 'submitted'
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Get contact form submission status (public - for user to check)
router.get('/status/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    
    const contact = await Contact.findById(contactId)
      .select('status createdAt response.message response.respondedAt')
      .lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        status: contact.status,
        submittedAt: contact.createdAt,
        response: contact.response?.message || null,
        respondedAt: contact.response?.respondedAt || null
      }
    });

  } catch (error) {
    console.error('Get contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get inquiry types (public - for form dropdown)
router.get('/types', (req, res) => {
  res.json({
    success: true,
    data: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'property-inquiry', label: 'Property Inquiry' },
      { value: 'selling-inquiry', label: 'Want to Sell Property' },
      { value: 'support', label: 'Technical Support' },
      { value: 'partnership', label: 'Business Partnership' },
      { value: 'career', label: 'Career Opportunities' }
    ]
  });
});

module.exports = router;