import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import BlogItem from "./BlogItem";

const BlogGrid = ({ title }) => {
    const dispatch = useDispatch();
    const blogState = useSelector((state) => state?.blog?.blog);

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);

    return (
        <div className="2xl:mx-auto 2xl:container lg:py-16 lg:px-40 xl:px-20 md:py-12 md:px-6 py-9 px-4">
            <div className="bg-gray-50 text-center lg:py-10 md:py-8 py-6">
                <p className="w-10/12 mx-auto md:w-full font-semibold lg:text-4xl text-3xl lg:leading-9 md:leading-7 leading-9 text-center text-gray-800">
                    {title}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 lg:gap-x-8 md:gap-6 gap-4 lg:mt-12 md:mt-9 mt-6">
                {blogState &&
                    blogState.slice(0, 3).map((item, index) => (
                        <BlogItem key={item?._id || index} item={item} />
                    ))}
            </div>
        </div>
    );
};

export default BlogGrid;
