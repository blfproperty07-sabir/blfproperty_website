function asyncHandler(handler) {
  return async function adminAsyncHandler(req, res, next) {
    try {
      await handler(req, res, next);
    } catch (error) {
      const status = error.status ||
        (error.name === "CastError" ? 400 : 500);

      if (status >= 500) {
        console.error("[Admin API Error]", error.stack || error.message);
      }

      if (res.headersSent) return next(error);

      return res.status(status).json({
        success: false,
        message: status >= 500
          ? "Admin request failed."
          : error.message
      });
    }
  };
}

module.exports = { asyncHandler };
