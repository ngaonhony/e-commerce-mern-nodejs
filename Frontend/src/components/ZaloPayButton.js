// frontend/src/components/ZaloPayButton.js
import React from "react";
import axios from "axios";

const ZaloPayButton = () => {
  const handlePayment = async () => {
    const paymentData = {
      amount: 50000, // Số tiền thanh toán
      bankCode: "", // Mã ngân hàng (nếu cần)
      language: "vn", // Ngôn ngữ
    };

    try {
      // Gửi yêu cầu đến backend để tạo URL thanh toán ZaloPay
      const response = await axios.post(
        "http://localhost:5000/api/zaloPay/payment", // Đường dẫn đến API ZaloPay
        paymentData
      );

      const orderUrl = response.data.order_url; // Nhận order_url từ backend

      // Chuyển hướng đến URL thanh toán của ZaloPay
      window.location.href = orderUrl;
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return <button onClick={handlePayment}>Thanh Toán ZaloPay</button>;
};

export default ZaloPayButton;
