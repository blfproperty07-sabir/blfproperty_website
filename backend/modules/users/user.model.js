const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  googleId: { type: String, sparse: true, unique: true },
  avatar: { type: String, default: "" },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  emailVerified: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
