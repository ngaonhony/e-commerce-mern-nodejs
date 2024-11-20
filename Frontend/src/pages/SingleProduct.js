import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  addRating,
  getAProduct,
  getAllProducts,
  addToWishlist,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import { addProdToCart, getUserCart } from "../features/user/userSlice";
import Color from "../components/Color";

const SingleProduct = () => {
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product.singleproduct);
  const productsState = useSelector((state) => state.product.product);
  const cartState = useSelector((state) => state.auth.cartProducts);
  const wishlistState = useSelector((state) => state.product.wishlist);
  const userState = useSelector((state) => state.auth.user);

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    dispatch(getAProduct(getProductId));
    dispatch(getUserCart());
    dispatch(getAllProducts());
  }, [dispatch, getProductId]);

  useEffect(() => {
    if (cartState) {
      const productInCart = cartState.find(
        (item) => item.productId._id === getProductId
      );
      setAlreadyAdded(!!productInCart);
    }
  }, [cartState, getProductId]);

  useEffect(() => {
    if (wishlistState && userState) {
      const isProductInWishlist = wishlistState.find(
        (item) => item._id === getProductId
      );
      setIsWishlisted(!!isProductInWishlist);
    }
  }, [wishlistState, getProductId, userState]);

  useEffect(() => {
    if (productState && productState.color && productState.color.length > 0) {
      if (!color) {
        setColor(productState.color[0]._id);
      }
    }
  }, [productState, color]);

  const handleWishlist = (id) => {
    dispatch(addToWishlist(id));
    setIsWishlisted(!isWishlisted);
  };

  const uploadCart = () => {
    if (color === null) {
      toast.error("Please choose a color");
    } else {
      dispatch(
        addProdToCart({
          productId: productState._id,
          quantity,
          color,
          price: productState.price,
        })
      );
      navigate("/cart");
    }
  };

  const [star, setStar] = useState(null);
  const [comment, setComment] = useState("");

  const addRatingToProduct = () => {
    if (star === null) {
      toast.error("Please add a star rating");
      return;
    }
    if (comment.trim() === "") {
      toast.error("Please write a review about the product");
      return;
    }
    dispatch(addRating({ star, comment, prodId: getProductId })).then(() => {
      dispatch(getAProduct(getProductId));
      // Reset review form
      setStar(null);
      setComment("");
    });
  };

  const [expandedReviews, setExpandedReviews] = useState({});

  const toggleReview = (index) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      {/* Meta and BreadCrumb components */}
      <Meta title={productState?.title || "Product"} />
      <BreadCrumb title={productState?.title || "Product"} />

      {/* Product Details */}
      <Container className="main-product-wrapper bg-white py-5 home-wrapper-2">
        {/* Product images and details */}
        <div className="row flex-row-reverse h-full">
          {/* Images */}
          <div className="col-12 col-md-6 flex rounded-[10px] h-full bg-white lg:flex-row flex-col">
            {/* Main Image */}
            <div className="main-product-image rounded-none lg:h-full flex-1 h-2/3">
              <div>
                <img
                  src={
                    productState?.images?.[0]?.url ||
                    "https://via.placeholder.com/600"
                  }
                  alt="Product"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            {/* Thumbnail Images */}
            <div className="d-flex flex-wrap gap-15 py-[12px] bg-white rounded-none">
              {productState?.images?.slice(0, 4).map((item, index) => (
                <div key={index}>
                  <img
                    src={item?.url}
                    className="lg:h-1/3 object-cover lg:p-2 lg:w-[150px] w-1/3 px-[20px]"
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Details */}
          <div className="col-12 col-md-6 h-full">
            <div className="main-product-details h-full">
              {/* Title */}
              <div className="border-bottom">
                <h3 className="title">{productState?.title}</h3>
              </div>
              {/* Price and Rating */}
              <div className="border-bottom py-3">
                <p className="price">Rs. {productState?.price}/-</p>
                <div className="d-flex align-items-center gap-10">
                  <ReactStars
                    count={5}
                    size={24}
                    value={productState?.totalrating || 0}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className="mb-0 t-review">
                    ({productState?.ratings?.length || 0} Reviews)
                  </p>
                </div>
                <a className="review-btn" href="#review">
                  Write a Review
                </a>
              </div>
              {/* Product Info */}
              <div className="py-3">
                {/* Type */}
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Type:</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>
                {/* Brand */}
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Brand:</h3>
                  <p className="product-data">{productState?.brand}</p>
                </div>
                {/* Tags */}
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Tags:</h3>
                  <p className="product-data">{productState?.tags}</p>
                </div>
                {/* Availability */}
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Availability:</h3>
                  <p className="product-data">
                    {productState?.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
                {/* Color Selection */}
                {alreadyAdded === false &&
                  productState?.color &&
                  productState.color.length > 0 && (
                    <div className="d-flex gap-10 flex-column mt-2 mb-3">
                      <h3 className="product-heading">Color:</h3>
                      <Color
                        setColor={setColor}
                        colorData={productState?.color}
                        selectedColor={color}
                      />
                    </div>
                  )}
                {/* Quantity and Add to Cart */}
                <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                  <h3 className="product-heading">Quantity:</h3>
                  {alreadyAdded === false && (
                    <div>
                      <input
                        type="number"
                        min={1}
                        max={productState?.quantity || 10}
                        className="form-control"
                        style={{ width: "70px" }}
                        value={quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (
                            val > 0 &&
                            val <= (productState?.quantity || 10)
                          ) {
                            setQuantity(val);
                          }
                        }}
                      />
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-30">
                    <button
                      className="button border-0"
                      type="button"
                      onClick={() => {
                        alreadyAdded ? navigate("/cart") : uploadCart();
                      }}
                      disabled={productState?.quantity === 0}
                    >
                      {alreadyAdded ? "Go to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
                {/* Wishlist Icon */}
                <div className="d-flex align-items-center gap-15">
                  <div>
                    {isWishlisted ? (
                      <AiFillHeart
                        className="fs-5 me-2 text-danger"
                        onClick={() => handleWishlist(getProductId)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <AiOutlineHeart
                        className="fs-5 me-2"
                        onClick={() => handleWishlist(getProductId)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                </div>
                {/* Shipping Info */}
                <div className="d-flex gap-10 flex-column my-3">
                  <h3 className="product-heading">Shipping & Returns:</h3>
                  <p className="product-data">
                    Free shipping and returns available on all orders!
                    <br />
                    We ship all India domestic orders within{" "}
                    <b>5-10 business days!</b>
                  </p>
                </div>
                {/* Product Link */}
                <div className="d-flex gap-10 align-items-center my-3">
                  <h3 className="product-heading">Product Link:</h3>
                  <a
                    href="#!"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Product link copied to clipboard");
                    }}
                  >
                    Copy Product Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Description */}
      <Container class1="description-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h4>Description</h4>
            <div className="bg-white p-3">
              <p
                dangerouslySetInnerHTML={{
                  __html: productState?.description || "",
                }}
              ></p>
            </div>
          </div>
        </div>
      </Container>

      {/* Reviews */}
      <Container class1="reviews-wrapper home-wrapper-2" id="review">
        <div className="row">
          <div className="col-12">
            <h3>Reviews</h3>
            <div className="review-inner-wrapper">
              {/* Review Form */}
              <div className="review-form py-4">
                <h4>Write a Review</h4>
                <div>
                  <ReactStars
                    count={5}
                    size={24}
                    value={star}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(newRating) => setStar(newRating)}
                  />
                </div>
                <div className="mt-3">
                  <textarea
                    className="w-100 form-control"
                    cols="30"
                    rows="4"
                    placeholder="Comments"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    onClick={addRatingToProduct}
                    className="button border-0"
                    type="button"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
              {/* Existing Reviews */}
              <div className="flex flex-col justify-start items-start w-full space-y-8">
                {productState?.ratings?.map((item, index) => (
                  <div
                    key={index}
                    className="w-full flex justify-start items-start flex-col bg-gray-50 p-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between w-full">
                      <div className="flex flex-row justify-between items-start">
                        <p className="text-xl md:text-2xl font-medium leading-normal text-gray-800">
                          {item?.title || "Review"}
                        </p>
                        <button
                          onClick={() => toggleReview(index)}
                          className="ml-4 md:hidden"
                        >
                          <svg
                            className={
                              "transform " +
                              (expandedReviews[index] ? "rotate-180" : "rotate-0")
                            }
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 12.5L10 7.5L5 12.5"
                              stroke="#1F2937"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="cursor-pointer mt-2 md:mt-0">
                        <ReactStars
                          count={5}
                          size={24}
                          value={item?.star}
                          edit={false}
                          activeColor="#ffd700"
                        />
                      </div>
                    </div>
                    <div
                      className={
                        "md:block " +
                        (expandedReviews[index] ? "block" : "hidden")
                      }
                    >
                      <p className="mt-3 text-base leading-normal text-gray-600 w-full md:w-9/12 xl:w-5/6">
                        {item?.comment}
                      </p>
                      {/* Reviewer Info */}
                      <div className="mt-6 flex justify-start items-center flex-row space-x-2.5">
                        <div>
                          <img
                            src={item?.postedby?.avatar || "default-avatar.png"}
                            alt="user-avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                        <div className="flex flex-col justify-start items-start space-y-2">
                          <p className="text-base font-medium leading-none text-gray-800">
                            {item?.postedby?.firstname || "User"}
                          </p>
                          <p className="text-sm leading-none text-gray-600">
                            {new Date(item?.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {productState?.ratings?.length === 0 && (
                  <p className="mt-3 text-base leading-normal text-gray-600">
                    No reviews yet. Be the first to write a review!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Popular Products */}
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Popular Products</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard
            data={productsState.filter((p) => p.tags === "popular")}
          />
        </div>
      </Container>
    </>
  );
};

export default SingleProduct;
