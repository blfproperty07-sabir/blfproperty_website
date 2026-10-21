const inquiryService = require("./inquiries.service");

function sendError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) console.error("Admin inquiries API error:", error);
  return res.status(status).json({
    success: false,
    message: status >= 500 ? "Unable to process inquiries request." : error.message
  });
}

async function list(req, res) {
  try {
    const result = await inquiryService.listInquiries(req.query);
    return res.json({ success: true, ...result });
  } catch (error) {
    return sendError(res, error);
  }
}

async function update(req, res) {
  try {
    const inquiry = await inquiryService.updateInquiry(req.params.id, req.body || {});
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    return res.json({ success: true, message: "Inquiry updated.", inquiry });
  } catch (error) {
    return sendError(res, error);
  }
}

async function updateStatus(req, res) {
  try {
    const changes = { status: req.body && req.body.status };
    if (req.body && typeof req.body.response === "string") {
      changes.response = req.body.response;
    }

    const inquiry = await inquiryService.updateInquiry(req.params.id, changes);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    return res.json({ success: true, message: "Inquiry status updated.", inquiry });
  } catch (error) {
    return sendError(res, error);
  }
}

async function remove(req, res) {
  try {
    const inquiry = await inquiryService.deleteInquiry(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    return res.json({ success: true, message: "Inquiry deleted." });
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = { list, update, updateStatus, remove };
