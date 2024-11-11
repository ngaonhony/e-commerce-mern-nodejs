const express = require("express");
const router = express.Router();
const {
  paymentMoMo,
  callbackMoMo,
  checkStatusTransactionMoMo,
} = require("../controller/momoCtrl");

router.post("/paymentMoMo", paymentMoMo);
router.post("/callbackMoMo", callbackMoMo);
router.post("/check-status-transaction-MoMo", checkStatusTransactionMoMo);

module.exports = router;

// http://localhost:5000/api/momo/paymentMoMo
// http://localhost:5000/api/momo/callbackMoMo
// http://localhost:5000/api/momo/check-status-transaction-MoMo
