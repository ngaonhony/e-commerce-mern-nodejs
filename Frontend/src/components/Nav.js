import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import SearchIcon from "../assets/icons/SearchIcon";
import UserIcon from "../assets/icons/UserIcon";
import FavouritesIcon from "../assets/icons/FavouritesIcon";
import CartIcon from "../assets/icons/CartIcon";
import Logo from "../assets/icons/Logo";
import MenuIcon from "../assets/icons/MenuIcon";
import CloseIcon from "../assets/icons/CloseIcon";
import DropdownArrowIcon from "../assets/icons/DropdownArrowIcon";
import WishlistIcon from "../assets/icons/WishlistIcon";
import CartBottomIcon from "../assets/icons/CartBottomIcon";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import { getAProduct } from "../features/products/productSlice";
import { getUserCart } from "../features/user/userSlice";
import "react-bootstrap-typeahead/css/Typeahead.css";

export default function Nav() {
  const [searchInput, setSearchInput] = useState(true);
  const [mdOptionsToggle, setMdOptionsToggle] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [total, setTotal] = useState(null);
  const [paginate, setPaginate] = useState(true);
  const productState = useSelector((state) => state?.product?.product);
  const navigate = useNavigate();

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

  // Fixed useEffect: Removed config2 from dependency array
  useEffect(() => {
    dispatch(getUserCart(config2));
  }, [dispatch]);

  const [productOpt, setProductOpt] = useState([]);
  useEffect(() => {
    let sum = 0;
    let items = cartState?.length || 0; // Count distinct items only
    for (let index = 0; index < cartState?.length; index++) {
      sum += Number(cartState[index].quantity) * cartState[index].price;
    }
    setTotal(sum);
    setTotalItems(items); // Update totalItems state with distinct items count
  }, [cartState]);


  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?._id, name: element?.title });
    }
    setProductOpt(data);
  }, [productState]);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  const handleLinkClick = () => {
    setShowMenu(false);
  };

  return (
    <div className="dark:bg-gray-900">
      <div>
        <div className="relative z-50">
          {/* For md screen size */}
          <div
            id="md-searchbar"
            className={`${
              mdOptionsToggle ? "hidden" : "flex"
            } bg-white dark:bg-gray-900 lg:hidden py-5 px-6 items-center justify-between`}
          >
            <div className="flex items-center space-x-3 text-gray-800 dark:text-white">
              <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
                <Typeahead
                  id="pagination-example"
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
                  className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                />
                <span className="input-group-text flex items-center px-3 py-1.5 text-center whitespace-nowrap text-gray-800 bg-transparent border border-solid border-gray-300 rounded-r-md">
                  <SearchIcon
                    className="fill-stroke"
                    width={20}
                    height={20}
                  />
                </span>
              </div>
            </div>
            <div className="space-x-6 items-center flex justify-center">
              <Link to="/wishlist">
                <FavouritesIcon width={24} height={24} />
              </Link>
              <Link to={authState?.user === null ? "/login" : "/my-profile"}>
                <UserIcon width={24} height={24} />
              </Link>
              <Link to="/cart" className="relative">
                <CartBottomIcon
                  className="fill-stroke"
                  width={24}
                  height={24}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
          {/* For md screen size */}
          {/* For large screens */}
          <div className="dark:bg-gray-900 bg-gray-50 px-6 py-9">
            <div className="container mx-auto flex items-center justify-between">
              <h1
                className="md:w-2/12 cursor-pointer text-gray-800 dark:text-white"
                aria-label="the Crib."
              >
                <Link to="/">
                  <Logo className="fill-stroke" width={93} height={19} />
                </Link>
              </h1>
              <ul className="hidden w-8/12 md:flex items-center justify-center space-x-8">
                <li>
                  <Link
                    to="/"
                    className="dark:text-white text-base text-gray-800 hover:underline focus:outline-none"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product"
                    className="dark:text-white text-base text-gray-800 hover:underline focus:outline-none"
                  >
                    Store
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-orders"
                    className="dark:text-white text-base text-gray-800 hover:underline focus:outline-none"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="dark:text-white text-base text-gray-800 hover:underline focus:outline-none"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="dark:text-white text-base text-gray-800 hover:underline focus:outline-none"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
              <div className="md:w-2/6 justify-end flex items-center space-x-4 xl:space-x-8">
                <div className="hidden lg:flex items-center">
                  <button
                    onClick={() => setSearchInput(!searchInput)}
                    aria-label="search items"
                    className="text-gray-800 dark:hover:text-gray-300 dark:text-white focus:outline-none"
                  >
                    <SearchIcon
                      className="fill-stroke"
                      width={24}
                      height={24}
                    />
                  </button>

                  <Typeahead
                    id="pagination-example"
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
                    className={`${
                      searchInput ? "hidden" : ""
                    } text-sm dark:bg-gray-900 dark:placeholder-gray-300 text-gray-600 rounded ml-1 focus:outline-none px-1`}
                  />
                </div>
                <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
                  <Link to="/wishlist">
                    <FavouritesIcon
                      className="fill-stroke"
                      width={28}
                      height={28}
                    />
                  </Link>
                  <Link
                    to={authState?.user === null ? "/login" : "/my-profile"}
                  >
                    <UserIcon
                      className="fill-stroke"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Link to="/cart" className="relative">
                    <CartBottomIcon
                      className="fill-stroke"
                      width={24}
                      height={24}
                    />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="flex lg:hidden">
                  <button
                    aria-label="show options"
                    onClick={() => setMdOptionsToggle(!mdOptionsToggle)}
                    className="text-black dark:text-white dark:hover:text-gray-300 hidden md:flex focus:outline-none rounded"
                  >
                    <MenuIcon
                      className="fill-stroke"
                      width={24}
                      height={24}
                    />
                  </button>
                  <button
                    aria-label="open menu"
                    onClick={() => setShowMenu(true)}
                    className="text-black dark:text-white dark:hover:text-gray-300 md:hidden focus:outline-none rounded"
                  >
                    <MenuIcon
                      className="fill-stroke"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>
            {/* For small screen */}
            <div
              id="mobile-menu"
              className={`${
                showMenu ? "flex" : "hidden"
              } absolute dark:bg-gray-900 z-10 inset-0 md:hidden bg-white flex-col h-screen w-full`}
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 p-4">
                <div className="flex items-center space-x-3">
                  <div className="input-group relative flex flex-wrap items-stretch w-full mb-4">
                    <div className="input-group">
                      <Typeahead
                        id="pagination-example"
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
                      />
                      <span className="input-group-text p-3" id="basic-addon2">
                        <SearchIcon
                          className="fill-stroke"
                          width={20}
                          height={20}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowMenu(false)}
                  aria-label="close menu"
                  className="focus:outline-none rounded"
                >
                  <CloseIcon
                    className="fill-stroke text-gray-800 dark:text-white"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
              <div className="mt-6 p-4">
                <ul className="flex flex-col space-y-6">
                  <li>
                    <Link
                      to="/"
                      className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none"
                      onClick={handleLinkClick}
                    >
                      Home
                      <DropdownArrowIcon
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/product"
                      className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none"
                      onClick={handleLinkClick}
                    >
                      Store
                      <DropdownArrowIcon
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-orders"
                      className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none"
                      onClick={handleLinkClick}
                    >
                      Orders
                      <DropdownArrowIcon
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blogs"
                      className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none"
                      onClick={handleLinkClick}
                    >
                      Blogs
                      <DropdownArrowIcon
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="dark:text-white flex items-center justify-between hover:underline text-base text-gray-800 focus:outline-none"
                      onClick={handleLinkClick}
                    >
                      Contact
                      <DropdownArrowIcon
                        className="fill-stroke text-black dark:text-white"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="h-full flex items-end">
                <ul className="flex flex-col space-y-8 bg-gray-50 w-full py-10 p-4 dark:bg-gray-800">
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/cart"
                      className="dark:text-white text-gray-800 flex items-center space-x-2 hover:underline focus:outline-none relative"
                    >
                      <CartBottomIcon
                        className="fill-stroke"
                        width={22}
                        height={22}
                      />
                      <p className="text-base">Cart</p>
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to={authState?.user === null ? "/login" : "/my-profile"}
                      className="dark:text-white text-gray-800 flex items-center space-x-2 hover:underline focus:outline-none"
                    >
                      <UserIcon
                        className="fill-stroke"
                        width={24}
                        height={24}
                      />
                      <p className="text-base">Account</p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      to="/wishlist"
                      className="dark:text-white text-gray-800 flex items-center space-x-2 hover:underline focus:outline-none"
                    >
                      <WishlistIcon
                        className="fill-stroke"
                        width={20}
                        height={20}
                      />
                      <p className="text-base">Wishlist</p>
                    </Link>
                  </li>
                  {/* Logout button */}
                  {authState?.user !== null && (
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          handleLinkClick();
                        }}
                        className="dark:text-white text-gray-800 flex items-center space-x-2 hover:underline focus:outline-none w-full text-left"
                      >
                        <p className="text-base">Logout</p>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* For large screens */}
        </div>
      </div>
    </div>
  );
}
