// frontend/src/components/PaymentButton.js
import React from "react";
import axios from "axios";

const PaymentButton = ({ amount }) => {
  const handlePayment = async () => {
    const paymentData = {
      amount: amount,
    };

    try {
      // Gửi yêu cầu đến backend để tạo URL thanh toán
      const response = await axios.post(
        "http://localhost:5000/api/order/create_payment_url",
        paymentData
      );
      const paymentUrl = response.data.paymentUrl;

      // Chuyển hướng đến URL thanh toán của VNPAY
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <button onClick={handlePayment} className="button w-full text-center mt-10 !rounded-none text-white py-2 flex items-center justify-center">
      Thanh Toán VNPAY {amount ? amount + 0 : "0"}
    </button>
  );
};

export default PaymentButton;

