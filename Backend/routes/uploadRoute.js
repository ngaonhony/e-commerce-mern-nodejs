// uploadRoute.js

const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post(
  "/",
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:filename", deleteImages);

module.exports = router;
