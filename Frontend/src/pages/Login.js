import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { auth, provider, signInWithPopup } from "../firebase/firebaseConfig";

let loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),

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

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    },
  });

  // const handleGoogleLogin = () => signInWithPopup(auth, provider)
  // .then((response) => {
  //   console.log(response);
  // })
  // .catch((error) => {
  //   console.log(error)
  // })

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      // console.log(idToken);

      // Gửi idToken lên server để xác thực và lưu trữ
      const response = await fetch("http://localhost:5000/api/user/loginGG", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Thông tin người dùng từ server:", data);
      localStorage.setItem("accessToken", data.accessToken);
      console.log("Đăng nhập thành công");
      navigate("/"); // Điều hướng về trang chủ sau khi đăng nhập thành công
    } catch (error) {
      console.error("Đăng nhập với Google thất bại:", error);
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
      <BreadCrumb title="Login" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Login</h3>
              <form
                action=""
                onSubmit={formik.handleSubmit}
                className="d-flex flex-column gap-15"
              >
                <CustomInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <div className="error">
                  {formik.touched.email && formik.errors.email}
                </div>
                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                />
                <div className="error">
                  {formik.touched.password && formik.errors.password}
                </div>
                <div>
                  <Link to="/forgot-password">Forgot Password?</Link>

                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0" type="submit">
                      Login
                    </button>
                    <Link to="/signup" className="button signup">
                      SignUp
                    </Link>
                  </div>
                </div>
              </form>
              <div className="mt-3 flex justify-center">
                <button
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                  onClick={handleGoogleLogin}
                >
                  <img
                    height={20}
                    width={20}
                    src="https://th.bing.com/th/id/R.ad34078a2230ebc6f473eb86fd590b0a?rik=87VVUreGE1qfsg&pid=ImgRaw&r=0"
                    alt="Google"
                    className="h-5 w-5"
                  />
                  Đăng nhập với Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
