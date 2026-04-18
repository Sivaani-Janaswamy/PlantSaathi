// Utility for standard API response formatting

function sendSuccess(res, status, data) {
  return res.status(status).json({ success: true, data });
}

function sendError(res, status, message) {
  return res.status(status).json({ success: false, message });
}

module.exports = {
  sendSuccess,
  sendError,
};
