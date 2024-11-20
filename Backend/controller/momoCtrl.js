const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/config');
const MoMoTransaction = require('../models/momoModel');

const paymentMoMo = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Missing amount' });
    }

    const {
      accessKey,
      secretKey,
      partnerCode,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      orderInfo,
      orderGroupId,
      autoCapture,
      lang,
    } = config;

    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode,
      requestId,
      orderId,
      amount,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature,
    };

    const response = await axios.post(
      'https://test-payment.momo.vn/v2/gateway/api/create',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const newTransaction = new MoMoTransaction({
      orderId,
      amount,
      transactionId: response.data.transactionId,
      bankCode: response.data.bankCode || '',
      status: response.data.message === 'Success' ? 'success' : 'failed',
    });

    await newTransaction.save();

    return res.status(200).json({
      payUrl: response.data.payUrl,
      message: response.data.message,
      resultCode: response.data.resultCode,
    });
  } catch (error) {
    console.error('Error during MoMo payment:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const callbackMoMo = async (req, res) => {
  try {
    console.log('MoMo callback data:', req.body);
    // Process the callback data as per your business logic

    return res.status(204).send();
  } catch (error) {
    console.error('Error in MoMo callback:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const checkStatusTransactionMoMo = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }

    const { secretKey, accessKey, partnerCode } = config;
    const requestId = orderId;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode,
      requestId,
      orderId,
      signature,
      lang: 'vi',
    };

    const response = await axios.post(
      'https://test-payment.momo.vn/v2/gateway/api/query',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in checkStatusTransactionMoMo:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  paymentMoMo,
  callbackMoMo,
  checkStatusTransactionMoMo,
};
