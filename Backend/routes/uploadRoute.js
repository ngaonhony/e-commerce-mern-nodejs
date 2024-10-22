const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post(
  "/",
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", deleteImages);

module.exports = router;
