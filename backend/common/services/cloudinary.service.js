const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

function isConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

function uploadImage(buffer) {
  if (!isConfigured()) {
    const error = new Error("Cloudinary configuration missing in backend/.env.");
    error.status = 503;
    return Promise.reject(error);
  }

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const error = new Error("Invalid or empty image.");
    error.status = 400;
    return Promise.reject(error);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: "eazy-property-solution/properties",
      resource_type: "image",
      unique_filename: true,
      overwrite: false
    }, (error, result) => {
      if (error) return reject(error);

      if (!result || !result.secure_url || !result.public_id) {
        return reject(new Error("Cloudinary image URL was not returned."));
      }

      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      });
    });

    Readable.from([buffer]).pipe(stream);
  });
}

async function deleteImage(publicId) {
  if (!publicId || !isConfigured()) return null;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true
  });
}

module.exports = { cloudinary, isConfigured, uploadImage, deleteImage };
