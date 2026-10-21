const jwt = require("jsonwebtoken");
const User = require("../../modules/users/user.model");

async function authenticate(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to continue."
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing.");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token."
      });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found."
      });
    }

    req.user = user;
    req.authMethod = payload.loginMethod || "password";
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again."
    });
  }
}

module.exports = authenticate;



