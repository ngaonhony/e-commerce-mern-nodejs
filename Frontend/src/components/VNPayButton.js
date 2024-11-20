// frontend/src/components/PaymentButton.js
import React from "react";
import axios from "axios";
import VNPayLogo from "../assets/images/vnpay-logo.png";

const VNPayButton = ({ amount }) => {
  const handlePayment = async () => {
    const paymentData = {
      amount: amount,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/order/create_payment_url",
        paymentData
      );
      const paymentUrl = response.data.paymentUrl;

      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <button onClick={handlePayment} className=" bg-gray-500 hover:bg-gray-600 transition-all duration-300 w-full text-center !rounded-none text-white py-2 flex items-center justify-center">
      <img src={VNPayLogo} alt="VNPay Logo" className="mr-2" />
      {amount ? amount.toLocaleString() : "0"}
    </button>
  );
};

export default VNPayButton;