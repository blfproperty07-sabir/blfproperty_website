const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();

app.disable("x-powered-by");
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300
}));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Property API running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/config/google-auth", (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID || ""
  });
});


app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/contact", require("./modules/contact/contact.routes"));

app.put(
  "/api/auth/change-password",
  require("./common/middleware/authenticate"),
  require("./modules/auth/auth.controller").changePassword
);
app.get("/api/auth/profile", require("./common/middleware/authenticate"), require("./modules/auth/auth.controller").profile);
app.put("/api/auth/profile", require("./common/middleware/authenticate"), require("./modules/auth/auth.controller").updateProfile);

app.use("/api/admin", require("./modules/admin/admin.routes"));
app.use("/api/team", require("./modules/admin/features/team/team.routes"));

app.use("/api/properties", require("./modules/seller/features/properties/properties.routes"));

app.use("/api/gallery", require("./modules/gallery/gallery.routes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Request failed."
      : err.message
  });
});

module.exports = app;







