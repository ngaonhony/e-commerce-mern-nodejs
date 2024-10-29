import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import Container from "../components/Container";

const Cart = () => {
  const [userCartState, setUserCartState] = useState([
    {
      cartItemId: '1',
      productCode: 'RF293',
      title: 'North wolf bag 01',
      height: '10 inches',
      color: 'Black',
      composition: '100% calf leather',
      price: 29.99,
      quantity: 1,
      image: 'https://product.hstatic.net/200000017420/product/214a4844_1_43588626f54c47c7bbcd361ae41ad024_master.jpg',
    },
    {
      cartItemId: '2',
      productCode:'RF293',
      title: 'North wolf bag 02',
      height: '10 inches',
      color:'Black',
      composition:'100% calf leather',
      price: 39.99,
      quantity: 2,
      image: 'https://product.hstatic.net/200000017420/product/10__26__285a3a6ac1504cc8b6187f4bdef83092_master.jpg',
    },
    {
      cartItemId: '3',
      productCode:'RF293',
      title: 'North wolf bag 03',
      height: '10 inches',
      color:'Black',
      composition:'100% calf leather',
      price: 19.99,
      quantity: 1,
      image: 'https://product.hstatic.net/200000017420/product/214a4783_e93689f851f144179235b7c66e3891ba_master.jpg',
    },
  ]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [productUpdateDetail, setProductUpdateDetail] = useState(null);

  // Cập nhật tổng tiền mỗi khi có thay đổi trong giỏ hàng
  useEffect(() => {
    const sum = userCartState.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(sum);
  }, [userCartState]);

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (cartItemId, newQuantity) => {
    setUserCartState(prevState => 
      prevState.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: Number(newQuantity) } : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (cartItemId) => {
    setUserCartState(prevState => prevState.filter(item => item.cartItemId !== cartItemId));
  };

  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            {userCartState.length > 0 ? (
              userCartState.map((item) => (
                <div className="flex items-center border-b border-gray-300 py-6 px-8 " key={item.cartItemId}>
                <div className="flex-shrink-0">
                  <img src={item.image} alt={item.title} className="!h-44 !w-44" />
                  </div>
                  <div className="ml-12 flex-grow">
                    <p className="text-gray-600">{item.productCode}</p>
                    <p className="flex justify-between">
                    <span><h5 className="text-lg font-semibold mt-2 mb-2">{item.title}</h5></span>
                    <span className="d-flex justify-content-between align-items-center">
                        <div className="quantity px-72">
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.cartItemId, e.target.value)}
                            className="border rounded-md p-1"
                          >
                            {[...Array(4)].map((_, index) => (
                              <option key={index + 1} value={index + 1}>{index + 1}</option>
                            ))}
                          </select>
                        </div>
                      </span>
                    </p>
                    <p className="text-gray-600">Height: {item.height}</p>
                    <p className="text-gray-600">Color: {item.color}</p>
                    <p className="text-gray-600">Composition: {item.composition}</p>

                    {/* Add to favorites and Remove options */}
                    <p className="flex justify-between">
                    <div className="mt-2">
                      <span className="text-black underline cursor-pointer hover:text-blue-700 mr-4 whitespace-nowrap">
                        Add to favorites
                      </span>
                      <span 
                        className="text-red-500 underline cursor-pointer hover:text-red-700" 
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        Remove
                      </span>
                      <span className="px-72">${item.price.toFixed(2)}</span>
                    </div>
                    </p>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold">Summary</h2>
            <div className="mt-4">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping:</span>
                <span>$30.00</span>
              </p>
              <p className="flex justify-between">
                <span>Tax:</span>
                <span>$35.00</span>
              </p>
              <hr className="my-32" />
              <p className="flex justify-between text-xl">
                <span>Total:</span>
                <span className="font-bold text-2xl">${(totalAmount + 30 + 35).toFixed(2)}</span>
              </p>
              <Link to="/checkout">
                <button className="mt-4 bg-gray-800 text-white py-3 px-36 rounded hover:bg-red-800 transition w-full">Checkout</button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;

