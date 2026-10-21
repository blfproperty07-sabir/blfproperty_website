const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    alt: { type: String, trim: true, maxlength: 200, default: "" },
    imageUrl: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

galleryImageSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

module.exports = mongoose.models.GalleryImage || mongoose.model("GalleryImage", galleryImageSchema);