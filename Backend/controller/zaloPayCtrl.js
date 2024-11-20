const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const ZaloPay = require("../models/zaloPayModel");

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const payment = async (req, res) => {
  const { amount, bankCode } = req.body;
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify([]),
    embed_data: JSON.stringify({
      redirecturl: "https://f131-1-52-0-187.ngrok-free.app/views/home.html",
    }),
    amount,
    callback_url: "https://f131-1-52-0-187.ngrok-free.app/callback",
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: bankCode,
  };

  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });

    const newTransaction = new ZaloPay({
      app_trans_id: order.app_trans_id,
      amount: order.amount,
      transactionId: result.data.transactionId,
      bankCode: order.bank_code,
      status: result.data.return_code === 1 ? "success" : "failed",
    });

    await newTransaction.save();

    return res.status(200).json({
      return_code: result.data.return_code,
      return_message: result.data.return_message,
      order_url: result.data.order_url,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

const callback = (req, res) => {
  let result = {};
  console.log(req.body);

  try {
    const { data: dataStr, mac: reqMac } = req.body;
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    if (reqMac !== mac) {
      result = { return_code: -1, return_message: "mac not equal" };
    } else {
      const dataJson = JSON.parse(dataStr);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
      result = { return_code: 1, return_message: "success" };
    }
  } catch (ex) {
    console.error("lỗi:::", ex.message);
    result = { return_code: 0, return_message: ex.message };
  }

  res.json(result);
};

const checkStatusOrder = async (req, res) => {
  const { app_trans_id } = req.body;

  const postData = {
    app_id: config.app_id,
    app_trans_id,
    mac: CryptoJS.HmacSHA256(`${config.app_id}|${app_trans_id}|${config.key1}`, config.key1).toString(),
  };

  const postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("lỗi", error);
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

module.exports = {
  payment,
  callback,
  checkStatusOrder,
};
