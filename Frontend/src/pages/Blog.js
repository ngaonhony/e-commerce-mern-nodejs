import React, { useEffect } from "react";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";

const Blog = () => {
  const blogState = useSelector((state) => state?.blog?.blog);

  const dispatch = useDispatch();
  useEffect(() => {
    getblogs();
  }, []);
  const getblogs = () => {
    dispatch(getAllBlogs());
  };

  return (
    <>
      <Meta title={"Blogs"} />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="flex flex-col md:flex-col w-full justify-center items-center">
          <div className=" col-12 md:w-3/5 mb-4 md:mb-0 flex items-center justify-center">
            <div className="filter-card p-2 rounded-lg shadow-lg w-full justify-center items-center">
              <h3 className="filter-title">Find By Categories</h3>
              <div>
                <ul className="ps-0">
                  <li>Watch</li>
                  <li>Tv</li>
                  <li>Camera</li>
                  <li>Laptop</li>
                </ul>
              </div>
            </div>
          </div>
        <div className="col-12 md:w-3/5 flex items-center justify-center rounded-lg shadow-lg">
            <div className="row w-full">
              {blogState &&
                blogState?.map((item, index) => {
                  return (
                    <div className="col-12 lg:w-full lg:h-1/5 lg:p-1" key={index}>
                      <BlogCard
                        id={item?._id}
                        title={item?.title}
                        description={item?.description}
                        image={item?.images[0]?.url}
                        date={moment(item?.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blog;

