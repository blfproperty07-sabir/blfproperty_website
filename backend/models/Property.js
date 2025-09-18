const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'villa', 'house', 'plot', 'commercial', 'office', 'shop', 'warehouse']
  },
  category: {
    type: String,
    required: [true, 'Property category is required'],
    enum: ['rent', 'sale', 'lease']
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  area: {
    size: {
      type: Number,
      required: [true, 'Area size is required'],
      min: [1, 'Area must be at least 1']
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm', 'acres'],
      default: 'sqft'
    }
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude']
      }
    },
    landmark: String,
    neighborhood: String
  },
  features: {
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms cannot be negative'],
      default: 0
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
      default: 0
    },
    balconies: {
      type: Number,
      min: [0, 'Balconies cannot be negative'],
      default: 0
    },
    parking: {
      type: Number,
      min: [0, 'Parking spaces cannot be negative'],
      default: 0
    },
    furnished: {
      type: String,
      enum: ['fully-furnished', 'semi-furnished', 'unfurnished'],
      default: 'unfurnished'
    },
    floor: {
      current: Number,
      total: Number
    },
    age: {
      type: Number,
      min: [0, 'Property age cannot be negative']
    },
    facing: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west']
    }
  },
  amenities: [{
    type: String,
    enum: [
      'gym', 'swimming-pool', 'garden', 'playground', 'security', 'parking',
      'elevator', 'power-backup', 'water-supply', 'club-house', 'jogging-track',
      'tennis-court', 'basketball-court', 'library', 'party-hall', 'spa',
      'yoga-room', 'meditation-hall', 'intercom', 'waste-management', 'wifi'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['title-deed', 'sale-deed', 'building-approval', 'noc', 'tax-receipt', 'other']
    },
    url: String,
    name: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'rented'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  views: {
    type: Number,
    default: 0
  },
  interested: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contactedAt: {
      type: Date,
      default: Date.now
    },
    message: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  availability: {
    from: Date,
    to: Date
  },
  contact: {
    showOwnerDetails: {
      type: Boolean,
      default: true
    },
    preferredTime: String,
    additionalPhone: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ status: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.state': 1 });
propertySchema.index({ 'price.amount': 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ featured: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });

// Text search index
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.neighborhood': 'text'
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  if (this.price.amount >= 10000000) {
    return `₹${(this.price.amount / 10000000).toFixed(2)} Cr`;
  } else if (this.price.amount >= 100000) {
    return `₹${(this.price.amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${this.price.amount.toLocaleString('en-IN')}`;
  }
});

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Middleware to update views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Ensure only one primary image
propertySchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach(img => {
      if (img.isPrimary) primaryCount++;
    });
    
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryCount > 1) {
      let firstPrimary = true;
      this.images.forEach(img => {
        if (img.isPrimary && firstPrimary) {
          firstPrimary = false;
        } else if (img.isPrimary) {
          img.isPrimary = false;
        }
      });
    }
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);