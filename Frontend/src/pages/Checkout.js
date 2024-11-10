import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { config } from "../utils/axiosConfig";
import { FaApple } from "react-icons/fa";
import {
  createAnOrder,
  deleteUserCart,
  getUserCart,
  resetState,
} from "../features/user/userSlice";

import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef } from "react";

let shippingSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  address: yup.string().required("Address Details are Required"),
  state: yup.string().required("S tate is Required"),
  city: yup.string().required("city is Required"),
  country: yup.string().required("country is Required"),
  pincode: yup.number("Pincode No is Required").required().positive().integer(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    razorpayPaymentId: "",
    razorpayOrderId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotalAmount(sum);
    }
  }, [cartState]);

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  useEffect(() => {
    if (
      authState?.orderedProduct?.order !== null &&
      authState?.orderedProduct?.success === true
    ) {
      navigate("/my-orders");
    }
  }, [authState]);

  const [cartProductState, setCartProductState] = useState([]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      address: "",
      state: "",
      city: "",
      country: "",
      pincode: "",
      other: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      localStorage.setItem("address", JSON.stringify(values));
      setTimeout(() => {
        checkOutHandler();
      }, 300);
    },
  });

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

  useEffect(() => {
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      items.push({
        product: cartState[index].productId._id,
        quantity: cartState[index].quantity,
        color: cartState[index].color._id,
        price: cartState[index].price,
      });
    }
    setCartProductState(items);
  }, []);

  const checkOutHandler = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK faild to Load");
      return;
    }
    const result = await axios.post(
      "http://localhost:5000/api/user/order/checkout",
      { amount: totalAmount + 100 },
      config
    );

    if (!result) {
      alert("Something Went Wrong");
      return;
    }

    const { amount, id: order_id, currency } = result.data.order;

    const options = {
      key: "rzp_test_HSSeDI22muUrLR", // Enter the Key ID generated from the Dashboard
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
          config
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
        address: "developer's cornor office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const libraries = ["places"];
  const inputref = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // console.log(isLoaded)

  const handelOnPlacesChanged = () => {
    let address = inputref.current.getPlaces();
    if (address && address.length > 0) {
      const place = address[0];
      formik.setFieldValue("address", place.formatted_address); // Cập nhật địa chỉ
      formik.setFieldValue(
        "city",
        place.address_components.find((comp) => comp.types.includes("locality"))
          ?.long_name || ""
      ); // Cập nhật thành phố
      formik.setFieldValue(
        "state",
        place.address_components.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name || ""
      ); // Cập nhật bang
      formik.setFieldValue(
        "country",
        place.address_components.find((comp) => comp.types.includes("country"))
          ?.long_name || ""
      ); // Cập nhật quốc gia
      formik.setFieldValue(
        "pincode",
        place.address_components.find((comp) =>
          comp.types.includes("postal_code")
        )?.long_name || ""
      ); // Cập nhật mã bưu điện
    }
  };

  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-x-8">
          <div className=" bg-white h-full p-4 rounded-lg mb-2 ">
            <div className="border-bottom py-4 h-full flex flex-col">
              {cartState &&
                cartState?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="d-flex gap-10 mb-2 align-align-items-center flex-1 justify-between items-center p-2"
                    >
                      <div className=" d-flex gap-10 h-full flex-1 items-center">
                        <div className="position-relative ">
                          <span
                            style={{ top: "-10px", right: "2px" }}
                            className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                          >
                            {item?.quantity}
                          </span>
                          <img
                            className="!h-[150px] !w-[150px] object-cover max-w-full"
                            src={item?.productId?.images[0]?.url}
                            alt="product"
                          />
                        </div>
                        <div>
                          <h5 className="total-price">
                            {item?.productId?.title}
                          </h5>
                          <p
                            className="total-price rounded-full"
                            style={{
                              backgroundColor: item?.color?.title,
                              height: 20,
                              width: 20,
                              margin: 70,
                            }}
                          ></p>
                        </div>
                      </div>
                      <div className="">
                        <h5 className="total">
                          Rs. {item?.price * item?.quantity}
                        </h5>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className=" bg-white p-4 rounded-lg">
            <div className="checkout-left-data w-200 mb-10">
              <form
                onSubmit={formik.handleSubmit}
                action=""
                className="d-flex gap-15 flex-wrap justify-content-between"
              >
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-control"
                    name="firstname"
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.firstname && formik.errors.firstname}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-control"
                    name="lastname"
                    value={formik.values.lastname}
                    onChange={formik.handleChange("lastname")}
                    onBlur={formik.handleBlur("lastname")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.lastname && formik.errors.lastname}
                  </div>
                </div>
                <div className="w-100">
                  {isLoaded && (
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputref.current = ref)}
                      onPlacesChanged={handelOnPlacesChanged}
                    >
                      <input
                        type="text"
                        placeholder="Address"
                        className="form-control"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange("address")}
                        onBlur={formik.handleBlur("address")}
                      />
                    </StandaloneSearchBox>
                  )}
                  <div className="error ms-2 my-1">
                    {formik.touched.address && formik.errors.address}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="form-control"
                    name="pincode"
                    value={formik.values.pincode}
                    onChange={formik.handleChange("pincode")}
                    onBlur={formik.handleBlur("pincode")}
                  />
                  <div className="error ms-2 my-1">
                    {formik.touched.pincode && formik.errors.pincode}
                  </div>
                </div>

                <div className="w-100">
                  <Link
                    to="/Payment"
                    className="button w-full text-center mt-10 !rounded-none text-white py-2 flex items-center justify-center"
                  >
                    Pay VNPay $ {totalAmount ? totalAmount + 0 : "0"}
                  </Link>
                </div>

                <div className="w-100">
                  <Link
                    to="/zaloPay"
                    className="button w-full text-center mt-10 !rounded-none text-white py-2 flex items-center justify-center"
                  >
                    Pay ZaloPay $ {totalAmount ? totalAmount + 0 : "0"}
                  </Link>
                </div>

                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Return to Cart
                    </Link>
                    <button className="button" type="submit">
                      Place Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;
