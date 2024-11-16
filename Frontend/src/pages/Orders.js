import React, { useEffect } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/user/userSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const orderState = useSelector(
    (state) => state?.auth?.getorderedProduct?.orders
  );

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
    dispatch(getOrders(config2));
  }, []);
  return (
    <>
      <BreadCrumb title="My Orders" />
      <Container className="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          {orderState &&
            orderState?.map((item, index) => {
              return (
                <div
                  style={{ backgroundColor: "#FFFFFF" }}
                  className="col-12"
                  key={index}
                >
                  {/* Order Items and Order Information in One Row with Two Columns */}
                  <div className="row">
                    {/* Order Items Column (on the left) */}
                    <div className="col-md-6 col-12">
                      <h6 className="text-black font-bold p-2">Customer’s Cart</h6>
                      {item?.orderItems?.map((i, idx) => {
                        return (
                          <div className="col-12" key={idx}>
                            <div className="row py-3 align-items-center">
                              <div className="col-6 d-flex align-items-center">
                                {/* Product Image */}
                                <img
                                  src={i?.product?.images[0]?.url}
                                  className="img-fluid rounded"
                                  alt={i?.product?.title}
                                  style={{
                                    maxWidth: "100px",
                                    height: "auto",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className="ml-3">
                                  <h6 className="text-black font-semibold">
                                    {i?.product?.title}
                                  </h6>
                                  <ul className="colors ps-0 mt-12">
                                    {i?.color?.title && (
                                      <li
                                        style={{
                                          backgroundColor: i?.color.title,
                                        }}
                                        className="w-6 h-6 rounded-full border"
                                      ></li>
                                    )}
                                  </ul>
                                </div>
                              </div>
  
                              <div className="col-6 d-flex justify-content-between align-items-center">
                                {/* Quantity and Price */}
                                <p className="text-black mb-0">{i?.quantity}</p>
                                <p className="text-black mb-0">Rs.{i?.price}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
  
                    {/* Order Information Column (on the right) */}
                    <div className="col-md-6 col-12">
                      <div className="bg-gray-100 p-4 rounded-md h-full">
                        <div className="d-flex justify-content-between py-2">
                          <p className="font-bold">Order Id:</p>
                          <p>{item?._id}</p>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                          <p className="font-bold">Total Amount:</p>
                          <p>{item?.totalPrice}</p>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                          <p className="font-bold">Total Amount after Discount:</p>
                          <p>{item?.totalPriceAfterDiscount}</p>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                          <p className="font-bold">Status:</p>
                          <p>{item?.orderStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </>
  ); 
};  
  

export default Orders;
