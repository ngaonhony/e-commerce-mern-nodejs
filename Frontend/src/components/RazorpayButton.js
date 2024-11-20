import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { createAnOrder, deleteUserCart, resetState } from "../features/user/userSlice";
import RazorPayLogo from "../assets/images/razorpay-logo.png";

const RazorpayButton = ({ totalAmount, cartProductState, config2 }) => {
  const dispatch = useDispatch();

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const checkOutHandler = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const result = await axios.post(
      "http://localhost:5000/api/user/order/checkout",
      { amount: totalAmount + 100 },
      config2
    );

    if (!result) {
      alert("Something went wrong");
      return;
    }

    const { amount, id: order_id, currency } = result.data.order;

    const options = {
      key: "rzp_test_HSSeDI22muUrLR",
      amount: amount,
      currency: currency,
      name: "Cart's corner",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
        };

        const result = await axios.post(
          "http://localhost:5000/api/user/order/paymentVerification",
          data,
          config2
        );

        dispatch(
          createAnOrder({
            totalPrice: totalAmount,
            totalPriceAfterDiscount: totalAmount,
            orderItems: cartProductState,
            paymentInfo: result.data,
            shippingInfo: JSON.parse(localStorage.getItem("address")),
          })
        );
        dispatch(deleteUserCart(config2));
        localStorage.removeItem("address");
        dispatch(resetState());
      },
      prefill: {
        name: "Dev Corner",
        email: "devcorner@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "developer's corner office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      onClick={checkOutHandler}
      className="button w-full md:w-50 bg-gray-500 hover:bg-gray-600 text-center !rounded-none text-white py-2 flex items-center justify-center"
    >
    <img
      src={RazorPayLogo}
      alt="Razorpay Logo" 
      className="mr-2" />
      RazorPay {totalAmount ? totalAmount + 0 : "0"}
    </button>
  );
};

export default RazorpayButton;