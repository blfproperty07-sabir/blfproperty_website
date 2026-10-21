const types = new Set([
  "apartment", "house", "villa", "plot",
  "commercial", "office", "shop", "warehouse"
]);

const categories = new Set(["sale", "rent", "lease"]);

function parseStructured(value, field, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    const error = new Error("Invalid " + field + " format.");
    error.status = 400;
    throw error;
  }
}

function validatePropertyPayload(req, res, next) {
  try {
    const body = req.body || {};

    for (const field of ["price", "area", "location", "features", "contact", "amenities", "owner"]) {
      if (body[field] !== undefined) {
        body[field] = parseStructured(body[field], field, body[field]);
      }
    }

    if (!body.title || String(body.title).trim().length < 5) {
      throw Object.assign(new Error("Property title must be at least 5 characters."), { status: 400 });
    }

    if (!body.description || String(body.description).trim().length < 10) {
      throw Object.assign(new Error("Description must be at least 10 characters."), { status: 400 });
    }

    if (!types.has(body.type)) {
      throw Object.assign(new Error("Invalid property type."), { status: 400 });
    }

    if (!categories.has(body.category)) {
      throw Object.assign(new Error("Invalid listing category."), { status: 400 });
    }

    const priceAmount = body.price && typeof body.price === "object"
      ? body.price.amount
      : body.price;

    const areaSize = body.area && typeof body.area === "object"
      ? body.area.size
      : body.area;

    if (priceAmount === "" || !Number.isFinite(Number(priceAmount)) || Number(priceAmount) <= 0) {
      throw Object.assign(new Error("Price amount must be greater than zero."), { status: 400 });
    }

    if (areaSize === "" || !Number.isFinite(Number(areaSize)) || Number(areaSize) <= 0) {
      throw Object.assign(new Error("Area size must be greater than zero."), { status: 400 });
    }

    if (!body.location || typeof body.location !== "object" ||
        !body.location.address || !body.location.city ||
        !body.location.state || !body.location.pincode) {
      throw Object.assign(new Error("Address, city, state and PIN code are required."), { status: 400 });
    }

    if (body.amenities !== undefined && !Array.isArray(body.amenities)) {
      throw Object.assign(new Error("Amenities must be an array."), { status: 400 });
    }

    if (!req.files || req.files.length < 1) {
      throw Object.assign(new Error("Please upload at least one property image."), { status: 400 });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validatePropertyPayload };
