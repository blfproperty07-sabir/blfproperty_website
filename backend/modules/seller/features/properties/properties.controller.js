const service = require("./properties.service");
const mongoose = require("mongoose");

function sendError(res, error) {
  const status = error.status || (error.name === "CastError" ? 400 : 500);

  console.error("[Property API Error]", JSON.stringify({
    status,
    name: error.name,
    message: error.message,
    http_code: error.http_code || null,
    stack: error.stack
  }, null, 2));

  return res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === "production" && status === 500
      ? "Property request failed."
      : error.message
  });
}

async function list(req, res) {
  try {
    const result = await service.listPublic(req.query);
    res.json({
      success: true,
      data: result,
      properties: result.properties,
      pagination: result.pagination
    });
  } catch (error) { sendError(res, error); }
}

async function mine(req, res) {
  try {
    const result = await service.listMine(req.user, req.query);
    res.json({
      success: true,
      data: result,
      properties: result.properties,
      pagination: result.pagination
    });
  } catch (error) { sendError(res, error); }
}

async function getById(req, res) {
  try {
    const property = await service.getPublic(req.params.id);
    res.json({ success: true, data: { property }, property });
  } catch (error) { sendError(res, error); }
}

async function create(req, res) {
  try {
    console.log("[Property Create Debug]", JSON.stringify({
      role: req.user?.role,
      userId: req.user?._id ? String(req.user._id) : null,
      bodyKeys: Object.keys(req.body || {}),
      priceType: typeof req.body?.price,
      areaType: typeof req.body?.area,
      imageCount: req.files?.length || 0,
      imageTypes: (req.files || []).map(file => file.mimetype)
    }));
    const property = await service.createProperty(req.body, req.files, req.user);
    res.status(201).json({
      success: true,
      message: "Property submitted successfully and is awaiting review.",
      data: { property },
      property
    });
  } catch (error) {
    console.error("[Property Create Error]", JSON.stringify({
      status: error.status || null,
      name: error.name,
      message: error.message
    }));
    sendError(res, error);
  }
}

async function update(req, res) {
  try {
    const property = await service.updateProperty(req.params.id, req.body, req.files, req.user);
    res.json({ success: true, message: "Property updated.", data: { property }, property });
  } catch (error) { sendError(res, error); }
}

async function remove(req, res) {
  try {
    await service.deleteProperty(req.params.id, req.user);
    res.json({ success: true, message: "Property deleted." });
  } catch (error) { sendError(res, error); }
}

async function addImages(req, res) {
  try {
    const property = await service.addImages(req.params.id, req.files, req.user);
    res.json({ success: true, message: "Images uploaded.", data: { property }, property });
  } catch (error) { sendError(res, error); }
}

async function removeImage(req, res) {
  try {
    const property = await service.removeImage(req.params.id, req.params.imageId, req.user);
    res.json({ success: true, message: "Image removed.", data: { property }, property });
  } catch (error) { sendError(res, error); }
}

async function search(req, res) {
  try {
    const result = await service.listPublic({ ...req.query, ...req.body });
    res.json({ success: true, data: result, properties: result.properties, pagination: result.pagination });
  } catch (error) { sendError(res, error); }
}

async function statistics(req, res) {
  try {
    res.json({ success: true, data: await service.statistics() });
  } catch (error) { sendError(res, error); }
}

async function analytics(req, res) {
  try {
    const property = await service.getOwned(req.params.id, req.user);
    res.json({
      success: true,
      data: {
        propertyId: String(property._id),
        views: property.views || 0,
        status: property.status,
        createdAt: property.createdAt
      }
    });
  } catch (error) { sendError(res, error); }
}

module.exports = {
  list, mine, getById, create, update, remove,
  addImages, removeImage, search, statistics, analytics
};


