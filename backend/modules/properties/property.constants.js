const PROPERTY_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
});

const PROPERTY_TYPES = [
  "apartment", "house", "villa", "plot", "commercial", "other"
];

const PROPERTY_CATEGORIES = ["sale", "rent", "lease"];

module.exports = { PROPERTY_STATUS, PROPERTY_TYPES, PROPERTY_CATEGORIES };
