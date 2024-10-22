const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} = require("../controller/colorCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", 
  // authMiddleware, // Removed authMiddleware
  // isAdmin, // Removed isAdmin
  createColor
);

router.put("/:id", 
  // authMiddleware, // Removed authMiddleware
  // isAdmin, // Removed isAdmin
  updateColor
);

router.delete("/:id", 
  // authMiddleware, // Removed authMiddleware
  // isAdmin, // Removed isAdmin
  deleteColor
);

router.get("/:id", getColor);
router.get("/", getallColor);

module.exports = router;
