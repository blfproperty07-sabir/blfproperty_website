const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/eazy-property', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Find an existing user to use as owner
  const user = await User.findOne({ role: 'seller' }) || await User.findOne();
  
  if (!user) {
    console.log('No user found to assign as property owner');
    process.exit(1);
  }
  
  console.log('Using user:', user.name, 'as property owner');
  
  // Create a test rent property
  const rentProperty = new Property({
    title: 'Beautiful 2BHK for Rent',
    description: 'A beautiful 2 bedroom apartment available for rent in a prime location.',
    type: 'apartment',
    category: 'rent', // This is the key field for our test
    price: {
      amount: 25000,
      currency: 'INR',
      negotiable: true
    },
    area: {
      size: 1200,
      unit: 'sqft'
    },
    location: {
      address: '123 Rental Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: {
        type: 'Point',
        coordinates: [72.8777, 19.0760]
      }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parking: true,
      furnished: 'semi-furnished',
      floor: {
        current: 3,
        total: 10
      }
    },
    amenities: ['gym', 'swimming pool', 'security'],
    images: [
      {
        url: '/image/2bhk-modern-apartment.jpg',
        alt: 'Living room'
      }
    ],
    owner: user._id,
    status: 'approved', // Approved so it can be shown
    available: true,
    featured: false
  });
  
  // Create a test sale property
  const saleProperty = new Property({
    title: 'Luxury Villa for Sale',
    description: 'A luxurious 4 bedroom villa for sale in an exclusive gated community.',
    type: 'villa',
    category: 'sale', // This is for sale
    price: {
      amount: 5000000,
      currency: 'INR',
      negotiable: true
    },
    area: {
      size: 3000,
      unit: 'sqft'
    },
    location: {
      address: '456 Sale Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      coordinates: {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
      }
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      parking: true,
      furnished: 'unfurnished',
      floor: {
        current: 1,
        total: 2
      }
    },
    amenities: ['garden', 'swimming pool', 'security', 'clubhouse'],
    images: [
      {
        url: '/image/4bhk-villa.jpg',
        alt: 'Villa exterior'
      }
    ],
    owner: user._id,
    status: 'approved', // Approved so it can be shown
    available: true,
    featured: true
  });
  
  try {
    // Save both properties
    await rentProperty.save();
    await saleProperty.save();
    
    console.log('Test properties created successfully:');
    console.log('- Rent property:', rentProperty.title, '(category:', rentProperty.category, ')');
    console.log('- Sale property:', saleProperty.title, '(category:', saleProperty.category, ')');
    
    // Verify counts
    const saleCount = await Property.countDocuments({ category: 'sale', status: 'approved' });
    const rentCount = await Property.countDocuments({ category: 'rent', status: 'approved' });
    
    console.log('\nProperty counts:');
    console.log('- Approved sale properties:', saleCount);
    console.log('- Approved rent properties:', rentCount);
    
  } catch (error) {
    console.error('Error creating test properties:', error);
  }
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});