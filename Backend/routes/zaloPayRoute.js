const express = require("express");
const router = express.Router();
const { payment, callback, checkStatusOrder } = require("../controller/zaloPayCtrl");

router.post("/payment", payment);
router.post("/callback", callback);
router.post("/check-status-order", checkStatusOrder);

module.exports = router;

// Test trên postman:
// http://localhost:5000/api/zaloPay/payment
// http://localhost:5000/api/zaloPay/check-status-order
