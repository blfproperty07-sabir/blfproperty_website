const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../../admin.middleware");
const controller = require("./moderation.controller");
const rentalUpload = require("./rental-upload.middleware");
const normalizeRentalForm = require("./rental-form.middleware");
const { validatePropertyPayload } = require("../../../seller/features/properties/properties.validation");

router.get("/properties", authenticate, requireAdmin, controller.list);

router.patch(
  "/properties/:id/approve",
  authenticate,
  requireAdmin,
  controller.approve
);

router.patch(
  "/properties/:id/reject",
  authenticate,
  requireAdmin,
  controller.reject
);

router.delete(
  "/properties/:id",
  authenticate,
  requireAdmin,
  controller.remove
);

router.post(
  "/properties",
  authenticate,
  requireAdmin,
  rentalUpload.array("images", 10),
  normalizeRentalForm,
  validatePropertyPayload,
  controller.createRental
);

module.exports = router;
