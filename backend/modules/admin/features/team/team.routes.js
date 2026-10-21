const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../../admin.middleware");
const upload = require("../../../../common/middleware/upload");
const controller = require("./team.controller");

function protectShowAll(req, res, next) {
  if (String(req.query.showAll).toLowerCase() !== "true") return next();
  return authenticate(req, res, () => requireAdmin(req, res, next));
}

// Specific routes before /:id
router.get("/about", controller.about);
router.get("/active", controller.active);
router.get("/statistics", authenticate, requireAdmin, controller.statistics);
router.get("/search", controller.search);
router.get("/department/:department", controller.byDepartment);
router.get("/", protectShowAll, controller.list);
router.get("/:id", controller.getById);

router.post("/", authenticate, requireAdmin, upload.single("profileImage"), controller.create);
router.put("/:id", authenticate, requireAdmin, upload.single("profileImage"), controller.update);
router.delete("/:id", authenticate, requireAdmin, controller.remove);
router.patch("/:id/toggle-status", authenticate, requireAdmin, controller.toggleStatus);

module.exports = router;
