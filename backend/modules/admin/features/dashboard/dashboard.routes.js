const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../../admin.middleware");
const controller = require("./dashboard.controller");

router.get("/dashboard", authenticate, requireAdmin, controller.getDashboard);

module.exports = router;
