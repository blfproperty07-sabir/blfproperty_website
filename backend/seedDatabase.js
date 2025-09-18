const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Property = require('./models/Property');
const TeamMember = require('./models/TeamMember');

// Sample properties data
const sampleProperties = [
  {
    title: "Luxury 2 BHK Modern Apartment",
    description: "Beautiful modern apartment with premium amenities, perfect for families. Features include modular kitchen, attached bathrooms, and balcony with garden view.",
    type: "apartment",
    category: "sale",
    price: {
      amount: 2500000,
      currency: "INR",
      negotiable: true
    },
    area: {
      size: 1200,
      unit: "sqft"
    },
    location: {
      address: "Electronic City Phase 1, Bangalore, Karnataka 560100",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560100",
      coordinates: {
        latitude: 12.8456,
        longitude: 77.6603
      },
      neighborhood: "Electronic City"
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      parking: 1,
      furnished: "semi-furnished",
      floor: {
        current: 5,
        total: 12
      },
      age: 2,
      facing: "north-east"
    },
    amenities: ["parking", "security", "gym", "swimming-pool", "garden"],
    images: [
      {
        url: "/image/2 BHK Modern Apartment.jpg",
        caption: "Living Room",
        isPrimary: true
      }
    ],
    status: "approved"
  },
  {
    title: "Spacious 3 BHK Luxury Flat",
    description: "Premium 3 BHK flat with excellent connectivity and modern amenities. Located in prime area with shopping malls, schools, and hospitals nearby.",
    type: "apartment",
    category: "sale",
    price: {
      amount: 4500000,
      currency: "INR",
      negotiable: true
    },
    area: {
      size: 1800,
      unit: "sqft"
    },
    location: {
      address: "Koramangala 4th Block, Bangalore, Karnataka 560034",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
      coordinates: {
        latitude: 12.9352,
        longitude: 77.6245
      },
      neighborhood: "Koramangala"
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      parking: 2,
      furnished: "fully-furnished",
      floor: {
        current: 8,
        total: 15
      },
      age: 1,
      facing: "south"
    },
    amenities: ["parking", "security", "gym", "swimming-pool", "club-house", "garden"],
    images: [
      {
        url: "/image/3 BHK Luxury Flat.jpg",
        caption: "Master Bedroom",
        isPrimary: true
      }
    ],
    status: "approved"
  },
  {
    title: "Budget-Friendly 2 BHK Flat",
    description: "Affordable 2 BHK flat perfect for first-time buyers. Well-ventilated rooms with good connectivity to IT hubs and public transportation.",
    type: "apartment",
    category: "sale",
    price: {
      amount: 1800000,
      currency: "INR",
      negotiable: true
    },
    area: {
      size: 950,
      unit: "sqft"
    },
    location: {
      address: "Whitefield Main Road, Bangalore, Karnataka 560066",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
      coordinates: {
        latitude: 12.9698,
        longitude: 77.7500
      },
      neighborhood: "Whitefield"
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      parking: 1,
      furnished: "unfurnished",
      floor: {
        current: 3,
        total: 8
      },
      age: 5,
      facing: "east"
    },
    amenities: ["parking", "security", "water-supply", "power-backup"],
    images: [
      {
        url: "/image/2 BHK Budget Flat.jpg",
        caption: "Living Area",
        isPrimary: true
      }
    ],
    status: "approved"
  },
  {
    title: "Magnificent 4 BHK Villa",
    description: "Luxurious independent villa with private garden and parking. Perfect for large families who value privacy and space. Premium location with excellent amenities.",
    type: "villa",
    category: "sale",
    price: {
      amount: 8500000,
      currency: "INR",
      negotiable: true
    },
    area: {
      size: 3200,
      unit: "sqft"
    },
    location: {
      address: "Sarjapur Road, Bangalore, Karnataka 560035",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560035",
      coordinates: {
        latitude: 12.9116,
        longitude: 77.6648
      },
      neighborhood: "Sarjapur Road"
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      balconies: 3,
      parking: 3,
      furnished: "semi-furnished",
      age: 0,
      facing: "north"
    },
    amenities: ["garden", "parking", "security", "swimming-pool", "gym", "club-house"],
    images: [
      {
        url: "/image/4 BHK Villa.jpg",
        caption: "Villa Exterior",
        isPrimary: true
      }
    ],
    status: "approved"
  },
  {
    title: "Elegant 5 BHK Independent House",
    description: "Spacious independent house with modern architecture and premium finishes. Features include large living areas, private garden, and rooftop terrace.",
    type: "house",
    category: "sale",
    price: {
      amount: 12000000,
      currency: "INR",
      negotiable: true
    },
    area: {
      size: 4500,
      unit: "sqft"
    },
    location: {
      address: "JP Nagar 7th Phase, Bangalore, Karnataka 560078",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560078",
      coordinates: {
        latitude: 12.9081,
        longitude: 77.5833
      },
      neighborhood: "JP Nagar"
    },
    features: {
      bedrooms: 5,
      bathrooms: 5,
      balconies: 4,
      parking: 4,
      furnished: "fully-furnished",
      age: 1,
      facing: "south-west"
    },
    amenities: ["garden", "parking", "security", "power-backup"],
    images: [
      {
        url: "/image/5 BHK Independent House.jpg",
        caption: "House Front View",
        isPrimary: true
      }
    ],
    status: "approved"
  },
  {
    title: "Prime Office Space",
    description: "Modern office space in prime business district with excellent connectivity. Perfect for startups and established businesses. Fully furnished with modern amenities.",
    type: "office",
    category: "rent",
    price: {
      amount: 65000,
      currency: "INR",
      negotiable: true
    },
    area: {
      size: 2200,
      unit: "sqft"
    },
    location: {
      address: "MG Road, Bangalore, Karnataka 560001",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946
      },
      neighborhood: "MG Road"
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      parking: 5,
      furnished: "fully-furnished",
      floor: {
        current: 10,
        total: 20
      },
      age: 3
    },
    amenities: ["parking", "security", "power-backup", "wifi", "elevator"],
    images: [
      {
        url: "/image/Office Space.avif",
        caption: "Office Interior",
        isPrimary: true
      }
    ],
    status: "approved"
  }
];

// Sample team members
const sampleTeamMembers = [
  {
    name: "Rajesh Kumar",
    position: "Senior Property Consultant",
    department: "sales",
    email: "rajesh@eazyproperty.com",
    phone: "9876543210",
    bio: "Experienced property consultant with over 8 years in real estate. Specializes in residential properties and customer relationship management.",
    profileImage: "/image/muz2.jpg",
    experience: {
      years: 8,
      specializations: ["Residential Properties", "Customer Relations"]
    },
    joiningDate: new Date('2020-03-15'),
    skills: ["Property Valuation", "Client Management", "Negotiation"],
    languages: ["English", "Hindi", "Kannada"],
    displayOrder: 1,
    showOnWebsite: true
  },
  {
    name: "Priya Sharma",
    position: "Sales Manager",
    department: "sales",
    email: "priya@eazyproperty.com",
    phone: "9876543211",
    bio: "Dynamic sales manager with expertise in luxury properties and commercial real estate. Known for exceptional customer service.",
    profileImage: "/image/muz3.jpg",
    experience: {
      years: 6,
      specializations: ["Luxury Properties", "Commercial Real Estate"]
    },
    joiningDate: new Date('2021-01-10'),
    skills: ["Team Management", "Sales Strategy", "Market Analysis"],
    languages: ["English", "Hindi"],
    displayOrder: 2,
    showOnWebsite: true
  },
  {
    name: "Amit Patel",
    position: "Marketing Head",
    department: "marketing",
    email: "amit@eazyproperty.com",
    phone: "9876543212",
    bio: "Creative marketing professional with deep understanding of digital marketing and property promotion strategies.",
    profileImage: "/image/muz4.jpg",
    experience: {
      years: 5,
      specializations: ["Digital Marketing", "Brand Strategy"]
    },
    joiningDate: new Date('2021-06-01'),
    skills: ["Digital Marketing", "Content Strategy", "Social Media"],
    languages: ["English", "Hindi", "Gujarati"],
    displayOrder: 3,
    showOnWebsite: true
  },
  {
    name: "Sunita Reddy",
    position: "Legal Advisor",
    department: "legal",
    email: "sunita@eazyproperty.com",
    phone: "9876543213",
    bio: "Legal expert specializing in property law and documentation. Ensures all transactions are legally compliant and secure.",
    profileImage: "/image/muz5.jpg",
    experience: {
      years: 10,
      specializations: ["Property Law", "Legal Documentation"]
    },
    joiningDate: new Date('2019-09-15'),
    skills: ["Legal Documentation", "Property Law", "Contract Review"],
    languages: ["English", "Hindi", "Telugu"],
    displayOrder: 4,
    showOnWebsite: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eazyproperty');
    console.log('Connected to MongoDB');

    // Create or update admin user
    let adminUser = await User.findOne({ email: 'sannikumargupta43@gmail.com' });
    if (!adminUser) {
      // Create new admin user (password will be hashed by the model middleware)
      adminUser = new User({
        name: 'Sanni Kumar Gupta',
        email: 'sannikumargupta43@gmail.com',
        password: 'sanni@123', // Raw password - will be hashed by pre-save middleware
        phone: '9876543210',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      await adminUser.save();
      console.log('Admin user created successfully!');
    } else {
      // Update existing admin user password (password will be hashed by the model middleware)
      adminUser.password = 'sanni@123'; // Raw password - will be hashed by pre-save middleware
      adminUser.role = 'admin';
      adminUser.isActive = true;
      await adminUser.save();
      console.log('Admin user updated successfully!');
    }

    // Clear existing sample data
    await Property.deleteMany({ title: { $in: sampleProperties.map(p => p.title) } });
    await TeamMember.deleteMany({ name: { $in: sampleTeamMembers.map(t => t.name) } });

    // Add sample properties
    for (const propertyData of sampleProperties) {
      const property = new Property({
        ...propertyData,
        owner: adminUser._id
      });
      await property.save();
    }

    // Add sample team members
    for (const teamData of sampleTeamMembers) {
      const teamMember = new TeamMember({
        ...teamData,
        addedBy: adminUser._id
      });
      await teamMember.save();
    }

    console.log('Sample data added successfully!');
    console.log(`Added ${sampleProperties.length} properties`);
    console.log(`Added ${sampleTeamMembers.length} team members`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();