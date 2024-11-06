import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { getuserProductWishlist } from "../features/user/userSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getuserProductWishlist());
  };

  const wishlistState = useSelector(
    (state) => state?.auth?.wishlist?.wishlist
  );

  const removeFromWishlist = (id) => {
    dispatch(addToWishlist(id));
    setTimeout(() => {
      dispatch(getuserProductWishlist());
    }, 300);
  };

  const toggleItem = (id) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <Meta title={"Wishlist"} />
      <Container class1="mx-auto container px-4 md:px-6 2xl:px-0 py-12">
        <div className="flex flex-col justify-start items-start">
          <div className="mt-4">
            <p className="text-2xl tracking-tight leading-6 text-gray-600">
              {wishlistState?.length || 0} items
            </p>
          </div>
          <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-y-0">
            {wishlistState && wishlistState.length === 0 && (
              <div className="text-center fs-3">No Data</div>
            )}
            {wishlistState &&
              wishlistState.map((item) => {
                return (
                  <div className="flex flex-col" key={item._id}>
                    <div className="relative">
                      <img
                        style={{ cursor: "pointer", height: "400px", width: "400px" }}
                        className="hidden lg:block object-cover "
                        src={
                          item?.images[0]?.url
                            ? item.images[0].url
                            : "images/default.png"
                        }
                        alt={item?.title}
                      />
                      <button
                        aria-label="close"
                        className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 absolute p-1.5 bg-gray-800 text-white hover:text-gray-400"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        <svg
                          className="fill-current"
                          width={14}
                          height={14}
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1L1 13"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1 1L13 13"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex justify-center items-center">
                        <p className="tracking-tight text-2xl font-semibold leading-6 text-gray-800">
                          {item?.title}
                        </p>
                      </div>
                      <div className="flex justify-center items-center">
                        <button
                          aria-label="show menu"
                          onClick={() => toggleItem(item._id)}
                          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-2.5 px-2 bg-gray-800 text-white hover:text-gray-400"
                        >
                          <svg
                            className={`fill-stroke ${expandedItems[item._id] ? "block" : "hidden"
                              }`}
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 5L5 1L1 5"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <svg
                            className={`fill-stroke ${expandedItems[item._id] ? "hidden" : "block"
                              }`}
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      id={`menu-${item._id}`}
                      className={`flex-col justify-start items-start mt-12 ${expandedItems[item._id] ? "flex" : "hidden"
                        }`}
                    >
                      <div>
                        <p className="tracking-tight text-xs leading-3 text-gray-800">
                          {item?.code || ""}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                          {item?.color || ""}
                        </p>
                      </div>
                      <div className="mt-6">
                        <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                          {item?.size || ""}
                        </p>
                      </div>
                      <div className="mt-6">
                        <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                          Rs. {item?.price}
                        </p>
                      </div>
                      <div className="flex justify-between flex-col lg:flex-row items-center mt-10 w-full space-y-4 lg:space-y-0 lg:space-x-4 xl:space-x-8">
                        <div className="w-full">
                          <button className="focus:outline-none focus:ring-gray-800 focus:ring-offset-2 focus:ring-2 text-gray-800 w-full tracking-tight py-4 text-lg leading-4 hover:bg-gray-300 hover:text-gray-800 bg-white border border-gray-800">
                            More information
                          </button>
                        </div>
                        <div className="w-full">
                          <button className="focus:outline-none focus:ring-gray-800 focus:ring-offset-2 focus:ring-2 text-white w-full tracking-tight py-4 text-lg leading-4 hover:bg-black bg-gray-800 border border-gray-800">
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Wishlist;
