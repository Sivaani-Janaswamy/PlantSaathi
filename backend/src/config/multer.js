const multer = require('multer');

// Use memory storage for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
