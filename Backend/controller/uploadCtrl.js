// controller/uploadCtrl.js

const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const files = req.files;
    const images = files.map((file) => {
      return {
        url: `${req.protocol}://${req.get("host")}/public/images/products/${file.filename}`,
        filename: file.filename,
      };
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  try {
    const filePath = path.join(
      __dirname,
      "../public/images/products/",
      filename
    );
    fs.unlinkSync(filePath);
    res.json({ message: "Image Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
