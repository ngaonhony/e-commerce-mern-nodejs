// middlewares/uploadImage.js

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists
    const destPath = path.join(__dirname, "../public/images/temp/");
    fs.mkdirSync(destPath, { recursive: true });
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const destPath = path.join(
        __dirname,
        "../public/images/products/",
        file.filename
      );
      // Ensure the directory exists
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      await sharp(file.path)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(destPath);
      fs.unlinkSync(file.path); // Remove the temp file
    })
  );
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const destPath = path.join(
        __dirname,
        "../public/images/blogs/",
        file.filename
      );
      // Ensure the directory exists
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      await sharp(file.path)
        .resize(800, 800)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(destPath);
      fs.unlinkSync(file.path); // Remove the temp file
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
