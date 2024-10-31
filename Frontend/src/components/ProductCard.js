// src/components/ProductCard.jsx
import React from "react";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ grid, data }) => {
  const navigate = useNavigate();
  
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
        } sm:grid-cols-2 grid-cols-1 gap-6 lg:gap-y-12 lg:gap-x-8 sm:gap-y-10 sm:gap-x-6 gap-y-6 `}
      >
        {data?.map((item, index) => (
          <div key={index} className="relative group">

            {/* Product Image */}
            <div className="relative group">
              <div className="flex justify-center items-center opacity-0 bg-gradient-to-t from-black via-black to-opacity-30 group-hover:opacity-50 absolute top-0 left-0 h-full w-full"></div>
              <img
                className="w-full object-cover"
                src={item?.images[0]?.url}
                alt={item?.title}
                onClick={() => navigate("/product/" + item?._id)}
                style={{ cursor: "pointer", height: "400px", width: "400px" }}
              />
              <div className="absolute bottom-0 p-8 w-full opacity-0 group-hover:opacity-100">
                <button
                  className="bg-transparent font-medium text-base leading-4 border-2 border-white py-3 w-full mt-2 text-white"
                  onClick={() => navigate("/product/" + item?._id)}
                >
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details mt-4 ml-2">
              <h5 className="font-normal text-xl leading-5 text-gray-800">
                {grid === 12 || grid === 6
                  ? item?.title
                  : item?.title?.length > 50
                  ? item?.title.substr(0, 50) + "..."
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
                Price {item?.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
