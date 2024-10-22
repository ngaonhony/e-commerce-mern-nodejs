import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import userIcon from "../images/user.svg";
import cartIcon from "../images/cart.svg";
import menuIcon from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlice";
import { getUserCart } from "../features/user/userSlice";

export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selectors
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const productState = useSelector((state) => state?.product?.product);

  // Local state
  const [total, setTotal] = useState(0);
  const [paginate] = useState(true); // Assuming paginate remains true
  const [productOpt, setProductOpt] = useState([]);
  const [searchInput, setSearchInput] = useState(true);
  const [mdOptionsToggle, setMdOptionsToggle] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Retrieve token from localStorage
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  // Config for authenticated requests
  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  // Fetch user cart on component mount
  useEffect(() => {
    if (getTokenFromLocalStorage) {
      dispatch(getUserCart(config2));
    }
  }, [dispatch, config2, getTokenFromLocalStorage]);

  // Calculate total price from cart
  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum += Number(cartState[index].quantity) * cartState[index].price;
    }
    setTotal(sum);
  }, [cartState]);

  // Prepare product options for Typeahead
  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?._id, name: element?.title });
    }
    setProductOpt(data);
  }, [productState]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="dark:bg-gray-900">
      <div className="relative">
        {/* For md screen size */}
        <div
          id="md-searchbar"
          className={`${
            mdOptionsToggle ? "hidden" : "flex"
          } bg-white dark:bg-gray-900 lg:hidden py-5 px-6 items-center justify-between`}
        >
          <div className="flex items-center space-x-3 text-gray-800 dark:text-white w-full">
            {/* Integrated Typeahead Search */}
            <Typeahead
              id="pagination-example-md"
              onPaginate={() => console.log("Results paginated")}
              onChange={(selected) => {
                if (selected.length > 0) {
                  navigate(`/product/${selected[0]?.prod}`);
                  dispatch(getAProduct(selected[0]?.prod));
                }
              }}
              options={productOpt}
              paginate={paginate}
              labelKey={"name"}
              placeholder="Search for Products here"
              className="w-full"
            />
            <span className="input-group-text p-3">
              <BsSearch className="fs-6" />
            </span>
          </div>
          <div className="space-x-6">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="text-gray-800 dark:text-white focus:outline-none"
              aria-label="view favourites"
            >
              <img src={wishlist} alt="wishlist" />
            </Link>
            {/* User Account */}
            <Link
              to={authState?.user === null ? "/login" : "/my-profile"}
              className="text-gray-800 dark:text-white focus:outline-none"
              aria-label="user account"
            >
              <img src={userIcon} alt="user" />
              {authState?.user !== null && (
                <span className="ml-2">
                  Welcome {authState?.user?.firstname}
                </span>
              )}
            </Link>
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="text-gray-800 dark:text-white focus:outline-none"
              aria-label="go to cart"
            >
              <img src={cartIcon} alt="cart" />
              <div className="flex flex-col items-center">
                <span className="badge bg-white text-dark">
                  {cartState?.length ? cartState.length : 0}
                </span>
                <span className="text-sm">
                  Rs. {cartState?.length ? total : 0}
                </span>
              </div>
            </Link>
            {/* Logout Button */}
            {authState?.user !== null && (
              <button
                className="text-gray-800 dark:text-white focus:outline-none"
                onClick={handleLogout}
                aria-label="logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* For large screens */}
        <div className="dark:bg-gray-900 bg-gray-50 px-6 py-9">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <h1 className="md:w-2/12 cursor-pointer text-gray-800 dark:text-white" aria-label="Cart Corner">
              <Link to="/">
                <svg
                  className="fill-stroke"
                  width={93}
                  height={19}
                  viewBox="0 0 93 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Your Logo SVG Path Here */}
                  <text
                    x="0"
                    y="15"
                    fill="currentColor"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    Cart Corner
                  </text>
                </svg>
              </Link>
            </h1>

            {/* Navigation Links */}
            <ul className="hidden w-8/12 md:flex items-center justify-center space-x-8">
              <li>
                <NavLink
                  to="/"
                  className="dark:text-white text-base text-gray-800 hover:underline"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="dark:text-white text-base text-gray-800 hover:underline"
                >
                  Our Store
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-orders"
                  className="dark:text-white text-base text-gray-800 hover:underline"
                >
                  My Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blogs"
                  className="dark:text-white text-base text-gray-800 hover:underline"
                >
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="dark:text-white text-base text-gray-800 hover:underline"
                >
                  Contact
                </NavLink>
              </li>
              {/* Conditional Logout Link */}
              {authState?.user !== null && (
                <li>
                  <button
                    className="dark:text-white text-base text-gray-800 hover:underline focus:outline-none"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>

            {/* Right Side Icons */}
            <div className="md:w-2/12 justify-end flex items-center space-x-4 xl:space-x-8">
              {/* Search Icon and Input */}
              <div className="hidden lg:flex items-center">
                <button
                  onClick={() => setSearchInput(!searchInput)}
                  aria-label="search items"
                  className="text-gray-800 dark:hover:text-gray-300 dark:text-white focus:outline-none"
                >
                  <BsSearch size={24} />
                </button>
                <Typeahead
                  id="pagination-example-lg"
                  onPaginate={() => console.log("Results paginated")}
                  onChange={(selected) => {
                    if (selected.length > 0) {
                      navigate(`/product/${selected[0]?.prod}`);
                      dispatch(getAProduct(selected[0]?.prod));
                    }
                  }}
                  options={productOpt}
                  paginate={paginate}
                  labelKey={"name"}
                  placeholder="Search for Products here"
                  className={`ml-2 ${searchInput ? "hidden" : "block"} w-64`}
                />
              </div>

              {/* Wishlist and Cart Icons */}
              <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
                {/* Wishlist Icon */}
                <Link
                  to="/wishlist"
                  className="text-gray-800 dark:text-white focus:outline-none"
                  aria-label="view favourites"
                >
                  <img src={wishlist} alt="wishlist" />
                </Link>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="text-gray-800 dark:text-white focus:outline-none relative"
                  aria-label="go to cart"
                >
                  <img src={cartIcon} alt="cart" />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartState?.length ? cartState.length : 0}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    Rs. {cartState?.length ? total : 0}
                  </div>
                </Link>
              </div>

              {/* Mobile Menu Buttons */}
              <div className="flex lg:hidden">
                <button
                  aria-label="show options"
                  onClick={() => setMdOptionsToggle(!mdOptionsToggle)}
                  className="text-black dark:text-white dark:hover:text-gray-300 focus:outline-none rounded mr-2"
                >
                  <img src={menuIcon} alt="menu" />
                </button>
                <button
                  aria-label="open menu"
                  onClick={() => setShowMenu(true)}
                  className="text-black dark:text-white dark:hover:text-gray-300 focus:outline-none rounded"
                >
                  <svg
                    className="fill-stroke"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6H20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 12H20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 18H20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          id="mobile-menu"
          className={`${
            showMenu ? "flex" : "hidden"
          } absolute dark:bg-gray-900 z-10 inset-0 md:hidden bg-white flex-col h-screen w-full`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 p-4">
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <Typeahead
                id="pagination-example-mobile"
                onPaginate={() => console.log("Results paginated")}
                onChange={(selected) => {
                  if (selected.length > 0) {
                    navigate(`/product/${selected[0]?.prod}`);
                    dispatch(getAProduct(selected[0]?.prod));
                    setShowMenu(false); // Close menu after selection
                  }
                }}
                options={productOpt}
                paginate={paginate}
                labelKey={"name"}
                placeholder="Search for Products here"
                className="w-full"
              />
            </div>
            <button
              onClick={() => setShowMenu(false)}
              aria-label="close menu"
              className="focus:outline-none rounded"
            >
              <svg
                className="fill-stroke text-gray-800 dark:text-white"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="mt-6 p-4">
            <ul className="flex flex-col space-y-6">
              <li>
                <NavLink
                  to="/"
                  className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800"
                  onClick={() => setShowMenu(false)}
                >
                  Home
                  <svg
                    className="fill-stroke text-black dark:text-white"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800"
                  onClick={() => setShowMenu(false)}
                >
                  Our Store
                  <svg
                    className="fill-stroke text-black dark:text-white"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/my-orders"
                  className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800"
                  onClick={() => setShowMenu(false)}
                >
                  My Orders
                  <svg
                    className="fill-stroke text-black dark:text-white"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blogs"
                  className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800"
                  onClick={() => setShowMenu(false)}
                >
                  Blogs
                  <svg
                    className="fill-stroke text-black dark:text-white"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800"
                  onClick={() => setShowMenu(false)}
                >
                  Contact
                  <svg
                    className="fill-stroke text-black dark:text-white"
                    width={12}
                    height={12}
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavLink>
              </li>
              {/* Conditional Logout Link */}
              {authState?.user !== null && (
                <li>
                  <button
                    className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none"
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                  >
                    Logout
                    <svg
                      className="fill-stroke text-black dark:text-white"
                      width={12}
                      height={12}
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 3L7.5 6L4.5 9"
                        stroke="currentColor"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              )}
            </ul>
          </div>
          {/* Cart and Wishlist Links */}
          <div className="h-full flex items-end">
            <ul className="flex flex-col space-y-8 bg-gray-50 w-full py-10 p-4 dark:bg-gray-800">
              <li>
                <Link
                  to="/cart"
                  className="dark:text-white text-gray-800 flex items-center space-x-2 hover:underline"
                  onClick={() => setShowMenu(false)}
                >
                  <img src={cartIcon} alt="cart" className="w-6 h-6" />
                  <p className="text-base">Cart</p>
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="dark:text-white text-gray-800 flex items-center space-x-2 hover:underline"
                  onClick={() => setShowMenu(false)}
                >
                  <img src={wishlist} alt="wishlist" className="w-6 h-6" />
                  <p className="text-base">Wishlist</p>
                </Link>
              </li>
              {/* Additional Links or User Actions can be added here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
