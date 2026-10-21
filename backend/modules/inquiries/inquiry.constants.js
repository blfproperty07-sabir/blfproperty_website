const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "property-inquiry", label: "Property Inquiry" },
  { value: "selling-inquiry", label: "Want to Sell Property" },
  { value: "support", label: "Technical Support" }
];

const INQUIRY_STATUSES = ["new", "in-progress", "resolved"];

module.exports = { INQUIRY_TYPES, INQUIRY_STATUSES };
