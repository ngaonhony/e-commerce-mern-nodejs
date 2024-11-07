import React, { useEffect } from "react";
import Meta from "../components/Meta";
import BlogItem from "../components/BlogItem";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs, getCategories } from "../features/blogs/blogSlice";

const Blog = () => {
    const dispatch = useDispatch();
    const blogState = useSelector((state) => state?.blog?.blog);
    const categories = useSelector((state) => state?.blog?.categories);

    useEffect(() => {
        dispatch(getAllBlogs());
        dispatch(getCategories());
    }, [dispatch]);

    return (
        <>
            <Meta title={"Blogs"} />
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                <div className="flex flex-col md:flex-row w-full justify-center items-start gap-8">
                    {/* Left Column - Categories */}
                    <div className="w-full md:w-2/5 p-4 shadow-lg rounded-lg bg-white">
                      <h3 className="filter-title text-lg font-semibold mb-4">
                          Find By Categories
                      </h3>
                      <ul className="list-none">
                          {categories?.map((category) => (
                              <li
                                  key={category.id}
                                  className="py-2 px-4 rounded-lg text-gray-700 cursor-pointer hover:text-blue-600 hover:bg-gray-100 transition duration-200 ease-in-out"
                              >
                                  <span className="flex items-center">
                                      <span className="mr-2 text-black"></span>
                                      {category.title}
                                  </span>
                              </li>
                          ))}
                      </ul>
                    </div>


                    {/* Right Column - Blogs */}
                    <div className="w-full md:w-3/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blogState &&
                                blogState.map((item, index) => (
                                    <BlogItem
                                        key={item._id || index}
                                        item={item}  // Pass the entire item as prop to BlogItem
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default Blog;
