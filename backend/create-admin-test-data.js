const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/eazy-property', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Find or create test users
  let seller1 = await User.findOne({ email: 'seller1@test.com' });
  if (!seller1) {
    seller1 = new User({
      name: 'John Seller',
      email: 'seller1@test.com',
      phone: '+91-9876543210',
      password: 'password123',
      role: 'seller',
      isVerified: true
    });
    await seller1.save();
  }

  let seller2 = await User.findOne({ email: 'seller2@test.com' });
  if (!seller2) {
    seller2 = new User({
      name: 'Jane Property Owner',
      email: 'seller2@test.com',
      phone: '+91-9876543211',
      password: 'password123',
      role: 'seller',
      isVerified: true
    });
    await seller2.save();
  }
  
  // Create test properties with different statuses
  const testProperties = [
    {
      title: 'Pending Villa in Delhi',
      description: 'A beautiful villa waiting for admin approval.',
      type: 'villa',
      category: 'sale',
      price: { amount: 8500000, currency: 'INR', negotiable: true },
      area: { size: 2500, unit: 'sqft' },
      location: {
        address: '123 Pending Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      features: {
        bedrooms: 4,
        bathrooms: 3,
        parking: true,
        furnished: 'semi-furnished',
        floor: { current: 1, total: 2 }
      },
      amenities: ['garden', 'parking'],
      images: [{ url: '/image/4bhk-villa.jpg', alt: 'Villa' }],
      owner: seller1._id,
      status: 'pending',
      available: true
    },
    {
      title: 'Approved Apartment in Mumbai',
      description: 'An approved apartment ready for buyers.',
      type: 'apartment',
      category: 'sale',
      price: { amount: 3500000, currency: 'INR', negotiable: true },
      area: { size: 1200, unit: 'sqft' },
      location: {
        address: '456 Approved Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        parking: true,
        furnished: 'furnished',
        floor: { current: 5, total: 10 }
      },
      amenities: ['gym', 'swimming pool'],
      images: [{ url: '/image/2bhk-modern-apartment.jpg', alt: 'Apartment' }],
      owner: seller2._id,
      status: 'approved',
      available: true
    },
    {
      title: 'Luxury House in Bangalore',
      description: 'A luxury house that has been approved and is live.',
      type: 'house',
      category: 'sale',
      price: { amount: 6500000, currency: 'INR', negotiable: false },
      area: { size: 2000, unit: 'sqft' },
      location: {
        address: '789 Luxury Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      features: {
        bedrooms: 3,
        bathrooms: 3,
        parking: true,
        furnished: 'unfurnished',
        floor: { current: 1, total: 1 }
      },
      amenities: ['garden', 'security', 'clubhouse'],
      images: [{ url: '/image/5bhk-independent-house.jpg', alt: 'House' }],
      owner: seller1._id,
      status: 'approved',
      available: true,
      featured: true
    }
  ];
  
  try {
    // Clear existing test properties
    await Property.deleteMany({ 
      title: { 
        $in: ['Pending Villa in Delhi', 'Approved Apartment in Mumbai', 'Luxury House in Bangalore'] 
      } 
    });
    
    // Create new test properties
    for (const propertyData of testProperties) {
      const property = new Property(propertyData);
      await property.save();
      console.log(`Created: ${property.title} (Status: ${property.status})`);
    }
    
    // Display summary
    const pendingCount = await Property.countDocuments({ status: 'pending' });
    const approvedCount = await Property.countDocuments({ status: 'approved' });
    const totalCount = await Property.countDocuments({});
    
    console.log('\n=== Property Summary ===');
    console.log(`Pending Properties: ${pendingCount}`);
    console.log(`Approved Properties: ${approvedCount}`);
    console.log(`Total Properties: ${totalCount}`);
    console.log('\nNow you can test the admin panel:');
    console.log('1. Go to Properties tab');
    console.log('2. Check "Pending Properties" sub-tab for approval');
    console.log('3. Check "All Properties" sub-tab to see all properties and delete sold ones');
    
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