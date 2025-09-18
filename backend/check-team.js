const TeamMember = require('./models/TeamMember');
const mongoose = require('mongoose');

async function checkTeamMembers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/eazyproperty');
    console.log('Connected to database');
    
    const members = await TeamMember.find().limit(10);
    console.log('\n=== Team Members and Profile Images ===');
    
    members.forEach(member => {
      console.log(`Name: ${member.name}`);
      console.log(`ProfileImage: ${member.profileImage}`);
      console.log(`Created: ${member.createdAt}`);
      console.log('---');
    });
    
    await mongoose.disconnect();
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTeamMembers();