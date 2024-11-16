// frontend/src/components/MoMoPaymentButton.js
import React from "react";
import axios from "axios";

const MoMoPaymentButton = ({ amount }) => {
  const handleMoMoPayment = async () => {
    const paymentData = {
      amount: amount,
    };

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

  return (
    <button onClick={handleMoMoPayment} className="button w-full text-center mt-10 !rounded-none text-white py-2 flex items-center justify-center">
      Thanh Toán MoMo {amount ? amount + 0 : "0"}
    </button>
  );
};

export default MoMoPaymentButton;
