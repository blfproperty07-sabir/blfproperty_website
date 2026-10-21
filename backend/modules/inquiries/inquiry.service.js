const mongoose = require("mongoose");
const Inquiry = require("./inquiry.model");
const { INQUIRY_TYPES, INQUIRY_STATUSES } = require("./inquiry.constants");

const ALLOWED_TYPES = INQUIRY_TYPES.map((item) => item.value);

async function createInquiry(payload) {
  return Inquiry.create({
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim().toLowerCase(),
    phone: String(payload.phone || "").trim(),
    subject: String(payload.subject || "").trim(),
    message: String(payload.message || "").trim(),
    type: ALLOWED_TYPES.includes(payload.type) ? payload.type : "general",
    status: "new"
  });
}

async function getInquiryStatus(id) {
  if (!mongoose.isValidObjectId(id)) return null;

  return Inquiry.findById(id)
    .select("_id status createdAt")
    .lean();
}

async function listInquiries(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));
  const filter = {};

  if (params.status && INQUIRY_STATUSES.includes(params.status)) {
    filter.status = params.status;
  }

  if (params.type && ALLOWED_TYPES.includes(params.type)) {
    filter.type = params.type;
  }

  if (params.search && String(params.search).trim()) {
    const search = String(params.search).trim().slice(0, 100);
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
      { subject: { $regex: escaped, $options: "i" } },
      { message: { $regex: escaped, $options: "i" } }
    ];
  }

  const allowedSortFields = ["createdAt", "name", "email", "status"];
  const sortBy = allowedSortFields.includes(params.sortBy)
    ? params.sortBy
    : "createdAt";
  const sortOrder = String(params.sortOrder).toLowerCase() === "asc" ? 1 : -1;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Inquiry.countDocuments(filter)
  ]);

  return { inquiries, total, page, limit };
}

async function updateInquiry(id, changes = {}) {
  if (!mongoose.isValidObjectId(id)) return null;

  const update = {};
  if (typeof changes.name === "string") update.name = changes.name.trim();
  if (typeof changes.email === "string") update.email = changes.email.trim().toLowerCase();
  if (typeof changes.phone === "string") update.phone = changes.phone.trim();
  if (typeof changes.subject === "string") update.subject = changes.subject.trim();
  if (typeof changes.message === "string") update.message = changes.message.trim();
  if (typeof changes.response === "string") update.response = changes.response.trim();

  if (changes.type !== undefined) {
    if (!ALLOWED_TYPES.includes(changes.type)) {
      const error = new Error("Invalid inquiry type.");
      error.statusCode = 400;
      throw error;
    }
    update.type = changes.type;
  }

  if (changes.status !== undefined) {
    if (!INQUIRY_STATUSES.includes(changes.status)) {
      const error = new Error("Invalid inquiry status.");
      error.statusCode = 400;
      throw error;
    }
    update.status = changes.status;
  }

  return Inquiry.findByIdAndUpdate(id, { $set: update }, {
    new: true,
    runValidators: true
  }).lean();
}

async function deleteInquiry(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Inquiry.findByIdAndDelete(id).lean();
}

module.exports = {
  createInquiry,
  getInquiryStatus,
  listInquiries,
  updateInquiry,
  deleteInquiry,
  INQUIRY_TYPES,
  INQUIRY_STATUSES
};
