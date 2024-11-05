// src/pages/Profile.jsx

import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

let profileSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email should be valid"),
  mobile: yup
    .string()
    .required("Mobile No is Required")
    .matches(/^[0-9]+$/, "Must be only digits"),
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
  const navigate = useNavigate();
  const userState = useSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: userState?.firstname || "",
      lastname: userState?.lastname || "",
      email: userState?.email || "",
      mobile: userState?.mobile || "",
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateProfile({ data: values, config2: config2 }));
      setEdit(true);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("customer");
    navigate("/login");
  };

  return (
    <>
      <div className="h-full bg-gradient-to-tl w-full py-16 px-4">
        <div className="flex flex-col items-center justify-center">
          {/* You can include a logo or image here similar to the Login page */}
          <div className="bg-white shadow rounded lg:w-1/3 md:w-1/2 w-full p-10 mt-14">
            <div className="flex justify-between items-center mb-6">
              <p className="text-2xl font-extrabold leading-6 text-gray-800">
                Update Profile
              </p>
              <FiEdit
                className="text-2xl cursor-pointer"
                onClick={() => setEdit(false)}
              />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none text-gray-800">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    disabled={edit}
                    value={formik.values.firstname}
                    onChange={formik.handleChange("firstname")}
                    onBlur={formik.handleBlur("firstname")}
                    className={`${
                      edit ? "bg-gray-100" : "bg-white"
                    } border ${
                      formik.touched.firstname && formik.errors.firstname
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none text-sm leading-none text-gray-800 py-3 w-full pl-3 mt-2`}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.firstname}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none text-gray-800">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    disabled={edit}
                    value={formik.values.lastname}
                    onChange={formik.handleChange("lastname")}
                    onBlur={formik.handleBlur("lastname")}
                    className={`${
                      edit ? "bg-gray-100" : "bg-white"
                    } border ${
                      formik.touched.lastname && formik.errors.lastname
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none text-sm leading-none text-gray-800 py-3 w-full pl-3 mt-2`}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.lastname}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    disabled={edit}
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    className={`${
                      edit ? "bg-gray-100" : "bg-white"
                    } border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none text-sm leading-none text-gray-800 py-3 w-full pl-3 mt-2`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium leading-none text-gray-800">
                    Mobile No
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    disabled={edit}
                    value={formik.values.mobile}
                    onChange={formik.handleChange("mobile")}
                    onBlur={formik.handleBlur("mobile")}
                    className={`${
                      edit ? "bg-gray-100" : "bg-white"
                    } border ${
                      formik.touched.mobile && formik.errors.mobile
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none text-sm leading-none text-gray-800 py-3 w-full pl-3 mt-2`}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.mobile}
                    </p>
                  )}
                </div>

                {!edit && (
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Logout Button */}
            <div className="mt-8">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="focus:ring-2 focus:ring-offset-2 focus:ring-red-700 text-sm font-semibold leading-none text-white focus:outline-none bg-red-600 border rounded hover:bg-red-700 py-4 w-full"
              >
                Logout
              </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Confirm Logout
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to logout?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowLogoutConfirm(false);
                      }}
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
      </div>
    </>
  );
};

export default Profile;
