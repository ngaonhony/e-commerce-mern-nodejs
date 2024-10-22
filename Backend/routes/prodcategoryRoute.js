const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controller/prodcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", 
  // authMiddleware, // Removed authMiddleware
  // isAdmin, // Removed isAdmin
  createCategory
);

router.put("/:id", 
  // authMiddleware, // Removed authMiddleware
  // isAdmin, // Removed isAdmin
  updateCategory
);

router.delete("/:id", 
  // authMiddleware, // Removed authMiddleware
  // isAdmin, // Removed isAdmin
  deleteCategory
);

router.get("/:id", getCategory);
router.get("/", getallCategory);

module.exports = router;
