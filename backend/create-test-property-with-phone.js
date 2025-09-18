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
  let user = await User.findOne({ role: 'seller' });
  
  if (!user) {
    // Create a test user with phone number
    user = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210', // This phone number should show in admin panel
      password: 'password123',
      role: 'seller',
      isVerified: true
    });
    await user.save();
    console.log('Created test user with phone:', user.phone);
  }
  
  console.log('Using user:', user.name, 'Phone:', user.phone);
  
  // Create a test property that will be pending for admin approval
  const testProperty = new Property({
    title: 'Test Property for Admin Review',
    description: 'This property is for testing the admin panel phone number display.',
    type: 'apartment',
    category: 'sale',
    price: {
      amount: 1500000,
      currency: 'INR',
      negotiable: true
    },
    area: {
      size: 1000,
      unit: 'sqft'
    },
    location: {
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      coordinates: {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
      }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parking: true,
      furnished: 'semi-furnished',
      floor: {
        current: 5,
        total: 10
      }
    },
    amenities: ['gym', 'parking'],
    images: [
      {
        url: '/image/2bhk-modern-apartment.jpg',
        alt: 'Test apartment'
      }
    ],
    owner: user._id,
    status: 'pending', // This will show in admin panel for approval
    available: true,
    featured: false
  });
  
  try {
    await testProperty.save();
    console.log('Test property created successfully:');
    console.log('- Title:', testProperty.title);
    console.log('- Status:', testProperty.status);
    console.log('- Owner:', user.name);
    console.log('- Owner Phone:', user.phone);
    console.log('\nThis property should now appear in the admin panel with the phone number:', user.phone);
    
  } catch (error) {
    console.error('Error creating test property:', error);
  }
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});