const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB using the same connection as server
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eazyproperty';
console.log('Connecting to MongoDB with URI:', mongoUri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Find the existing admin user
    const adminEmail = 'sannikumargupta43@gmail.com';
    const newPassword = 'sanni@123';
    
    console.log('Looking for admin user with email:', adminEmail);
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Found existing admin user:');
      console.log('- ID:', existingAdmin._id);
      console.log('- Name:', existingAdmin.name);
      console.log('- Email:', existingAdmin.email);
      console.log('- Role:', existingAdmin.role);
      console.log('- Active:', existingAdmin.isActive);
      
      console.log('\n🔄 Updating password...');
      
      // Update password - this will trigger the pre-save middleware to hash it
      existingAdmin.password = newPassword;
      existingAdmin.role = 'admin'; // Ensure admin role
      existingAdmin.isActive = true; // Ensure active
      existingAdmin.isVerified = true; // Ensure verified
      
      await existingAdmin.save();
      
      console.log('✅ Password updated successfully!');
      console.log('\n🎉 Admin user is ready!');
      console.log('\nYou can now login to the admin panel with:');
      console.log('📧 Email: sannikumargupta43@gmail.com');
      console.log('🔐 Password: sanni@123');
      console.log('\n👉 Visit: http://localhost:3000/admin-login');
      
    } else {
      console.log('❌ No admin user found with that email');
      console.log('Creating new admin user...');
      
      // Create new admin user
      const adminUser = new User({
        name: 'Sanni Kumar Gupta',
        email: adminEmail,
        password: newPassword,
        role: 'admin',
        phone: '9876543210',
        isVerified: true,
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ New admin user created successfully!');
      console.log('\nYou can now login to the admin panel with:');
      console.log('📧 Email: sannikumargupta43@gmail.com');
      console.log('🔐 Password: sanni@123');
      console.log('\n👉 Visit: http://localhost:3000/admin-login');
    }
    
  } catch (error) {
    console.error('❌ Error updating admin user:', error);
    
    if (error.name === 'ValidationError') {
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