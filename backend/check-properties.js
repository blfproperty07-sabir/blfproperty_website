const mongoose = require('mongoose');
const Property = require('./models/Property');

mongoose.connect('mongodb://localhost:27017/eazy-property', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check all properties and their categories
  const properties = await Property.find({}).select('title category status');
  console.log('All properties:');
  properties.forEach(p => {
    console.log(`- ${p.title} (category: ${p.category}, status: ${p.status})`);
  });
  
  // Count by category
  const saleProperties = await Property.countDocuments({ category: 'sale' });
  const rentProperties = await Property.countDocuments({ category: 'rent' });
  
  console.log(`\nCounts:`);
  console.log(`- Sale properties: ${saleProperties}`);
  console.log(`- Rent properties: ${rentProperties}`);
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});