// frontend/src/components/ZaloPayButton.js
import React from "react";
import axios from "axios";
import ZaloPay from "../assets/images/zalopay-logo.png";

const ZaloPayButton = ({ amount }) => {
  const handlePayment = async () => {
    const paymentData = {
      amount: amount,
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

  return (
    <button onClick={handlePayment} className="button w-full bg-gray-500 hover:bg-gray-600 text-center !rounded-none text-white py-2 flex items-center justify-center">
     <img 
     src={ZaloPay} 
     alt="VNPay Logo" 
     className="mr-2" />
      Thanh Toán ZaloPay {amount ? amount + 0 : "0"}
    </button>
  );
};

export default ZaloPayButton;
