const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['management', 'sales', 'marketing', 'construction', 'legal', 'finance', 'hr', 'support']
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
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: {
    years: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0
    },
    previousCompanies: [String],
    specializations: [String]
  },
  achievements: [String],
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBoss: {
    type: Boolean,
    default: false
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  },
  salary: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  skills: [String],
  languages: [String],
  displayOrder: {
    type: Number,
    default: 0
  },
  showOnWebsite: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
teamMemberSchema.index({ department: 1 });
teamMemberSchema.index({ isActive: 1 });
teamMemberSchema.index({ isBoss: 1 });
teamMemberSchema.index({ showOnWebsite: 1 });
teamMemberSchema.index({ displayOrder: 1 });
teamMemberSchema.index({ joiningDate: -1 });

// Text search index
teamMemberSchema.index({
  name: 'text',
  position: 'text',
  bio: 'text',
  'skills': 'text'
});

// Ensure only one boss at a time
teamMemberSchema.pre('save', async function(next) {
  if (this.isBoss && this.isModified('isBoss')) {
    // Remove boss status from other members
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, isBoss: true },
      { $set: { isBoss: false } }
    );
  }
  next();
});

// Virtual for full name display
teamMemberSchema.virtual('displayName').get(function() {
  return `${this.name} - ${this.position}`;
});

// Virtual for experience display
teamMemberSchema.virtual('experienceDisplay').get(function() {
  const years = this.experience.years;
  if (years === 0) return 'Fresher';
  if (years === 1) return '1 year';
  return `${years} years`;
});

// Method to get formatted joining date
teamMemberSchema.methods.getFormattedJoiningDate = function() {
  return this.joiningDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

module.exports = mongoose.model('TeamMember', teamMemberSchema);