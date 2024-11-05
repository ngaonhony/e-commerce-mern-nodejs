// src/pages/Login.js

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../components/Meta";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { auth, provider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

let loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Email should be valid"),
  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Send idToken to the server for verification and storage
      const response = await fetch("http://localhost:5000/api/user/loginGG", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  useEffect(() => {
    if (authState.user !== null && authState.isError === false) {
      window.location.href = "/";
    }
  }, [authState]);

  return (
    <>
      <Meta title={"Login"} />

      <div className="h-full w-full px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white shadow rounded lg:w-1/3 md:w-1/2 w-full p-10 mb-10 mt-20">
            <p
              tabIndex={0}
              role="heading"
              aria-label="Login to your account"
              className="text-2xl font-extrabold leading-6 text-gray-800"
            >
              Login to your account
            </p>
            <p className="text-sm mt-4 font-medium leading-none text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer"
              >
                Sign up here
              </Link>
            </p>

            <button
              aria-label="Continue with Google"
              role="button"
              onClick={handleGoogleLogin}
              className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
            >
              <img
                height={20}
                width={20}
                src="https://th.bing.com/th/id/R.ad34078a2230ebc6f473eb86fd590b0a?rik=87VVUreGE1qfsg&pid=ImgRaw&r=0"
                alt="Google"
                className="h-5 w-5"
              />
              <p className="text-base font-medium ml-4 text-gray-700">
                Continue with Google
              </p>
            </button>

            <div className="w-full flex items-center justify-between py-5">
              <hr className="w-full bg-gray-400" />
              <p className="text-base font-medium leading-4 px-2.5 text-gray-400">
                OR
              </p>
              <hr className="w-full bg-gray-400" />
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div>
                <label className="text-sm font-medium leading-none text-gray-800">
                  Email
                </label>
                <input
                  aria-label="Enter email address"
                  role="input"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                />
                <div className="text-red-600 text-xs mt-1">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>

              <div className="mt-6 w-full">
                <label className="text-sm font-medium leading-none text-gray-800">
                  Password
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    aria-label="Enter Password"
                    role="input"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                  />
                  {/* Password visibility toggle icon (optional) */}
                  <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                    {/* SVG icon */}
                  </div>
                </div>
                <div className="text-red-600 text-xs mt-1">
                  {formik.touched.password && formik.errors.password}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  role="button"
                  aria-label="Login to your account"
                  className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full"
                >
                  Login
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium leading-none text-gray-500"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
