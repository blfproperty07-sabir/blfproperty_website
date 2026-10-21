const path = require("path");
const mongoose = require("mongoose");
const GalleryImage = require("./gallery.model");
const cloudinaryService = require("../../common/services/cloudinary.service");

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function makeTitle(filename) {
  const base = path.parse(String(filename || "Gallery image")).name;
  const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return (cleaned || "Gallery image").slice(0, 150);
}

async function listPublicImages() {
  return GalleryImage.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
}

async function uploadImages(files) {
  if (!Array.isArray(files) || files.length === 0) {
    throw fail("Choose at least one image to upload.");
  }
  if (files.length > 10) {
    throw fail("Upload no more than 10 images at a time.");
  }

  const assets = [];
  try {
    for (const file of files) {
      if (!file || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
        throw fail("One of the uploaded files is empty or invalid.");
      }
      const asset = await cloudinaryService.uploadImage(file.buffer, {
        folder: "eazy-property-solution/gallery",
      });
      assets.push({ file, asset });
    }

    const records = assets.map(({ file, asset }) => ({
      title: makeTitle(file.originalname),
      alt: makeTitle(file.originalname),
      imageUrl: asset.url,
      publicId: asset.publicId,
      width: asset.width,
      height: asset.height,
      format: asset.format,
      bytes: asset.bytes,
      isActive: true,
    }));

    return await GalleryImage.insertMany(records, { ordered: true });
  } catch (error) {
    await Promise.allSettled(assets.map(({ asset }) => cloudinaryService.deleteImage(asset.publicId)));
    throw error;
  }
}

async function deleteImage(imageId) {
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw fail("Invalid gallery image ID.");
  }

  const image = await GalleryImage.findById(imageId);
  if (!image) throw fail("Gallery image not found.", 404);

  if (image.publicId) {
    await cloudinaryService.deleteImage(image.publicId);
  }
  await image.deleteOne();
  return true;
}

module.exports = { listPublicImages, uploadImages, deleteImage };