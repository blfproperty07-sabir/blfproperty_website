const express = require("express");
const controller = require("./auth.controller");
const authenticate = require("../../common/middleware/authenticate");
const {
  registerValidation,
  loginValidation,
  googleLoginValidation
} = require("./auth.validation");

const router = express.Router();

router.post("/register", ...registerValidation, controller.register);
router.post("/login", ...loginValidation, controller.login);
router.post("/google", ...googleLoginValidation, controller.googleLogin);

router.post("/refresh", controller.refresh);
router.post("/refresh-token", controller.refresh);

router.get("/profile", authenticate, controller.profile);
router.put("/profile", authenticate, controller.updateProfile);
router.put("/change-password", authenticate, controller.changePassword);
router.post("/logout", controller.logout);

module.exports = router;
