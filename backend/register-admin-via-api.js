const fetch = require('node-fetch');

async function registerAdmin() {
  try {
    const adminData = {
      name: 'Sanni Kumar Gupta',
      email: 'sannikumargupta43@gmail.com',
      password: 'sanni@123',
      phone: '9876543210'
    };

    console.log('🚀 Registering admin user via API...');
    console.log('📧 Email:', adminData.email);
    console.log('🔐 Password:', adminData.password);
    
    const response = await fetch('http://localhost:5000/api/auth/register-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    const result = await response.json();
    
    console.log('\n=== API Response ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Admin user created/updated successfully!');
      console.log('👤 User ID:', result.data.user._id);
      console.log('👤 Name:', result.data.user.name);
      console.log('📧 Email:', result.data.user.email);
      console.log('🔒 Role:', result.data.user.role);
      console.log('✔️ Active:', result.data.user.isActive);
      
      console.log('\n🎉 You can now login to the admin panel!');
      console.log('🌐 Admin Login URL: http://localhost:3000/admin-login');
      console.log('📧 Email: sannikumargupta43@gmail.com');
      console.log('🔐 Password: sanni@123');
    } else {
      console.log('\n❌ Failed to create admin user');
      console.log('Error:', result.message);
      if (result.errors) {
        console.log('Validation errors:', result.errors);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error calling API:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 5000');
    console.log('Run: node server.js from the backend directory');
  }
}

// Run the registration
registerAdmin();