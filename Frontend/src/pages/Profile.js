// src/pages/Profile.jsx
import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

let profileSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),
  mobile: yup.number().required().positive().integer("Mobile No is Required"),
});

const Profile = () => {
  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const userState = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State để quản lý hiển thị modal
  const formik = useFormik({
    initialValues: {
      firstname: userState?.firstname || "",
      lastname: userState?.lastname || "",
      email: userState?.email || "",
      mobile: userState?.mobile || "",
    },
    validationSchema: profileSchema,
    enableReinitialize: true, // Đảm bảo form được cập nhật khi userState thay đổi
    onSubmit: (values) => {
      dispatch(updateProfile({ data: values, config2: config2 }));
      setEdit(true);
    },
  });

  const handleLogout = () => {
    // Xóa chỉ thông tin người dùng
    localStorage.removeItem("customer");
    // Điều hướng đến trang đăng nhập
    navigate("/login"); // Thay đổi đường dẫn tùy theo cấu trúc router của bạn
  };

  return (
    <>
      <BreadCrumb title="My Profile" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="flex justify-between items-center">
              <h3 className="my-3 text-xl font-semibold">Update Profile</h3>
              <FiEdit className="text-2xl cursor-pointer" onClick={() => setEdit(false)} />
            </div>
          </div>
          <div className="col-12">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  disabled={edit}
                  value={formik.values.firstname}
                  onChange={formik.handleChange("firstname")}
                  onBlur={formik.handleBlur("firstname")}
                  className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                    formik.touched.firstname && formik.errors.firstname
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md ${
                    edit ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
                {formik.touched.firstname && formik.errors.firstname && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.firstname}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  disabled={edit}
                  value={formik.values.lastname}
                  onChange={formik.handleChange("lastname")}
                  onBlur={formik.handleBlur("lastname")}
                  className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                    formik.touched.lastname && formik.errors.lastname
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md ${
                    edit ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.lastname}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  disabled={edit}
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md ${
                    edit ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile No
                </label>
                <input
                  type="number"
                  name="mobile"
                  id="mobile"
                  disabled={edit}
                  value={formik.values.mobile}
                  onChange={formik.handleChange("mobile")}
                  onBlur={formik.handleBlur("mobile")}
                  className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                    formik.touched.mobile && formik.errors.mobile
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md ${
                    edit ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.mobile}</p>
                )}
              </div>

              {!edit && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Save
                </button>
              )}
            </form>
          </div>
          {/* Thêm Nút Logout ở đây */}
          <div className="col-12 mt-6">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>

            {/* Hộp thoại xác nhận đăng xuất */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Confirm Logout</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to logout?</p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { handleLogout(); setShowLogoutConfirm(false); }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Profile;
