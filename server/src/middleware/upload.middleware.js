import multer from "multer";
import path from "path";
import crypto from "crypto";

/**
 * Dev-mode local disk storage. In production, swap this for
 * multer-storage-cloudinary or a custom S3 storage engine — the rest of
 * the upload pipeline (route, controller, signed-URL generation) doesn't
 * need to change, only this storage engine.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error("Unsupported file type. Allowed: PDF, PNG, JPEG, WEBP."));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
