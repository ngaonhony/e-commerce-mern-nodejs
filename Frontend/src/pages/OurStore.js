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
  const dispatch = useDispatch();

  // Fetch the products array from the state
  const productState = useSelector((state) => state?.product?.product) || [];

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setminPrice] = useState(null);
  const [maxPrice, setmaxPrice] = useState(null);
  const [sort, setSort] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // This will hold the filtered and sorted products
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Update filters whenever productState changes
  useEffect(() => {
    let newBrands = [];
    let categoryList = [];
    let newTags = [];

    for (let index = 0; index < productState.length; index++) {
      const element = productState[index];
      newBrands.push(element.brand);
      categoryList.push(element.category);
      newTags.push(...element.tags); // Assuming tags is an array
    }
    setBrands([...new Set(newBrands)]);
    setCategories([...new Set(categoryList)]);
    setTags([...new Set(newTags)]);
  }, [productState]);

  // Apply filters, sorting, and pagination
  useEffect(() => {
    let filteredProducts = [...productState];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand === brand
      );
    }

    if (tag) {
      filteredProducts = filteredProducts.filter((product) =>
        product.tags.includes(tag)
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    // Apply sorting
    if (sort) {
      const sortKey = sort.replace("-", "");
      const sortOrder = sort.startsWith("-") ? -1 : 1;

      filteredProducts.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
        if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
        return 0;
      });
    }

    // Update total pages based on filtered products
    setTotalPages(Math.ceil(filteredProducts.length / pageSize));

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(
      startIndex,
      startIndex + pageSize
    );

    setDisplayProducts(paginatedProducts);
  }, [
    productState,
    category,
    brand,
    tag,
    minPrice,
    maxPrice,
    sort,
    currentPage,
    pageSize,
  ]);

  // Total number of pages for pagination
  const [totalPages, setTotalPages] = useState(
    Math.ceil(productState.length / pageSize)
  );

  // Reset current page when filters change
  const handleFilterChange = (filterFunction) => {
    filterFunction();
    setCurrentPage(1);
  };

  return (
    <>
      <Meta title={"Our Store"} />
      <Container class1="store-wrapper home-wrapper-2 py-5 min-vh-100">
        <div className="row gx-2 gy-4">
          {/* Sidebar Filters */}
          <div className="col-lg-3 col-md-4">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Shop By Categories</h3>
              <ul className="list-unstyled">
                <li onClick={() => handleFilterChange(() => setCategory(null))}>
                  <Link to="/product" className="text-muted">
                    All
                  </Link>
                </li>
                {categories.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleFilterChange(() => setCategory(item))}
                  >
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
                      onChange={(e) =>
                        handleFilterChange(() => setminPrice(e.target.value))
                      }
                    />
                    <label>From</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="To"
                      onChange={(e) =>
                        handleFilterChange(() => setmaxPrice(e.target.value))
                      }
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
                      onClick={() => handleFilterChange(() => setTag(item))}
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
                      onClick={() => handleFilterChange(() => setBrand(item))}
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
            <div className="filter-sort-grid mb-2">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
                  <p className="mb-0" style={{ width: "100px" }}>
                    Sort By:
                  </p>
                  <select
                    defaultValue={"manual"}
                    className="form-select"
                    onChange={(e) =>
                      handleFilterChange(() => setSort(e.target.value))
                    }
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
                    {displayProducts.length} Products
                  </p>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="products-list pb-5">
              <div className="d-flex gap-2 flex-wrap">
                <ProductCard data={displayProducts} grid={grid} />
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination d-flex justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    {/* Previous Button */}
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(totalPages, currentPage + 2)
                      )
                      .map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      ))}

                    {/* Next Button */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
