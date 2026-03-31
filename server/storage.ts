import multer from "multer";
import path from "path";
import fs from "fs";
import { Express } from "express";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isProd = process.env.NODE_ENV === "production";
    const uploadPath = isProd
      ? path.resolve(process.cwd(), "data", "uploads")
      : path.resolve(process.cwd(), "client", "public", "uploads");
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, webp)"));
  },
});

export function setupStorage(app: Express) {
  const isProd = process.env.NODE_ENV === "production";
  const uploadPath = isProd
    ? path.resolve(process.cwd(), "data", "uploads")
    : path.resolve(process.cwd(), "client", "public", "uploads");
  
  if (!fs.existsSync(uploadPath)) {
    console.log(`[STORAGE] Creating uploads directory at: ${uploadPath}`);
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}
