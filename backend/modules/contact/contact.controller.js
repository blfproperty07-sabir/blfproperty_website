const contactService = require("./contact.service");

function sendError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) console.error("Contact API error:", error);
  return res.status(status).json({
    success: false,
    message: status >= 500 ? "Something went wrong. Please try again later." : error.message
  });
}

async function submit(req, res) {
  try {
    const inquiry = await contactService.submitContactForm(req.body || {});
    return res.status(201).json({
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
      data: inquiry
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function types(req, res) {
  return res.json({
    success: true,
    data: contactService.getInquiryTypes()
  });
}

async function status(req, res) {
  try {
    const inquiry = await contactService.getContactStatus(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found."
      });
    }

    return res.json({ success: true, data: inquiry });
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = { submit, types, status };
