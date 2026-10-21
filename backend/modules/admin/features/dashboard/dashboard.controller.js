const service = require("./dashboard.service");
const { asyncHandler } = require("../../admin.controller");

const getDashboard = asyncHandler(async (req, res) => {
  const overview = await service.getOverview();

  return res.json({
    success: true,
    data: { overview }
  });
});

module.exports = { getDashboard };
