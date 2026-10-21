const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: "INR" },
  negotiable: { type: Boolean, default: true }
}, { _id: false });

const areaSchema = new mongoose.Schema({
  size: { type: Number, required: true, min: 1 },
  unit: { type: String, default: "sqft" }
}, { _id: false });

const coordinatesSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number
}, { _id: false });

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  coordinates: { type: coordinatesSchema, default: undefined },
  landmark: { type: String, default: "" },
  neighborhood: { type: String, default: "" }
}, { _id: false });

const featuresSchema = new mongoose.Schema({
  bedrooms: { type: Number, default: 0, min: 0 },
  bathrooms: { type: Number, default: 0, min: 0 },
  balconies: { type: Number, default: 0, min: 0 },
  parking: { type: mongoose.Schema.Types.Mixed, default: 0 },
  furnished: {
    type: String,
    enum: ["fully-furnished", "furnished", "semi-furnished", "unfurnished"],
    default: "unfurnished"
  },
  floor: {
    current: mongoose.Schema.Types.Mixed,
    total: Number
  },
  age: mongoose.Schema.Types.Mixed,
  facing: {
    type: String,
    enum: [
      "north", "south", "east", "west",
      "north-east", "north-west", "south-east", "south-west", ""
    ],
    default: ""
  }
}, { _id: false });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: "" },
  caption: { type: String, default: "" },
  isPrimary: { type: Boolean, default: false },
  width: Number,
  height: Number,
  format: String,
  bytes: Number
});

const contactSchema = new mongoose.Schema({
  showOwnerDetails: { type: Boolean, default: true },
  preferredTime: { type: String, default: "" },
  additionalPhone: { type: String, default: "" },
  ownerName: { type: String, default: "" },
  ownerPhone: { type: String, default: "" },
  ownerEmail: { type: String, default: "" }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  name: String,
  type: String,
  uploadedAt: Date
});

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 180 },
  description: { type: String, required: true, trim: true, minlength: 10 },
  type: {
    type: String,
    required: true,
    enum: ["apartment", "house", "villa", "plot", "commercial", "office", "shop", "warehouse"]
  },
  category: { type: String, required: true, enum: ["sale", "rent", "lease"] },
  deposit: { type: Number, min: 0, default: 0 },
  price: { type: priceSchema, required: true },
  area: { type: areaSchema, required: true },
  location: { type: locationSchema, required: true },
  features: { type: featuresSchema, default: () => ({}) },
  amenities: { type: [String], default: [] },
  images: {
    type: [imageSchema],
    validate: [items => items.length >= 1, "At least one image is required."]
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contact: { type: contactSchema, default: () => ({}) },
  documents: { type: [documentSchema], default: [] },
  interested: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0, min: 0 },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

propertySchema.index({ status: 1, category: 1, type: 1, createdAt: -1 });
propertySchema.index({ "location.city": 1, status: 1 });
propertySchema.index({ "price.amount": 1, status: 1 });

module.exports =
  mongoose.models.Property || mongoose.model("Property", propertySchema);
