const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eazy-property', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Admin user details from the screenshot
    const adminData = {
      name: 'Sanni Kumar Gupta',
      email: 'sannikumargupta43@gmail.com',
      password: 'sanni@123',
      role: 'admin',
      phone: '9876543210', // Optional phone number
      isVerified: true,
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists with this email!');
      console.log('Existing user details:');
      console.log('- ID:', existingAdmin._id);
      console.log('- Name:', existingAdmin.name);
      console.log('- Email:', existingAdmin.email);
      console.log('- Role:', existingAdmin.role);
      console.log('- Active:', existingAdmin.isActive);
      
      // Update the existing user to ensure admin role
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.isActive = true;
        existingAdmin.isVerified = true;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      } else {
        console.log('✅ User already has admin role');
      }
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
      const adminUser = new User(adminData);
      await adminUser.save();
      
      console.log('✅ Admin user created successfully!');
      console.log('Admin details:');
      console.log('- ID:', adminUser._id);
      console.log('- Name:', adminUser.name);
      console.log('- Email:', adminUser.email);
      console.log('- Role:', adminUser.role);
      console.log('- Active:', adminUser.isActive);
    }
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('\nYou can now login to the admin panel with:');
    console.log('📧 Email: sannikumargupta43@gmail.com');
    console.log('🔐 Password: sanni@123');
    console.log('\n👉 Visit: http://localhost:3000/admin-login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 11000) {
      console.error('Duplicate key error - user already exists');
    } else if (error.name === 'ValidationError') {
      console.error('Validation error:', error.message);
    }
  }
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});