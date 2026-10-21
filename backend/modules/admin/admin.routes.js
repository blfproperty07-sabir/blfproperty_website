const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./features/dashboard/dashboard.routes");
const moderationRoutes = require("./features/property-moderation/moderation.routes");
const teamRoutes = require("./features/team/team.routes");
const inquiryRoutes = require("./features/inquiries/inquiries.routes");

router.use("/", dashboardRoutes);
router.use("/", moderationRoutes);
router.use("/team", teamRoutes);
router.use("/", inquiryRoutes);

module.exports = router;
