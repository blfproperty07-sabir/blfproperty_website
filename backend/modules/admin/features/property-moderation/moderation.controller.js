const service = require("./moderation.service");
const { asyncHandler } = require("../../admin.controller");

const list = asyncHandler(async (req, res) => {
  const properties = await service.listProperties(req.query);

  return res.json({
    success: true,
    data: { properties }
  });
});

const approve = asyncHandler(async (req, res) => {
  const property = await service.approveProperty(
    req.params.id,
    req.user._id
  );

  return res.json({
    success: true,
    message: "Property approved successfully.",
    data: { property }
  });
});

const reject = asyncHandler(async (req, res) => {
  const property = await service.rejectProperty(req.params.id);

  return res.json({
    success: true,
    message: "Property rejected successfully.",
    data: { property }
  });
});

const remove = asyncHandler(async (req, res) => {
  await service.deleteProperty(req.params.id);

  return res.json({
    success: true,
    message: "Property deleted successfully."
  });
});

const createRental = asyncHandler(async (req, res) => {
  const property = await service.createRentalProperty(
    req.body,
    req.files,
    req.user
  );

  return res.status(201).json({
    success: true,
    message: "Rental property created successfully.",
    data: { property }
  });
});

module.exports = {
  list,
  approve,
  reject,
  remove,
  createRental
};
