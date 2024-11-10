// frontend/src/components/MoMoPaymentButton.js
import React from "react";
import axios from "axios";

const MoMoPaymentButton = () => {
  const handleMoMoPayment = async () => {
    const paymentData = {
      amount: 100000, // Số tiền thanh toán
    };

    console.log("Payment Data:", paymentData); // In ra console để kiểm tra

    try {
      const response = await axios.post(
        "http://localhost:5000/api/momo/paymentMoMo",
        paymentData
      );
      if (response.data && response.data.payUrl) {
        window.location.href = response.data.payUrl; // Chuyển hướng đến URL thanh toán
      } else {
        console.error(
          "Không nhận được URL thanh toán từ phản hồi:",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "Payment Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return <button onClick={handleMoMoPayment}>Thanh Toán MoMo</button>;
};

export default MoMoPaymentButton;
