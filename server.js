const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 10000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rights_hub_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
  },
});

const parser = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Single image upload endpoint (existing)
app.post('/upload', parser.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  // Return the Cloudinary URL of the uploaded image
  res.json({ imageUrl: req.file.path });
});

// Extended multiple files upload endpoint
app.post('/upload-multiple', parser.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files provided' });
  }
  // Collect URLs of all uploaded files
  const fileUrls = req.files.map(file => file.path);
  res.json({ fileUrls: fileUrls });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
