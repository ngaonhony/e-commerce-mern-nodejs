import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  createBlogs,
  getABlog,
  resetState,
  updateABlog,
} from "../features/blogs/blogSlice";
import { getCategories } from "../features/bcategory/bcategorySlice";

// Định nghĩa schema cho việc xác thực form
let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  category: yup.string().required("Category is Required"),
  images: yup
    .array()
    .min(1, "At least one image is required")
    .required("Images are required"),
});

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3]; // Lấy ID của blog từ đường dẫn
  const imgState = useSelector((state) => state?.upload?.images); // Trạng thái ảnh đã upload
  const bCatState = useSelector((state) => state.bCategory.bCategories); // Danh sách category
  const blogState = useSelector((state) => state.blogs); // Trạng thái blog
  const [isUploading, setIsUploading] = useState(false); // Trạng thái upload ảnh

  const {
    isSuccess,
    isError,
    isLoading,
    createdBlog,
    blogName,
    blogDesc,
    blogCategory,
    blogImages,
    updatedBlog,
  } = blogState;

  // Lấy blog khi ID đã được cung cấp
  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
    } else {
      dispatch(resetState());
    }
  }, [getBlogId]);

  // Lấy danh sách category
  useEffect(() => {
    dispatch(getCategories());
    return () => dispatch(resetState()); // Đảm bảo reset khi unmount
  }, []);

  // Hiển thị thông báo khi tạo hoặc cập nhật blog thành công
  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!");
      dispatch(resetState()); // Reset trạng thái sau khi thành công
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog Updated Successfully!");
      navigate("/admin/blog-list"); // Chuyển hướng về danh sách blog
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading, createdBlog, updatedBlog]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogName || "",
      description: blogDesc || "",
      category: blogCategory || "",
      images: blogImages || [],
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBlogId !== undefined) {
        const data = { id: getBlogId, blogData: values };
        dispatch(updateABlog(data));
      } else {
        dispatch(createBlogs(values));
        formik.resetForm(); // Reset form sau khi tạo mới
        setTimeout(() => {
          dispatch(resetState());
        }, 3000);
      }
    },
  });

  // Cập nhật giá trị images trong formik khi ảnh đã được upload
  useEffect(() => {
    if (imgState && imgState.length > 0) {
      const imagesArray = imgState.map((img) => ({
        public_id: img.public_id,
        url: img.url,
      }));
      formik.setFieldValue("images", imagesArray);
    }
  }, [imgState]);

  const handleImageUpload = (acceptedFiles) => {
    setIsUploading(true);
    dispatch(uploadImg(acceptedFiles)).then(() => {
      setIsUploading(false);
    });
  };

  const imgShow = formik.values.images;

  return (
    <div>
      <h3 className="mb-4 title">
        {getBlogId !== undefined ? "Edit" : "Add"} Blog
      </h3>

      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-4">
            <CustomInput
              type="text"
              label="Enter Blog Title"
              name="title"
              i_id="blogTitle"
              i_class=""
              val={formik.values.title}
              onChng={formik.handleChange("title")}
              onBlr={formik.handleBlur("title")}
            />
          </div>
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>

          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mt-3"
          >
            <option value="">Select Blog Category</option>
            {bCatState.map((i, j) => (
              <option key={j} value={i.title}>
                {i.title}
              </option>
            ))}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>

          <ReactQuill
            theme="snow"
            className="mt-3"
            name="description"
            onChange={formik.handleChange("description")}
            value={formik.values.description}
          />
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>

          <div className="bg-white border-1 p-5 text-center">
            <Dropzone onDrop={handleImageUpload}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="error">
            {formik.touched.images && formik.errors.images}
          </div>

          <div className="showimages d-flex flex-wrap gap-3">
            {imgShow?.map((image, index) => (
              <div className="position-relative" key={index}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(delImg(image.public_id));
                    const updatedImages = formik.values.images.filter(
                      (img) => img.public_id !== image.public_id
                    );
                    formik.setFieldValue("images", updatedImages);
                  }}
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img src={image.url} alt="" width={200} height={200} />
              </div>
            ))}
          </div>

          <button
            className="btn btn-black border-0 rounded-3 my-5"
            type="submit"
          >
            {getBlogId !== undefined ? "Edit" : "Add"} Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
