const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function publicUser(user) {
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
    hasPassword: Boolean(user.password)
  };
}

function createSession(user, loginMethod = "password") {
  const secret = process.env.JWT_SECRET;
  if (!secret) fail("JWT_SECRET is missing in backend .env", 500);

  const token = jwt.sign(
    { sub: String(user._id), role: user.role, type: "access", loginMethod },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const refreshToken = jwt.sign(
    { sub: String(user._id), type: "refresh", loginMethod },
    process.env.JWT_REFRESH_SECRET || secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
  );

  return { user: publicUser(user), token, refreshToken };
}

async function register(data) {
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const phone = String(data.phone || "").trim();
  const role = data.role || "buyer";

  if (name.length < 2 || name.length > 50) fail("Name must be 2 to 50 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Enter a valid email address.");
  if (password.length < 6) fail("Password must contain at least 6 characters.");
  if (phone && !/^\d{10}$/.test(phone)) fail("Phone number must contain 10 digits.");
  if (!["buyer", "seller"].includes(role)) fail("Invalid account type.");

  if (await User.findOne({ email })) {
    fail("An account with this email already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      authProvider: "local",
      emailVerified: false
    });

    return { user: publicUser(user) };
  } catch (error) {
    if (error.code === 11000) fail("An account with this email already exists.", 409);
    throw error;
  }
}

async function login(data) {
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");

  if (!email || !password) fail("Email and password are required.");

  const user = await User.findOne({ email }).select("+password");

  if (!user) fail("Invalid email or password.", 401);

  if (!user.password) {
    fail("This account uses Google sign-in. Please continue with Google.", 401);
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) fail("Invalid email or password.", 401);

  return createSession(user, "password");
}

async function googleLogin(data) {
  const credential = data.credential;
  if (!credential) fail("Google credential is required.");

  if (!process.env.GOOGLE_CLIENT_ID) {
    fail("GOOGLE_CLIENT_ID is missing in backend .env.", 500);
  }

  let response;
  let google;

  try {
    response = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" +
      encodeURIComponent(credential)
    );

    if (!response.ok) fail("Google sign-in verification failed.", 401);
    google = await response.json();
  } catch (error) {
    if (error.status) throw error;
    fail("Could not verify Google sign-in. Please try again.", 502);
  }

  if (google.aud !== process.env.GOOGLE_CLIENT_ID) {
    fail("Google client ID does not match.", 401);
  }

  if (google.email_verified !== "true" && google.email_verified !== true) {
    fail("Please use a verified Google email address.", 401);
  }

  const email = String(google.email || "").trim().toLowerCase();
  if (!email || !google.sub) fail("Google account information is incomplete.", 401);

  let user = await User.findOne({
    $or: [{ googleId: google.sub }, { email }]
  }).select("+password");

  if (user) {
    if (user.googleId && user.googleId !== google.sub) {
      fail("This email is linked to another Google account.", 409);
    }

    if (!user.googleId) user.googleId = google.sub;
    if (!user.avatar && google.picture) user.avatar = google.picture;
    user.emailVerified = true;
    await user.save();
  } else {
    const requestedRole = ["buyer", "seller"].includes(data.role)
      ? data.role
      : "buyer";

    user = await User.create({
      name: google.name || email.split("@")[0],
      email,
      googleId: google.sub,
      avatar: google.picture || "",
      role: requestedRole,
      authProvider: "google",
      emailVerified: true
    });
  }

  return createSession(user, "google");
}

async function refresh(data) {
  const refreshToken = data.refreshToken;
  if (!refreshToken) fail("Refresh token is required.", 401);

  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  let decoded;

  try {
    decoded = jwt.verify(refreshToken, secret);
  } catch {
    fail("Session expired. Please log in again.", 401);
  }

  if (decoded.type !== "refresh") fail("Invalid refresh token.", 401);

  const user = await User.findById(decoded.sub);
  if (!user) fail("User account not found.", 401);

  return createSession(user, decoded.loginMethod || "password");
}


async function changePassword(userId, data, loginMethod = "password") {
  const user = await User.findById(userId).select("+password");
  if (!user) fail("User account not found.", 404);

  const newPassword = String(data.newPassword || "");
  const confirmPassword = String(data.confirmPassword || "");
  const currentPassword = String(data.currentPassword || "");

  if (newPassword.length < 6) {
    fail("New password must contain at least 6 characters.");
  }
  if (newPassword !== confirmPassword) {
    fail("New password and confirmation do not match.");
  }

  if (loginMethod !== "google") {
    if (!user.password) {
      fail("This account has no password set. Please sign in with Google to set one.", 400);
    }
    if (!currentPassword) {
      fail("Current password is required.");
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      fail("Current password is incorrect.", 401);
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      fail("New password must be different from the current password.");
    }
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return { user: publicUser(user) };
}
module.exports = { register, login, googleLogin, refresh, changePassword };






