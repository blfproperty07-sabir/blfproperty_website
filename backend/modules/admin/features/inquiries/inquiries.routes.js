const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../../admin.middleware");
const controller = require("./inquiries.controller");

router.use(authenticate, requireAdmin);

router.get("/inquiries", controller.list);
router.put("/inquiries/:id", controller.update);
router.patch("/inquiries/:id/status", controller.updateStatus);
router.delete("/inquiries/:id", controller.remove);

module.exports = router;
