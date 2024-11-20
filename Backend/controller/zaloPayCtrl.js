const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const ZaloPay = require('../models/zaloPayModel');

const config = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  key2: process.env.ZALOPAY_KEY2,
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  callback_url: process.env.ZALOPAY_CALLBACK_URL,
  redirect_url: process.env.ZALOPAY_REDIRECT_URL,
};

const payment = async (req, res) => {
  try {
    const { amount, bankCode } = req.body;

    if (!amount || !bankCode) {
      return res.status(400).json({ message: 'Missing amount or bankCode' });
    }

    const embedData = {
      redirecturl: config.redirect_url,
    };
    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(),
      amount: amount,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      description: `Payment for order #${transID}`,
      bank_code: bankCode,
      callback_url: config.callback_url,
    };

    const dataString = [
      config.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join('|');

    order.mac = CryptoJS.HmacSHA256(dataString, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });

    const newTransaction = new ZaloPay({
      app_trans_id: order.app_trans_id,
      amount: order.amount,
      transactionId: response.data.transactionId,
      bankCode: order.bank_code,
      status: response.data.return_code === 1 ? 'success' : 'failed',
    });

    await newTransaction.save();

    return res.status(200).json({
      return_code: response.data.return_code,
      return_message: response.data.return_message,
      order_url: response.data.order_url,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error('Error in ZaloPay payment:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const callback = (req, res) => {
  try {
    const { data: dataStr, mac: reqMac } = req.body;

    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      return res.json({
        return_code: -1,
        return_message: 'Invalid MAC',
      });
    }

    const dataJson = JSON.parse(dataStr);
    console.log(
      "Update order's status to success where app_trans_id =",
      dataJson.app_trans_id
    );

    // Update transaction status in the database here

    return res.json({
      return_code: 1,
      return_message: 'Success',
    });
  } catch (error) {
    console.error('Error in ZaloPay callback:', error);
    return res.json({
      return_code: 0,
      return_message: error.message,
    });
  }
};

const checkStatusOrder = async (req, res) => {
  try {
    const { app_trans_id } = req.body;

    if (!app_trans_id) {
      return res.status(400).json({ message: 'Missing app_trans_id' });
    }

    const postData = {
      app_id: config.app_id,
      app_trans_id,
    };

    const dataString = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(dataString, config.key1).toString();

    const response = await axios.post(
      'https://sb-openapi.zalopay.vn/v2/query',
      qs.stringify(postData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in checkStatusOrder:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  payment,
  callback,
  checkStatusOrder,
};
