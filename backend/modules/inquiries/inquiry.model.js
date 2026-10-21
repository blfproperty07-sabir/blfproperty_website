const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, default: "", maxlength: 40 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 10000 },
    type: {
      type: String,
      enum: ["general", "property-inquiry", "selling-inquiry", "support"],
      default: "general"
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new"
    },
    response: { type: String, default: "", maxlength: 10000 }
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });

module.exports =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
