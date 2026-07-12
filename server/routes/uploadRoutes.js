import express from "express";
import multer from "multer";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Vercel serverless functions cap request bodies at ~4.5MB, so keep uploads under that.
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Wrap multer so its errors become clean JSON 400s instead of crashing through
const handleImageField = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image too large — maximum size is 4MB"
          : err.message || "Invalid upload";
      return res.status(400).json({ message });
    }
    next();
  });
};

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "momentry", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });

// POST /api/upload — admin-only image upload (multipart field: "image")
router.post("/", verifyToken, adminOnly, handleImageField, async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      message:
        "Image uploads are not configured on this server (missing Cloudinary credentials)",
    });
  }

  if (!req.file) {
    return res
      .status(400)
      .json({ message: 'No image file provided (expected form field "image")' });
  }

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
