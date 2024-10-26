import React, { useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";

import wish from "../images/wish.svg";
// import wishlist from "../images/wishlist.svg";
// import watch from "../images/watch.jpg";
// import watch2 from "../images/watch-1.avif";
// import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useState } from "react";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { grid, data } = props;
  const dispatch = useDispatch();
  console.log(data);
  const location = useLocation();


  return (
    <div className="2xl:container 2xl:mx-auto">
      <div className="grid lg:grid-cols-4 sm:grid-cols-5 grid-cols-1 lg:gap-y-16 lg:gap-x-12 sm:gap-y-12 sm:gap-x-8 gap-y-8  p-8 ">
        {data?.map((item, index) => {
          return (
            <div key={index} className="relative group product-item p-4 ">
              {/* Hình ảnh sản phẩm */}
              <div className="relative group overflow-hidden h-[300px] w-full "> 
                {/* Hình ảnh sản phẩm */}
                <img
                  className=""
                  src={item?.images[0]?.url}
                  alt="product image"
                  onClick={() => navigate("/product/" + item?._id)}
                />
              </div>
    
              {/* Thông tin sản phẩm */}
              <div className="product-details mt-4">
                <h5 className="font-normal text-xl leading-5 text-gray-800 md:mt-6 mt-4">
                  {grid === 12 || grid === 6 ? item?.title : item?.title?.substr(0, 80) + "..."}
                </h5>
                <ReactStars
                  count={5}
                  size={24}
                  value={item?.totalrating}
                  edit={false}
                  activeColor="#ffd700"
                />
                <p className="font-semibold text-xl leading-5 text-gray-800 mt-4">Rs.{item?.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );  
};

export default ProductCard;
