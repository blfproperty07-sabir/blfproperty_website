const inquiryService = require("../inquiries/inquiry.service");

async function submitContactForm(payload) {
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();

  if (!name || !email || !subject || !message) {
    const error = new Error("Name, email, subject, and message are required.");
    error.statusCode = 400;
    throw error;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  const inquiry = await inquiryService.createInquiry({
    ...payload,
    name,
    email,
    subject,
    message
  });

  return {
    id: inquiry._id,
    status: inquiry.status,
    createdAt: inquiry.createdAt
  };
}

module.exports = {
  submitContactForm,
  getContactStatus: inquiryService.getInquiryStatus,
  getInquiryTypes: () => inquiryService.INQUIRY_TYPES
};
