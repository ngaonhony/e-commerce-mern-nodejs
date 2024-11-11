// src/components/ProductGrid.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { addToWishlist } from "../features/products/productSlice";

const ProductGrid = ({ tag, title }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productState = useSelector((state) => state?.product?.product);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const addToWish = (id) => {
        dispatch(addToWishlist(id));
    };

    return (
        <div className="2xl:container 2xl:mx-auto mb-20">
            <div className="bg-gray-50 text-center lg:py-10 md:py-8 py-6">
                <p className="w-10/12 mx-auto md:w-full font-semibold lg:text-4xl text-3xl lg:leading-9 md:leading-7 leading-9 text-center text-gray-800">
                    {title}
                </p>
            </div>
            <div className="py-6 lg:px-20 md:px-6 px-4">
                <hr className="w-full bg-gray-200 my-6" />
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-y-12 lg:gap-x-8 sm:gap-y-10 sm:gap-x-6 gap-y-6 lg:mt-12 mt-10">
                    {productState &&
                        productState.map((item, index) => {
                            if (item.tags === tag) {
                                return (
                                    <div key={index} className="relative">

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
                                        <p className="font-normal text-xl leading-5 text-gray-800 md:mt-6 mt-4">
                                            {item?.brand}
                                        </p>
                                        <p className="font-normal text-lg leading-5 text-gray-600 mt-2">
                                            {item?.title?.length > 50
                                                ? item?.title.substr(0, 50) + "..."
                                                : item?.title}
                                        </p>
                                        {/* Ratings */}
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
                                );
                            } else {
                                return null;
                            }
                        })}
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;
