// productService.js

import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const getProducts = async (data) => {
  const response = await axios.get(
    `${base_url}product?${data?.brand ? `brand=${data.brand}&` : ""}${
      data?.tag ? `tags=${data.tag}&` : ""
    }${data?.category ? `category=${data.category}&` : ""}${
      data?.minPrice ? `price[gte]=${data.minPrice}&` : ""
    }${data?.maxPrice ? `price[lte]=${data.maxPrice}&` : ""}${
      data?.sort ? `sort=${data.sort}&` : ""
    }`
  );

  return response.data;
};

const getSingleProduct = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`);
  return response.data;
};

const addToWishlist = async (prodId) => {
  const response = await axios.put(
    `${base_url}product/wishlist`,
    { prodId },
    config
  );
  return response.data;
};

const rateProduct = async (data) => {
  const response = await axios.put(`${base_url}product/rating`, data, config);
  return response.data;
};

export const productService = {
  getProducts,
  addToWishlist,
  getSingleProduct,
  rateProduct,
};
