// src/components/BlogItem.jsx

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const BlogItem = ({ item }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        gsap.set(overlayRef.current, { x: "-100%" });
    }, []);

    const handleMouseEnter = () => {
        gsap.to(overlayRef.current, {
            x: 0,
            duration: 0.5,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        gsap.to(overlayRef.current, {
            x: "-100%",
            duration: 0.5,
            ease: "power2.out",
        });
    };

    return (
        <div
            className="relative flex items-center justify-center h-[420px] overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={item?.images[0]?.url || "https://via.placeholder.com/400x300"}
                alt={item?.title}
                style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "100%" }}
            />
            <div
                ref={overlayRef}
                className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex flex-col justify-between items-center"
            >
                <div className="flex items-center justify-center flex-col h-full">
                    <h2 className="px-4 text-2xl font-semibold leading-normal text-center text-white">
                        {item?.title}
                    </h2>
                    <p
                        className="px-4 text-base leading-normal text-center text-white mt-4"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {item?.description}
                    </p>
                </div>
                <div className="px-12 pb-10 w-full">
                    <a
                        href={`/blog/${item?._id}`}
                        className="w-full inline-block text-center text-base font-medium leading-none text-gray-800 py-4 px-12 bg-white hover:bg-gray-300 transition duration-150"
                    >
                        Read more
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BlogItem;
