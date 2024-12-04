// frontend/src/components/MoMoPaymentButton.js
import React from "react";
import axios from "axios";
import MoMoLogo from "../assets/images/momo-logo.png";

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
    <button onClick={handleMoMoPayment} className="button w-full bg-gray-500 hover:bg-gray-600 text-center !rounded-none text-white py-2 flex items-center justify-center">
    <img src={MoMoLogo} alt="MoMo Logo" className="mr-2" />
      MoMo {amount ? amount + 0 : "0"}
    </button>
  );
};

export default MoMoPaymentButton;
