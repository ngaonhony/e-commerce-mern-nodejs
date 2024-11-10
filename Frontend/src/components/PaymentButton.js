// frontend/src/components/PaymentButton.js
import React from "react";
import axios from "axios";

const PaymentButton = () => {
  const handlePayment = async () => {
    const paymentData = {
      orderId: "12345",
      amount: 100000,
      bankCode: "",
      language: "vn",
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

  return <button onClick={handlePayment}>Thanh Toán VNPAY</button>;
};

export default PaymentButton;

// try {
//   const response = await axios.post(
//     "http://localhost:5000/api/order/create_payment_url",
//     { amount, orderId, bankCode, language }
//   );
//   window.location.href = paymentUrl; // Client tự thực hiện chuyển hướng
// } catch (error) {
//   console.error("Payment Error:", error);
//   alert("Có lỗi xảy ra khi tạo URL thanh toán.");
// }
