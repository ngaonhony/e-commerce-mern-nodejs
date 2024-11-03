import React, { useEffect, useState } from "react";
import Meta from "../components/Meta";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartProduct,
  getUserCart,
  updateCartProduct,
} from "../features/user/userSlice";

const Cart = () => {
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();

  // Retrieve token from localStorage
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  // Configuration for API requests
  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  // Local state for product updates and total amount
  const [productUpdateDetail, setProductUpdateDetail] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Retrieve cart products from Redux store
  const userCartState = useSelector((state) => state.auth.cartProducts);

  // Fetch user cart on component mount
  useEffect(() => {
    dispatch(getUserCart(config2));
  }, [dispatch, config2]);

  // Handle product quantity updates
  useEffect(() => {
    if (productUpdateDetail !== null) {
      dispatch(
        updateCartProduct({
          cartItemId: productUpdateDetail.cartItemId,
          quantity: productUpdateDetail.quantity,
        })
      );
      const timer = setTimeout(() => {
        dispatch(getUserCart(config2));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [productUpdateDetail, dispatch, config2]);

  // Handle deletion of a cart product
  const deleteACartProduct = (id) => {
    dispatch(deleteCartProduct({ id: id, config2: config2 }));
    setTimeout(() => {
      dispatch(getUserCart(config2));
    }, 200);
  };

  // Calculate total amount and handle empty cart redirection
  useEffect(() => {
    let sum = 0;
    userCartState?.forEach((item) => {
      sum += Number(item.quantity) * item.price;
    });
    setTotalAmount(sum);

    // Optional: Automatically redirect to products page after 3 seconds if cart is empty
    /*
    if (userCartState && userCartState.length === 0) {
      const timer = setTimeout(() => {
        navigate("/product");
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
    */
  }, [userCartState, navigate]);

  return (
    <>
      <Meta title={"Cart"} />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="w-full bg-white overflow-y-auto overflow-x-hidden">
          {userCartState && userCartState.length > 0 ? (
            <div className="flex md:flex-row flex-col justify-between">
              {/* Cart Items Section */}
              <div className="lg:w-3/5 w-full md:pl-10 pl-4 pr-10 md:pr-4 md:py-12 py-8">
                {userCartState.map((item) => (
                  <div
                    key={item._id}
                    className="md:flex items-center mt-14 py-8 border-b border-gray-200"
                  >
                    {/* Product Image */}
                    <div className="w-1/4">
                      <img
                        src={item.productId.images[0].url}
                        className="w-full h-full object-center object-cover"
                        alt={item.productId.title}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="md:pl-3 md:w-3/4">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {item.productId.title}
                      </h2>
                      <div className="flex items-center justify-between w-full pt-1">
                        <p className="text-lg font-medium text-gray-800">
                          Rs. {item.price}
                        </p>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          className="py-2 px-3 border border-gray-200 focus:outline-none rounded"
                          onChange={(e) =>
                            setProductUpdateDetail({
                              cartItemId: item._id,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      <p className="text-base leading-3 text-gray-600 py-4">
                        Color:
                        <ul className="colors ps-0 pt-1 inline-block">
                          <li
                            style={{ backgroundColor: item.color.title }}
                            className="inline-block w-4 h-4 rounded-full border border-gray-300 ml-2"
                          ></li>
                        </ul>
                      </p>

                      {/* Remove Button and Total Price */}
                      <div className="flex items-center justify-between pt-5 pr-6">
                        <div className="flex items-center">
                          <p
                            className="text-xs leading-3 underline text-red-500 cursor-pointer flex items-center"
                            onClick={() => deleteACartProduct(item._id)}
                          >
                            <AiFillDelete className="inline mr-1" />
                            Remove
                          </p>
                        </div>
                        <p className="text-lg font-medium text-gray-800">
                          Rs. {item.quantity * item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="lg:w-2/5 w-full bg-gray-100 px-14 py-20">
                <h2 className="text-4xl font-semibold text-gray-800 mb-8">
                  Summary
                </h2>
                <div className="flex items-center justify-between pt-4">
                  <p className="text-base leading-none text-gray-800">Subtotal</p>
                  <p className="text-base leading-none text-gray-800">
                    Rs. {totalAmount}
                  </p>
                </div>
                <p className="text-xs leading-3 text-gray-600 pt-4">
                  Taxes and shipping calculated at checkout
                </p>
                <div className="pt-10">
                  <Link
                    to="/checkout"
                    className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 text-center"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Empty Cart UI
            <div className="flex flex-col items-center justify-center py-20">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/product"
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Cart;
