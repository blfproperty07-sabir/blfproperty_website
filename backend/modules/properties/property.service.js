const mongoose = require("mongoose");
const Property = require("./property.model");
const cloudinaryService = require("../../common/services/cloudinary.service");

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function getUserId(user) {
  const id = user && (user._id || user.id || user.userId || user.sub);
  if (!id) throw fail("Authenticated user was not found.", 401);
  return id;
}

function parseStructured(value, field) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw fail("Invalid " + field + " format.");
  }
}

function numberOrUndefined(value, field) {
  if (value === undefined || value === null || value === "") return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) throw fail(field + " must be numeric.");
  return number;
}

function booleanValue(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return !["false", "0", "no"].includes(String(value).toLowerCase());
}

function normalize(input = {}) {
  const source = { ...input };
  const out = {};

  for (const key of ["title", "description", "type", "category"]) {
    if (source[key] !== undefined) out[key] = source[key];
  }

  if (source.deposit !== undefined) {
    out.deposit = numberOrUndefined(source.deposit, "Deposit");
  }

  if (source.price !== undefined) {
    const value = parseStructured(source.price, "price");
    const amount = value && typeof value === "object" ? value.amount : value;
    out.price = {
      amount: numberOrUndefined(amount, "Price"),
      currency: value && typeof value === "object" && value.currency
        ? value.currency : "INR",
      negotiable: value && typeof value === "object"
        ? booleanValue(value.negotiable) : true
    };
  }

  if (source.area !== undefined) {
    const value = parseStructured(source.area, "area");
    const size = value && typeof value === "object" ? value.size : value;
    out.area = {
      size: numberOrUndefined(size, "Area"),
      unit: value && typeof value === "object" && value.unit
        ? value.unit : "sqft"
    };
  }

  if (source.location !== undefined) {
    const location = parseStructured(source.location, "location") || {};
    const coordinates = location.coordinates || {};
    out.location = {
      address: location.address || "",
      city: location.city || "",
      state: location.state || "",
      pincode: location.pincode === undefined ? "" : String(location.pincode),
      landmark: location.landmark || "",
      neighborhood: location.neighborhood || ""
    };

    const latitude = numberOrUndefined(coordinates.latitude, "Latitude");
    const longitude = numberOrUndefined(coordinates.longitude, "Longitude");
    if (latitude !== undefined || longitude !== undefined) {
      out.location.coordinates = { latitude, longitude };
    }
  }

  const rawFeatures = source.features !== undefined
    ? parseStructured(source.features, "features")
    : null;

  const hasFlatFeatures = [
    "bedrooms", "bathrooms", "balconies", "parking", "furnished",
    "floor", "totalFloors", "age", "facing", "propertyAge", "constructionYear"
  ].some(key => source[key] !== undefined);

  if (rawFeatures !== null || hasFlatFeatures) {
    const f = rawFeatures && typeof rawFeatures === "object" ? rawFeatures : {};
    const floorInput = f.floor !== undefined ? f.floor : source.floor;
    const floor = floorInput && typeof floorInput === "object"
      ? floorInput : { current: floorInput, total: source.totalFloors };

    const furnishedValue = f.furnished !== undefined ? f.furnished : source.furnished;
    let furnished = furnishedValue || "unfurnished";
    if (furnished === "furnished") furnished = "fully-furnished";

    out.features = {
      bedrooms: numberOrUndefined(f.bedrooms ?? source.bedrooms, "Bedrooms") ?? 0,
      bathrooms: numberOrUndefined(f.bathrooms ?? source.bathrooms, "Bathrooms") ?? 0,
      balconies: numberOrUndefined(f.balconies ?? source.balconies, "Balconies") ?? 0,
      parking: f.parking !== undefined ? f.parking : (source.parking ?? 0),
      furnished,
      floor: {
        current: floor.current === "" ? undefined : floor.current,
        total: numberOrUndefined(floor.total, "Total floors")
      },
      age: f.age !== undefined ? f.age : (source.age ?? source.propertyAge),
      facing: f.facing !== undefined ? f.facing : (source.facing || "")
    };

    if (source.constructionYear !== undefined) {
      out.features.constructionYear = numberOrUndefined(source.constructionYear, "Construction year");
    }
  }

  if (source.amenities !== undefined) {
    out.amenities = parseStructured(source.amenities, "amenities");
    if (!Array.isArray(out.amenities)) throw fail("Amenities must be an array.");
  }

  const rawContact = source.contact !== undefined
    ? parseStructured(source.contact, "contact")
    : {};

  const oldOwner = source.owner !== undefined
    ? parseStructured(source.owner, "owner")
    : {};

  if (source.contact !== undefined || source.owner !== undefined) {
    const contact = rawContact && typeof rawContact === "object" ? rawContact : {};
    const owner = oldOwner && typeof oldOwner === "object" ? oldOwner : {};
    out.contact = {
      showOwnerDetails: booleanValue(contact.showOwnerDetails, true),
      preferredTime: contact.preferredTime || "",
      additionalPhone: contact.additionalPhone || "",
      ownerName: owner.name || contact.ownerName || "",
      ownerPhone: owner.phone || contact.ownerPhone || "",
      ownerEmail: owner.email || contact.ownerEmail || ""
    };
  }

  return out;
}

async function uploadFiles(files = []) {
  if (!files.length) return [];
  if (files.length > 10) throw fail("Maximum 10 images are allowed.");

  const uploaded = [];

  try {
    for (const file of files) {
      if (!file.buffer ||
          !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.mimetype)) {
        throw fail("Invalid property image.");
      }
      uploaded.push(await cloudinaryService.uploadImage(file.buffer));
    }
    return uploaded;
  } catch (error) {
    await Promise.allSettled(
      uploaded.map(image => cloudinaryService.deleteImage(image.publicId))
    );
    throw error;
  }
}

async function cleanupImages(images = []) {
  await Promise.allSettled(
    images.filter(image => image && image.publicId)
      .map(image => cloudinaryService.deleteImage(image.publicId))
  );
}

function pageOptions(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));
  return { page, limit, skip: (page - 1) * limit };
}

function publicFilter(query = {}) {
  const filter = { status: "approved" };

  if (["sale", "rent", "lease"].includes(query.category)) filter.category = query.category;
  if (query.type) filter.type = query.type;

  if (query.city) {
    filter["location.city"] = new RegExp(
      String(query.city).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"
    );
  }

  const price = {};
  if (query.minPrice !== undefined && Number.isFinite(Number(query.minPrice))) {
    price.$gte = Number(query.minPrice);
  }
  if (query.maxPrice !== undefined && Number.isFinite(Number(query.maxPrice))) {
    price.$lte = Number(query.maxPrice);
  }
  if (Object.keys(price).length) filter["price.amount"] = price;

  if (query.bedrooms !== undefined && query.bedrooms !== "") {
    filter["features.bedrooms"] = Number(query.bedrooms);
  }

  return filter;
}

async function listPublic(query = {}) {
  const { page, limit, skip } = pageOptions(query);
  const filter = publicFilter(query);

  const [properties, total] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Property.countDocuments(filter)
  ]);

  return {
    properties,
    pagination: {
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
}

async function listMine(user, query = {}) {
  const id = getUserId(user);
  const { page, limit, skip } = pageOptions(query);
  const filter = { $or: [{ createdBy: id }, { ownerId: id }, { owner: id }] };

  if (["pending", "approved", "rejected"].includes(query.status)) {
    filter.status = query.status;
  }

  const [properties, total] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Property.countDocuments(filter)
  ]);

  return {
    properties,
    pagination: {
      page, limit, total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
}

async function getPublic(id) {
  if (!mongoose.isValidObjectId(id)) throw fail("Invalid property ID.");
  const property = await Property.findOne({ _id: id, status: "approved" });
  if (!property) throw fail("Property not found.", 404);

  property.views = (property.views || 0) + 1;
  await property.save();
  return property;
}

async function getOwned(id, user) {
  if (!mongoose.isValidObjectId(id)) throw fail("Invalid property ID.");

  const property = await Property.findById(id);
  if (!property) throw fail("Property not found.", 404);

  const userId = String(getUserId(user));
  const allowed = [
    property.createdBy, property.ownerId, property.owner
  ].filter(Boolean).some(value => String(value) === userId);

  if (user.role !== "admin" && !allowed) {
    throw fail("You are not allowed to manage this property.", 403);
  }

  return property;
}

async function createProperty(input, files, user) {
  const id = getUserId(user);

  if (!["seller", "admin"].includes(user.role)) {
    throw fail("Only sellers or admins can submit properties.", 403);
  }

  const body = normalize(input);

  if (!body.price || !(body.price.amount > 0)) throw fail("Price amount must be greater than zero.");
  if (!body.area || !(body.area.size > 0)) throw fail("Area size must be greater than zero.");
  if (!files || files.length < 1) throw fail("Please upload at least one property image.");

  const uploaded = await uploadFiles(files);
  const images = uploaded.map((image, index) => ({
    url: image.url,
    publicId: image.publicId,
    caption: body.title + " - Image " + (index + 1),
    isPrimary: index === 0,
    width: image.width,
    height: image.height,
    format: image.format,
    bytes: image.bytes
  }));

  try {
    return await Property.create({
      title: body.title,
      description: body.description,
      type: body.type,
      category: body.category,
      price: body.price,
      area: body.area,
      location: body.location,
      features: body.features || {},
      amenities: body.amenities || [],
      images,
      owner: id,
      ownerId: id,
      createdBy: id,
      contact: body.contact || {},
      status: "pending",
      featured: false,
      views: 0
    });
  } catch (error) {
    await cleanupImages(images);
    throw error;
  }
}

function mergeExisting(existing, patch) {
  const current = existing && typeof existing.toObject === "function"
    ? existing.toObject() : (existing || {});
  return { ...current, ...patch };
}

async function updateProperty(id, input, files = [], user) {
  const property = await getOwned(id, user);
  const body = normalize(input);
  const incomingFiles = files || [];

  if (property.images.length + incomingFiles.length > 10) {
    throw fail("Maximum 10 images per property.");
  }

  const uploaded = await uploadFiles(incomingFiles);
  const images = uploaded.map(image => ({
    url: image.url,
    publicId: image.publicId,
    caption: (body.title || property.title) + " - Image",
    isPrimary: false,
    width: image.width,
    height: image.height,
    format: image.format,
    bytes: image.bytes
  }));

  try {
    for (const field of ["title", "description", "type", "category", "amenities"]) {
      if (body[field] !== undefined) property[field] = body[field];
    }

    for (const field of ["price", "area", "location", "features", "contact"]) {
      if (body[field] !== undefined) {
        property[field] = mergeExisting(property[field], body[field]);
      }
    }

    property.images.push(...images);
    await property.save();
    return property;
  } catch (error) {
    await cleanupImages(images);
    throw error;
  }
}

async function deleteProperty(id, user) {
  const property = await getOwned(id, user);
  await Property.deleteOne({ _id: property._id });
  await cleanupImages(property.images || []);
  return true;
}

async function addImages(id, files, user) {
  const property = await getOwned(id, user);
  if (!files || !files.length) throw fail("Select at least one image.");
  if (property.images.length + files.length > 10) {
    throw fail("Maximum 10 images per property.");
  }

  const uploaded = await uploadFiles(files);
  const images = uploaded.map(image => ({
    url: image.url,
    publicId: image.publicId,
    caption: property.title,
    isPrimary: false,
    width: image.width,
    height: image.height,
    format: image.format,
    bytes: image.bytes
  }));

  try {
    property.images.push(...images);
    await property.save();
    return property;
  } catch (error) {
    await cleanupImages(images);
    throw error;
  }
}

async function removeImage(id, imageId, user) {
  const property = await getOwned(id, user);
  const image = property.images.id(imageId);
  if (!image) throw fail("Property image not found.", 404);
  if (property.images.length <= 1) throw fail("A property must retain at least one image.");

  const publicId = image.publicId;
  image.deleteOne();
  await property.save();
  if (publicId) await cloudinaryService.deleteImage(publicId);
  return property;
}

async function statistics() {
  const [total, pending, approved, rejected] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ status: "pending" }),
    Property.countDocuments({ status: "approved" }),
    Property.countDocuments({ status: "rejected" })
  ]);

  return { total, pending, approved, rejected };
}

module.exports = {
  listPublic, listMine, getPublic, getOwned, createProperty,
  updateProperty, deleteProperty, addImages, removeImage, statistics
};
