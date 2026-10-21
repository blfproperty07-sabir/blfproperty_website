function invalid(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function numberField(value, label, fallback, minimum = 0) {
  if (value === undefined || value === null || String(value).trim() === "") {
    if (fallback !== undefined) return fallback;
    throw invalid(`${label} is required.`);
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < minimum) {
    throw invalid(`${label} must be a valid number.`);
  }

  return number;
}

function normalizeRentalForm(req, res, next) {
  try {
    const body = req.body || {};

    body.category = "rent";

    body.price = {
      amount: numberField(body.rent, "Monthly rent", undefined, 1),
      currency: "INR",
      negotiable: false
    };

    body.area = {
      size: numberField(body.area, "Area", undefined, 1),
      unit: "sqft"
    };

    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const pincode = String(body.pincode || "").trim();

    body.location = {
      address,
      city,
      state,
      pincode,
      landmark: "",
      neighborhood: ""
    };

    const floor = numberField(body.floor, "Floor", 0, 0);
    const bedrooms = numberField(body.bedrooms, "Bedrooms", 1, 0);
    const bathrooms = numberField(body.bathrooms, "Bathrooms", 1, 0);
    const deposit = numberField(body.deposit, "Security deposit", 0, 0);

    body.features = {
      bedrooms,
      bathrooms,
      balconies: 0,
      parking: 0,
      furnished: body.furnished || "unfurnished",
      floor: { current: floor }
    };

    body.deposit = deposit;
    body.amenities = [];

    // Never accept the requested status/creator from multipart form fields.
    delete body.status;
    delete body.createdBy;

    // Remove the flat-form values; nested values above are canonical.
    delete body.rent;
    delete body.address;
    delete body.city;
    delete body.state;
    delete body.pincode;
    delete body.bedrooms;
    delete body.bathrooms;
    delete body.floor;
    delete body.furnished;

    req.body = body;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = normalizeRentalForm;
