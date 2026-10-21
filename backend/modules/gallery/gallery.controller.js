const service = require("./gallery.service");

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const listPublic = asyncHandler(async (_req, res) => {
  const images = await service.listPublicImages();
  res.json({ success: true, data: { images } });
});

const upload = asyncHandler(async (req, res) => {
  const images = await service.uploadImages(req.files || []);
  res.status(201).json({
    success: true,
    message: `Uploaded ${images.length} gallery image(s).`,
    data: { images },
  });
});

const remove = asyncHandler(async (req, res) => {
  await service.deleteImage(req.params.id);
  res.json({ success: true, message: "Gallery image deleted successfully." });
});

module.exports = { listPublic, upload, remove };