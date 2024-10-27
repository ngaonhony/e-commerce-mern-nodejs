import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/products/productSlice";
import { Link } from "react-router-dom";

const OurStore = () => {
  const [grid, setGrid] = useState(4);
  const productState = useSelector((state) => state?.product?.product);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setminPrice] = useState(null);
  const [maxPrice, setmaxPrice] = useState(null);
  const [sort, setSort] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    let newBrands = [];
    let category = [];
    let newtags = [];

    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      newBrands.push(element.brand);
      category.push(element.category);
      newtags.push(element.tags);
    }
    setBrands([...new Set(newBrands)]);
    setCategories([...new Set(category)]);
    setTags([...new Set(newtags)]);
  }, [productState]);

  useEffect(() => {
    getProducts();
  }, [sort, tag, brand, category, minPrice, maxPrice]);

  const getProducts = () => {
    dispatch(
      getAllProducts({ sort, tag, brand, category, minPrice, maxPrice })
    );
  };

  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container class1="store-wrapper home-wrapper-2 py-5 min-vh-100">
        <div className="row gx-2 gy-4">
          {/* Sidebar Filters */}
          <div className="col-lg-3 col-md-4">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Shop By Categories</h3>
              <ul className="list-unstyled">
                <li onClick={() => setCategory(null)}>
                  <Link to="/product" className="text-muted">
                    All
                  </Link>
                </li>
                {categories.map((item, index) => (
                  <li key={index} onClick={() => setCategory(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Filters */}
            <div className="filter-card mb-3">
              <h3 className="filter-title">Filter By</h3>
              <div>
                <h5 className="sub-title">Price</h5>
                <div className="d-flex align-items-center gap-2">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="From"
                      onChange={(e) => setminPrice(e.target.value)}
                    />
                    <label>From</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="To"
                      onChange={(e) => setmaxPrice(e.target.value)}
                    />
                    <label>To</label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 mb-3">
                <h5 className="sub-title">Product Tags</h5>
                <div className="d-flex flex-wrap gap-2">
                  {tags.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => setTag(item)}
                      className="badge bg-light text-secondary py-2 px-3"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mt-4 mb-3">
                <h5 className="sub-title">Product Brands</h5>
                <div className="d-flex flex-wrap gap-2">
                  {brands.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => setBrand(item)}
                      className="badge bg-light text-secondary py-2 px-3"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-lg-9 col-md-8">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
                  <p className="mb-0" style={{ width: "100px" }}>Sort By:</p>
                  <select
                    defaultValue={"manual"}
                    className="form-select"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="title">Alphabetically, A-Z</option>
                    <option value="-title">Alphabetically, Z-A</option>
                    <option value="price">Price, low to high</option>
                    <option value="-price">Price, high to low</option>
                    <option value="createdAt">Date, old to new</option>
                    <option value="-createdAt">Date, new to old</option>
                  </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <p className="totalproducts mb-0">
                    {productState?.length} Products
                  </p>
                  
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="products-list pb-5">
              <div className="d-flex gap-2 flex-wrap">
                <ProductCard data={productState || []} grid={grid} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
