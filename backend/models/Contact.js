const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['general', 'property-inquiry', 'selling-inquiry', 'support', 'partnership', 'career'],
    default: 'general'
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social-media', 'referral', 'walk-in'],
    default: 'website'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  tags: [String],
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
contactSchema.index({ status: 1 });
contactSchema.index({ type: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ followUpDate: 1 });

// Text search index
contactSchema.index({
  name: 'text',
  email: 'text',
  subject: 'text',
  message: 'text'
});

// Virtual for age of inquiry
contactSchema.virtual('age').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Method to mark as read by a user
contactSchema.methods.markAsRead = function(userId) {
  if (!this.readBy.some(read => read.user.toString() === userId.toString())) {
    this.readBy.push({ user: userId });
    this.isRead = true;
  }
  return this.save();
};

// Method to add note
contactSchema.methods.addNote = function(content, userId) {
  this.notes.push({
    content,
    addedBy: userId
  });
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);