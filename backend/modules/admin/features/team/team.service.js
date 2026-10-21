const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const TeamMember = require("../../../team/team.model");
const User = require("../../../users/user.model");
const cloudinaryService = require("../../../../common/services/cloudinary.service");

function fail(message, status = 400, code) {
  const error = new Error(message);
  error.status = status;
  if (code) error.code = code;
  return error;
}

function validId(id) {
  if (!mongoose.isValidObjectId(id)) throw fail("Invalid team member ID.", 400);
}

function parseBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  return !["false", "0", "no"].includes(String(value).toLowerCase());
}

function safeMemberQuery(query = {}) {
  const showAll = String(query.showAll).toLowerCase() === "true";
  if (showAll) return {};

  return { isActive: true, showOnWebsite: true };
}

async function uploadProfileImage(file) {
  if (!file) return { url: "", publicId: "" };

  const uploaded = await cloudinaryService.uploadImage(
    file.buffer,
    "eazy-property-solution/team"
  );

  return {
    url: uploaded?.secure_url || uploaded?.url || uploaded?.data?.secure_url || "",
    publicId: uploaded?.public_id || uploaded?.publicId || uploaded?.data?.public_id || ""
  };
}

async function cleanupImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinaryService.deleteImage(publicId);
  } catch (error) {
    console.error("Team image cleanup failed:", error.message);
  }
}

async function listTeamMembers(query = {}) {
  const filter = safeMemberQuery(query);
  const members = await TeamMember.find(filter)
    .sort({ isBoss: -1, createdAt: -1 })
    .populate("user", "name email role");

  return {
    teamMembers: members,
    boss: members.find(member => member.isBoss) || null
  };
}

async function getTeamMemberById(id) {
  validId(id);
  const member = await TeamMember.findById(id).populate("user", "name email role");
  if (!member) throw fail("Team member not found.", 404);
  return member;
}

async function createTeamMember(input, file, adminUser) {
  const name = String(input.name || "").trim();
  const position = String(input.position || "").trim();
  const department = String(input.department || "").trim().toLowerCase();
  const email = String(input.email || "").trim().toLowerCase();
  const phone = String(input.phone || "").trim();
  const password = String(input.password || "");
  const requestedRole = String(input.userRole || "user").toLowerCase();

  const departments = new Set([
    "management", "sales", "marketing", "construction",
    "legal", "finance", "hr", "support"
  ]);

  if (name.length < 2 || name.length > 100) throw fail("Name must be 2 to 100 characters.");
  if (!position) throw fail("Position is required.");
  if (!departments.has(department)) throw fail("Select a valid department.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail("Enter a valid email address.");
  if (!/^\d{10}$/.test(phone)) throw fail("Phone number must contain 10 digits.");
  if (password.length < 6) throw fail("Password must contain at least 6 characters.");
  if (!["user", "admin"].includes(requestedRole)) throw fail("Select a valid role.");

  if (await TeamMember.findOne({ email })) {
    throw fail("A team member with this email already exists.", 409, "DUPLICATE_TEAM_EMAIL");
  }
  if (await User.findOne({ email })) {
    throw fail("An account with this email already exists.", 409, "DUPLICATE_EMAIL");
  }

  let image = { url: "", publicId: "" };
  let createdUser = null;

  try {
    image = await uploadProfileImage(file);

    const hashedPassword = await bcrypt.hash(password, 12);

    // The User model supports buyer/seller/admin roles, not "user".
    // Keep "user" as the team UI role; map its login account to buyer.
    const accountRole = requestedRole === "admin" ? "admin" : "buyer";

    createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: accountRole,
      authProvider: "local",
      emailVerified: false
    });

    const member = await TeamMember.create({
      name,
      position,
      department,
      email,
      phone,
      joiningDate: input.joiningDate ? new Date(input.joiningDate) : new Date(),
      profileImage: image.url,
      profileImagePublicId: image.publicId,
      user: createdUser._id,
      userRole: requestedRole,
      showOnWebsite: parseBoolean(input.showOnWebsite, true),
      isActive: true,
      isBoss: false,
      createdBy: adminUser._id
    });

    await member.populate("user", "name email role");
    return member;
  } catch (error) {
    if (createdUser) {
      try { await User.findByIdAndDelete(createdUser._id); } catch {}
    }
    await cleanupImage(image.publicId);

    if (error.code === 11000) {
      throw fail("An account or team member with this email already exists.", 409, "DUPLICATE_EMAIL");
    }
    throw error;
  }
}

async function updateTeamMember(id, input, file) {
  validId(id);
  const member = await TeamMember.findById(id);
  if (!member) throw fail("Team member not found.", 404);

  for (const key of ["name", "position", "department", "phone"]) {
    if (input[key] !== undefined) member[key] = String(input[key]).trim();
  }

  if (input.showOnWebsite !== undefined) {
    member.showOnWebsite = parseBoolean(input.showOnWebsite);
  }
  if (input.isActive !== undefined) {
    member.isActive = parseBoolean(input.isActive);
  }

  if (file) {
    const image = await uploadProfileImage(file);
    const previousPublicId = member.profileImagePublicId;

    member.profileImage = image.url;
    member.profileImagePublicId = image.publicId;

    try {
      await member.save();
    } catch (error) {
      await cleanupImage(image.publicId);
      throw error;
    }

    await cleanupImage(previousPublicId);
    await member.populate("user", "name email role");
    return member;
  }

  await member.save();
  await member.populate("user", "name email role");
  return member;
}

async function deleteTeamMember(id) {
  validId(id);
  const member = await TeamMember.findByIdAndDelete(id);
  if (!member) throw fail("Team member not found.", 404);
  await cleanupImage(member.profileImagePublicId);
  return member;
}

async function toggleTeamMemberStatus(id) {
  validId(id);
  const member = await TeamMember.findById(id);
  if (!member) throw fail("Team member not found.", 404);
  member.isActive = !member.isActive;
  await member.save();
  return member;
}

async function getStatistics() {
  const [total, active, visible] = await Promise.all([
    TeamMember.countDocuments({}),
    TeamMember.countDocuments({ isActive: true }),
    TeamMember.countDocuments({ isActive: true, showOnWebsite: true })
  ]);
  return { total, active, inactive: total - active, visible };
}

async function listByDepartment(department) {
  return TeamMember.find({
    department: String(department).toLowerCase(),
    isActive: true,
    showOnWebsite: true
  }).sort({ isBoss: -1, createdAt: -1 });
}

async function searchTeamMembers(q) {
  const query = String(q || "").trim();
  if (!query) return [];
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(escaped, "i");

  return TeamMember.find({
    isActive: true,
    showOnWebsite: true,
    $or: [{ name: rx }, { position: rx }, { department: rx }]
  }).sort({ isBoss: -1, createdAt: -1 });
}

module.exports = {
  listTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  getStatistics,
  listByDepartment,
  searchTeamMembers
};
