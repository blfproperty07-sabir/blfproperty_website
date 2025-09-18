// Simple script to test the team API and see the exact response
const https = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/team/about',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('=== TEAM API RESPONSE ===');
      console.log('Success:', jsonData.success);
      console.log('Boss:', jsonData.data.boss);
      console.log('Team Members Count:', jsonData.data.teamMembers.length);
      
      jsonData.data.teamMembers.forEach((member, index) => {
        console.log(`\nMember ${index + 1}:`);
        console.log(`  Name: ${member.name}`);
        console.log(`  Position: ${member.position}`);
        console.log(`  Email: ${member.email}`);
        console.log(`  ProfileImage: ${member.profileImage}`);
        console.log(`  isActive: ${member.isActive}`);
        console.log(`  showOnWebsite: ${member.showOnWebsite}`);
      });
      console.log('========================');
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();