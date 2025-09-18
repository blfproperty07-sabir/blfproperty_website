// Test script to verify direct image URLs from the API response
const teamMembers = [
  {
    name: "as",
    profileImage: "/uploads/team/team-1758193054218-295047382.png"
  },
  {
    name: "niish", 
    profileImage: "/uploads/team/team-1758191451880-666928359.png"
  },
  {
    name: "sanni",
    profileImage: "/uploads/team/team-1758190954515-377205190.jpg"
  },
  {
    name: "chhotu",
    profileImage: "/uploads/team/team-1758190880436-514588334.jpg"
  }
];

console.log('=== TESTING IMAGE URLS ===');

teamMembers.forEach((member, index) => {
  const baseUrl = 'http://localhost:5000';
  const fullImageUrl = `${baseUrl}${member.profileImage}?v=${Date.now()}`;
  
  console.log(`Member ${index + 1}: ${member.name}`);
  console.log(`  Profile Image Path: ${member.profileImage}`);
  console.log(`  Full Image URL: ${fullImageUrl}`);
  console.log('---');
});

console.log('===========================');

// Test with Node.js HTTP client
const http = require('http');

function testImageUrl(url, memberName) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      console.log(`✅ ${memberName}: Status ${res.statusCode}, Content-Type: ${res.headers['content-type']}`);
      resolve({ status: res.statusCode, contentType: res.headers['content-type'] });
    });
    
    req.on('error', (error) => {
      console.error(`❌ ${memberName}: Error - ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.error(`❌ ${memberName}: Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Test all image URLs
async function testAllImages() {
  console.log('\n=== TESTING IMAGE ACCESSIBILITY ===');
  
  for (const member of teamMembers) {
    const imageUrl = `http://localhost:5000${member.profileImage}`;
    try {
      await testImageUrl(imageUrl, member.name);
    } catch (error) {
      // Error already logged in testImageUrl
    }
  }
  
  console.log('=====================================');
}

testAllImages();