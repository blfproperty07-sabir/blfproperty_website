const express = require("express");
const controller = require("./properties.controller");
const authenticate = require("../../../../common/middleware/authenticate");
const upload = require("../../../../common/middleware/upload");
const { validatePropertyPayload } = require("./properties.validation");

const router = express.Router();

router.get("/", controller.list);
router.get("/statistics", controller.statistics);
router.get("/user/my-properties", authenticate, controller.mine);
router.post("/search", controller.search);

router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  validatePropertyPayload,
  controller.create
);

router.get("/:id/analytics", authenticate, controller.analytics);
router.post("/:id/images", authenticate, upload.array("images", 10), controller.addImages);
router.delete("/:id/images/:imageId", authenticate, controller.removeImage);
router.put("/:id", authenticate, upload.array("images", 10), controller.update);
router.delete("/:id", authenticate, controller.remove);
router.get("/:id", controller.getById);

module.exports = router;
