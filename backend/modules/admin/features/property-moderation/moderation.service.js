const Property = require("../../../properties/property.model");
const propertyService = require("../../../properties/property.service");
const { assertValidObjectId, notFound } = require("../../admin.service");

const VALID_STATUSES = new Set(["pending", "approved", "rejected"]);
const VALID_CATEGORIES = new Set(["sale", "rent", "lease"]);

async function listProperties(filters = {}) {
  const query = {};

  if (filters.status && filters.status !== "all") {
    const status = String(filters.status).toLowerCase();

    if (!VALID_STATUSES.has(status)) {
      const error = new Error("Invalid property status filter.");
      error.status = 400;
      throw error;
    }

    query.status = status;
  }

  if (filters.category && filters.category !== "all") {
    const category = String(filters.category).toLowerCase();

    if (!VALID_CATEGORIES.has(category)) {
      const error = new Error("Invalid property category filter.");
      error.status = 400;
      throw error;
    }

    query.category = category;
  }

  return Property.find(query)
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });
}

async function approveProperty(propertyId, adminId) {
  assertValidObjectId(propertyId, "property ID");

  const property = await Property.findById(propertyId);
  if (!property) throw notFound("Property");

  property.status = "approved";
  property.approvedAt = new Date();
  property.approvedBy = adminId;

  await property.save();
  await property.populate("owner", "name email phone");

  return property;
}

async function rejectProperty(propertyId) {
  assertValidObjectId(propertyId, "property ID");

  const property = await Property.findById(propertyId);
  if (!property) throw notFound("Property");

  property.status = "rejected";
  property.approvedAt = undefined;
  property.approvedBy = undefined;

  await property.save();
  await property.populate("owner", "name email phone");

  return property;
}

async function deleteProperty(propertyId) {
  assertValidObjectId(propertyId, "property ID");

  const property = await Property.findByIdAndDelete(propertyId);
  if (!property) throw notFound("Property");

  return property;
}

async function createRentalProperty(input, files, adminUser) {
  const property = await propertyService.createProperty(input, files, adminUser);

  // Admin-created rentals are immediately approved.
  property.status = "approved";
  property.approvedAt = new Date();
  property.approvedBy = adminUser._id;
  property.createdBy = adminUser._id;
  property.deposit = Number(input.deposit || 0);

  await property.save();
  await property.populate("owner", "name email phone");

  return property;
}

module.exports = {
  listProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  createRentalProperty
};
