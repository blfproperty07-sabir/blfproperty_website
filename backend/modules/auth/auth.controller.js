const authService = require("./auth.service");
const User = require("../users/user.model");

function safeUser(user) {
  return {
    _id: String(user._id),
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    avatar: user.avatar || "",
    emailVerified: Boolean(user.emailVerified),
    authProvider: user.authProvider,
    hasPassword: Boolean(user.password),
    createdAt: user.createdAt
  };
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Registration successful. Please log in.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      message: "Login successful.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function googleLogin(req, res, next) {
  try {
    const result = await authService.googleLogin(req.body);
    res.json({
      success: true,
      message: "Google sign-in successful.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body);
    res.json({
      success: true,
      message: "Session refreshed.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function profile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    res.json({
      success: true,
      data: { user: safeUser(user) }
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    if (req.body.name !== undefined) {
      const name = String(req.body.name).trim();

      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name must be 2 to 50 characters."
        });
      }

      user.name = name;
    }

    if (req.body.phone !== undefined) {
      const phone = String(req.body.phone || "").trim();

      if (phone && !/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must contain 10 digits."
        });
      }

      user.phone = phone;
    }

    if (req.body.role !== undefined && user.role !== "admin") {
      if (!["buyer", "seller"].includes(req.body.role)) {
        return res.status(400).json({
          success: false,
          message: "Account type must be buyer or seller."
        });
      }

      user.role = req.body.role;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: { user: safeUser(user) }
    });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const result = await authService.changePassword(
      req.user._id,
      req.body,
      req.authMethod
    );

    res.json({
      success: true,
      message: "Password updated successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.json({
    success: true,
    message: "Logged out successfully."
  });
}

module.exports = {
  register,
  login,
  googleLogin,
  refresh,
  profile,
  updateProfile,
  changePassword,
  logout
};
