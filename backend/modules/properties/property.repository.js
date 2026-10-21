const Property = require("./property.model");

function safeSort(sortBy, sortOrder) {
  const allowed = ["createdAt", "price", "area", "title", "views"];
  const key = allowed.includes(sortBy) ? sortBy : "createdAt";
  return { [key]: String(sortOrder).toLowerCase() === "asc" ? 1 : -1 };
}

async function listPublic(filters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 12));
  const query = { status: "approved" };

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.bedrooms !== undefined && filters.bedrooms !== "") {
    query.bedrooms = Number(filters.bedrooms);
  }
  if (filters.location || filters.city) {
    const term = String(filters.location || filters.city).trim();
    if (term) {
      query.$or = [
        { "location.city": { $regex: term, $options: "i" } },
        { "location.state": { $regex: term, $options: "i" } },
        { "location.pincode": { $regex: term, $options: "i" } }
      ];
    }
  }

  const min = Number(filters.minPrice);
  const max = Number(filters.maxPrice);
  if (Number.isFinite(min) && filters.minPrice !== "") {
    query.price = { ...(query.price || {}), $gte: min };
  }
  if (Number.isFinite(max) && filters.maxPrice !== "") {
    query.price = { ...(query.price || {}), $lte: max };
  }

  const [properties, total] = await Promise.all([
    Property.find(query)
      .sort(safeSort(filters.sortBy || "createdAt", filters.sortOrder))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Property.countDocuments(query)
  ]);

  return {
    properties,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

async function listByOwner(userId, filters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 12));
  const query = { $or: [{ createdBy: userId }, { ownerId: userId }] };

  const [properties, total] = await Promise.all([
    Property.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Property.countDocuments(query)
  ]);

  return {
    properties,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

async function findById(id) {
  return Property.findById(id);
}

async function create(data) {
  return Property.create(data);
}

async function countByStatus(status) {
  return Property.countDocuments(status ? { status } : {});
}

async function countPublic() {
  return Property.countDocuments({ status: "approved" });
}

module.exports = { listPublic, listByOwner, findById, create, countByStatus, countPublic, safeSort };
