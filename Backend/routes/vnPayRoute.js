const express = require('express');
const router = express.Router();
const vnPayCtrl = require('../controller/vnPayCtrl');

// GET Routes
router.get('/', vnPayCtrl.renderOrderList);
router.get('/create_payment_url', vnPayCtrl.renderCreatePayment);
router.get('/querydr', vnPayCtrl.renderQueryDR);
router.get('/refund', vnPayCtrl.renderRefund);
router.get('/vnpay_return', vnPayCtrl.vnpayReturn);
router.get('/vnpay_ipn', vnPayCtrl.vnpayIpn);

// POST Routes
router.post('/create_payment_url', vnPayCtrl.createPaymentUrl);
router.post('/querydr', vnPayCtrl.queryDR);
router.post('/refund', vnPayCtrl.refund);

module.exports = router;
