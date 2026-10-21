const { body, validationResult } = require("express-validator");

function errors(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Please check the registration details.",
      errors: result.array()
    });
  }
  next();
}

const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be 2 to 50 characters."),
  body("email").trim().isEmail().withMessage("Enter a valid email address."),
  body("password").isLength({ min: 6 }).withMessage("Password must contain at least 6 characters."),
  body("phone").optional({ checkFalsy: true }).matches(/^\d{10}$/).withMessage("Phone number must contain 10 digits."),
  body("role").optional().isIn(["buyer", "seller"]).withMessage("Invalid account type."),
  errors
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Enter a valid email address."),
  body("password").notEmpty().withMessage("Password is required."),
  errors
];

const googleLoginValidation = [
  body("credential").notEmpty().withMessage("Google credential is required."),
  errors
];

module.exports = { registerValidation, loginValidation, googleLoginValidation };
