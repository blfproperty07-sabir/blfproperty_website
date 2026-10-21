const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./features/dashboard/dashboard.routes");
const moderationRoutes = require("./features/property-moderation/moderation.routes");
const teamRoutes = require("./features/team/team.routes");

router.use("/", dashboardRoutes);
router.use("/", moderationRoutes);
router.use("/team", teamRoutes);

module.exports = router;
