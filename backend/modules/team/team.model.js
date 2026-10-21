const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  position: { type: String, required: true, trim: true, maxlength: 120 },
  department: {
    type: String,
    required: true,
    enum: ["management", "sales", "marketing", "construction", "legal", "finance", "hr", "support"]
  },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  joiningDate: { type: Date, default: Date.now },
  profileImage: { type: String, default: "" },
  profileImagePublicId: { type: String, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  userRole: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
  showOnWebsite: { type: Boolean, default: true },
  isBoss: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

teamMemberSchema.index({ isActive: 1, showOnWebsite: 1, department: 1 });

module.exports =
  mongoose.models.TeamMember ||
  mongoose.model("TeamMember", teamMemberSchema);
