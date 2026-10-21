const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../admin/admin.middleware");
const upload = require("../../common/middleware/upload");
const controller = require("./gallery.controller");

// Homepage gallery is public; managing gallery images requires an authenticated admin.
router.get("/", controller.listPublic);
router.post("/", authenticate, requireAdmin, upload.array("images", 10), controller.upload);
router.delete("/:id", authenticate, requireAdmin, controller.remove);

module.exports = router;