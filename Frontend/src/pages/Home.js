// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useDispatch, } from "react-redux";
import { getAllProducts } from "../features/products/productSlice";
import Banner1 from "../banners/Banner1";
import ProductGrid from "../components/ProductGrid";
import BlogGrid from "../components/BlogGrid";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);


  return (
    <>
      <Banner1 />
      <ProductGrid tag="featured" title="Featured Collection" />
      <ProductGrid tag="popular" title="Popular Collection" />
      <BlogGrid title="Latest Blogs" />
    </>
  );
};

export default Home;
