import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartProduct,
  getUserCart,
  updateCartProduct,
} from "../features/user/userSlice";

const Cart = () => {
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;
  const config2 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
        }`,
      Accept: "application/json",
    },
  };
  const dispatch = useDispatch();
  const [productupdateDetail, setProductupdateDetail] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const userCartState = useSelector((state) => state.auth.cartProducts);

  useEffect(() => {
    if (productupdateDetail !== null) {
      dispatch(
        updateCartProduct({
          cartItemId: productupdateDetail?.cartItemId,
          quantity: productupdateDetail?.quantity,
        })
      );
      setTimeout(() => {
        dispatch(getUserCart(config2));
      }, 200);
    }
  }, [productupdateDetail]);

  const deleteACartProduct = (id) => {
    dispatch(deleteCartProduct({ id: id, config2: config2 }));
    setTimeout(() => {
      dispatch(getUserCart(config2));
    }, 200);
  };

  useEffect(() => {
    let sum = 0;
    userCartState?.forEach((item) => {
      sum += Number(item.quantity) * item.price;
    });
    setTotalAmount(sum);
  }, [userCartState]);

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="w-full bg-white overflow-y-auto overflow-x-hidden">
          {userCartState && userCartState.length > 0 ? (
            <div className="flex md:flex-row flex-col justify">
              <div className="lg:w-3/5 w-full md:pl-10 pl-4 pr-10 md:pr-4">
                {userCartState.map((item, index) => (
                  <div
                    key={index}
                    className="md:flex items-center mt-14 py-8 "
                  >
                    <div className="w-1/4">
                      <img
                        src={item?.productId?.images[0].url}
                        className="w-full h-full object-center object-cover"
                        alt={item?.productId?.title}
                      />
                    </div>
                    <div className="md:pl-3 md:w-3/4">
                      {/* Display brand */}
                      <p className="text-base leading-3 text-gray-800 md:pt-0 pt-4">
                        {item?.productId?.brand}
                      </p>
                      <div className="flex items-center justify-between w-full pt-1">
                        {/* Display product title */}
                        <p className="text-xl font-black leading-none text-gray-800">
                          {item?.productId?.title}
                        </p>
                        {/* Cart quantity input */}
                        <input
                          type="number"
                          min="1"
                          max={item?.productId?.quantity}
                          value={item?.quantity}
                          className="py-2 px-1 border border-gray-200 focus:outline-none"
                          onChange={(e) =>
                            setProductupdateDetail({
                              cartItemId: item?._id,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      {/* Display category */}
                      <p className="text-base leading-3 text-gray-600 pt-2">
                        Category: {item?.productId?.category}
                      </p>
                      {/* Display color */}
                      <p className="text-base leading-3 text-gray-600 py-4">
                        Color:
                        <span
                          className="inline-block ml-2 w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: item?.color?.title || "#000",
                          }}
                          title={item?.color?.title}
                        ></span>
                      </p>
                      {/* Display available stock quantity */}
                      <p className="w-96 text-base leading-3 text-gray-600">
                        Available Stock: {item?.productId?.quantity}
                      </p>
                      <div className="flex items-center justify-between pt-5 pr-6">
                        <div className="flex items-center">
                          <p
                            className="text-base leading-3 underline text-red-500 cursor-pointer"
                            onClick={() => deleteACartProduct(item?._id)}
                          >
                            <AiFillDelete className="inline mr-1" />
                            Remove
                          </p>
                        </div>
                        <p className="text-base font-black leading-none text-gray-800">
                          Rs. {item?.quantity * item?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:w-2/5 w-full bg-gray-50 px-14 py-20">
                <p className="text-4xl font-black leading-9 text-gray-800">
                  Summary
                </p>
                <div className="flex items-center justify-between pt-16">
                  <p className="text-base leading-none text-gray-800">Subtotal</p>
                  <p className="text-base leading-none text-gray-800">
                    Rs. {totalAmount ?? 0}
                  </p>
                </div>
                <p className="text-xs leading-3 text-gray-600 pt-4">
                  Taxes and shipping calculated at checkout
                </p>
                <div className="pt-10 justify-items-end">
                  <Link to="/checkout" className="button w-full text-center">
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-gray-800">Your cart is empty</p>
              <Link to="/product" className="button mt-5">
                Back to Store
              </Link>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Cart;
