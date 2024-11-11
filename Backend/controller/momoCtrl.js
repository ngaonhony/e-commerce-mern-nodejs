const axios = require("axios").default;
const crypto = require("crypto");
const config = require("../config/config");
const MoMoTransaction = require("../models/momoModel");

const paymentMoMo = async (req, res) => {
  //     const { amount } = req.body;

  //     if (!amount) {
  //       return res.status(400).json({ message: "Thiếu thông tin amount" });
  //     }

  //   console.log("Received payment request:", { amount });

  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = config;

  var amount = "10000";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;

  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    amount: amount,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    console.log("MoMo response:", result.data);

    const newTransaction = new MoMoTransaction({
      orderId: orderId,
      amount: amount,
      transactionId: result.data.transactionId,
      bankCode: result.data.bankCode || "",
      status: result.data.message === "Success" ? "success" : "failed",
    });

    await newTransaction.save();

    // Trả về payUrl cho frontend
    return res.status(200).json({
      payUrl: result.data.payUrl,
      message: result.data.message,
      resultCode: result.data.resultCode,
    });
  } catch (error) {
    console.error("Error during MoMo payment:", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const callbackMoMo = async (req, res) => {
  console.log("callback: ");
  console.log(req.body);
  return res.status(204).json(req.body);
};

const checkStatusTransactionMoMo = async (req, res) => {
  const { orderId } = req.body;

  var secretKey = config.secretKey;
  var accessKey = config.accessKey;
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
};

module.exports = {
  paymentMoMo,
  callbackMoMo,
  checkStatusTransactionMoMo,
};
