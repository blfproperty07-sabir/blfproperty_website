const express = require("express");
const router = express.Router();
const controller = require("./contact.controller");

router.post("/submit", controller.submit);
router.get("/types", controller.types);
router.get("/status/:id", controller.status);

module.exports = router;
