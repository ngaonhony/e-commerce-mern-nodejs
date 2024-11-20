const axios = require('axios');
const moment = require('moment');
const Transaction = require('../models/Transaction');
const querystring = require('qs');
const crypto = require('crypto');
const config = require('config');

// Utility function to sort and encode parameters
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  }
  return sorted;
}

// Render Functions
exports.renderOrderList = (req, res) => {
  res.render('orderlist', { title: 'Danh sách đơn hàng' });
};

exports.renderCreatePayment = (req, res) => {
  res.render('order', { title: 'Tạo mới đơn hàng' });
};

exports.renderQueryDR = (req, res) => {
  res.render('querydr', { title: 'Truy vấn kết quả thanh toán' });
};

exports.renderRefund = (req, res) => {
  res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
};

// Create Payment URL
exports.createPaymentUrl = (req, res) => {
  try {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const tmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    const returnUrl = config.get('vnp_ReturnUrl');

    const orderId = moment(date).format('DDHHmmss');
    const amount = req.body.amount;
    const bankCode = '';

    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 1000,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl: vnpUrl });
  } catch (error) {
    console.error('Error in createPaymentUrl:', error);
    res.status(500).json({ code: '99', message: 'Internal Server Error' });
  }
};

// VNPay Return
exports.vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = config.get('vnp_HashSecret');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const newTransaction = new Transaction({
        orderId: vnp_Params['vnp_TxnRef'],
        amount: vnp_Params['vnp_Amount'],
        transactionId: vnp_Params['vnp_TransactionNo'],
        bankCode: vnp_Params['vnp_BankCode'],
        status: vnp_Params['vnp_ResponseCode'],
        createdAt: new Date(),
      });
      await newTransaction.save();

      res.json({
        code: '00',
        message: 'Thanh toán thành công!',
        transaction: newTransaction,
      });
    } else {
      res.json({ code: '97', message: 'Thông tin giao dịch không hợp lệ' });
    }
  } catch (error) {
    console.error('Error in vnpayReturn:', error);
    res.status(500).json({ code: '99', message: 'Internal Server Error' });
  }
};

// VNPay IPN
exports.vnpayIpn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = config.get('vnp_HashSecret');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Handle payment status update logic here
      res.status(200).json({ RspCode: '00', Message: 'Success' });
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
  } catch (error) {
    console.error('Error in vnpayIpn:', error);
    res.status(500).json({ RspCode: '99', Message: 'Internal Server Error' });
  }
};

// Query DR
exports.queryDR = async (req, res) => {
  try {
    const date = new Date();
    const vnp_TmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    const vnp_Api = config.get('vnp_Api');

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_RequestId = moment(date).format('HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = `Truy van GD ma: ${vnp_TxnRef}`;
    const vnp_IpAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
    const hmac = crypto.createHmac('sha512', secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

    const dataObj = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_SecureHash,
    };

    const response = await axios.post(vnp_Api, dataObj);
    res.json(response.data);
  } catch (error) {
    console.error('Error in queryDR:', error);
    res.status(500).json({ code: '99', message: 'Internal Server Error' });
  }
};

// Refund
exports.refund = async (req, res) => {
  try {
    const date = new Date();
    const vnp_TmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    const vnp_Api = config.get('vnp_Api');

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_Amount = req.body.amount * 1000;
    const vnp_TransactionType = req.body.transType;
    const vnp_CreateBy = req.body.user;

    const vnp_RequestId = moment(date).format('HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'refund';
    const vnp_OrderInfo = `Hoan tien GD ma: ${vnp_TxnRef}`;
    const vnp_IpAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    const vnp_TransactionNo = '0';

    const data = [
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_OrderInfo,
    ].join('|');

    const hmac = crypto.createHmac('sha512', secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

    const dataObj = {
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo,
      vnp_CreateBy,
      vnp_OrderInfo,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr,
      vnp_SecureHash,
    };

    const response = await axios.post(vnp_Api, dataObj);
    res.json(response.data);
  } catch (error) {
    console.error('Error in refund:', error);
    res.status(500).json({ code: '99', message: 'Internal Server Error' });
  }
};
