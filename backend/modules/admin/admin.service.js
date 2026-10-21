const mongoose = require("mongoose");

function assertValidObjectId(id, label = "ID") {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error(`Invalid ${label}.`);
    error.status = 400;
    throw error;
  }
}

function notFound(entity = "Record") {
  const error = new Error(`${entity} not found.`);
  error.status = 404;
  return error;
}

module.exports = { assertValidObjectId, notFound };
