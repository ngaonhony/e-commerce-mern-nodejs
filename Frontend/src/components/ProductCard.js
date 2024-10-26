// src/components/ProductCard.jsx
import React from "react";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import wish from "../images/wish.svg";

const ProductCard = ({ grid, data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToWish = (id) => {
    dispatch(addToWishlist(id));
  };

  return (
    <div className="2xl:container 2xl:mx-auto">
      <div
        className={`grid ${
          grid === 12
            ? "lg:grid-cols-1"
            : grid === 6
            ? "lg:grid-cols-2"
            : grid === 4
            ? "lg:grid-cols-3"
            : "lg:grid-cols-4"
        } sm:grid-cols-2 grid-cols-1 gap-6 p-8`}
      >
        {data?.map((item, index) => (
          <div key={index} className="relative group p-4">
            {/* Wishlist Icon */}
            <div className="absolute top-2 right-2">
              <button
                className="border-0 bg-transparent"
                onClick={() => addToWish(item?._id)}
              >
                <img src={wish} alt="wishlist" />
              </button>
            </div>
            {/* Product Image */}
            <div
              className="relative group overflow-hidden h-[300px] w-full cursor-pointer"
              onClick={() => navigate("/product/" + item?._id)}
            >
              <img
                className="w-full h-full object-cover"
                src={item?.images[0]?.url}
                alt={item?.title}
              />
            </div>
            {/* Product Details */}
            <div className="product-details mt-4">
              <h5 className="font-normal text-xl leading-5 text-gray-800">
                {grid === 12 || grid === 6
                  ? item?.title
                  : item?.title?.length > 80
                  ? item?.title.substr(0, 80) + "..."
                  : item?.title}
              </h5>
              <div className="mt-2">
                <ReactStars
                  count={5}
                  size={20}
                  value={parseFloat(item?.totalrating) || 0}
                  edit={false}
                  activeColor="#ffd700"
                />
              </div>
              <p className="font-semibold text-xl leading-5 text-gray-800 mt-4">
                Rs. {item?.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
