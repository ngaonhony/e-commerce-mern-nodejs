import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { BiPhoneCall, BiInfoCircle } from "react-icons/bi";
import Container from "../components/Container";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { createQuery } from "../features/contact/contactSlice";

let contactSchema = yup.object({
  name: yup.string().required("First Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),
  mobile: yup.number().required().positive().integer("Mobile No is Required"),
  comment: yup.string().required("Message are Required"),
});

const Contact = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      comment: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values) => {
      dispatch(createQuery(values));
    },
  });

  return (
    <>
      <Meta title={"Contact Us"} />
      <BreadCrumb title="Contact Us" />
      <Container class1="contact-wrapper wide-container home-wrapper-2 bg-white">
        <div className="container mx-auto wide-container">
          <div className="lg:flex">
            {/* Sidebar Contact Info */}
            <div className="xl:w-2/4 lg:w-2/5 bg-neutral-400 py-16 xl:rounded-bl rounded-tl rounded-tr xl:rounded-tr-none">
              <div className="xl:w-5/6 xl:px-0 px-8 mx-auto">
                <h1 className="xl:text-4xl text-3xl pb-4 text-white font-bold">Get in Touch</h1>
                <p className="text-xl text-white pb-8 leading-relaxed font-normal lg:pr-4">
                  Got a question? Reach out to us anytime, and we’ll happily answer your inquiries.
                </p>
                <div className="flex pb-4 items-center">
                  <BiPhoneCall className="fs-5 text-white" />
                  <p className="pl-4 text-white text-base">
                    <a href="tel:+91 8264954234">+91 8264954234</a>
                  </p>
                </div>
                <div className="flex items-center">
                  <AiOutlineMail className="fs-5 text-white" />
                  <p className="pl-4 text-white text-base">
                    <a href="mailto:devjariwala8444@gmail.com">devjariwala8444@gmail.com</a>
                  </p>
                </div>
                <p className="text-lg text-white pt-10 tracking-wide">
                  Hno: Daiict college, Reliance Cross Rd, <br />
                  Gandhinagar, Gujarat, 382007
                </p>
                <p className="text-white pt-16 font-bold tracking-wide">
                  Monday – Friday 10 AM – 8 PM
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="xl:w-3/5 lg:w-3/5 bg-gray-200 h-full pt-5 pb-5 xl:pr-5 xl:pl-0 rounded-tr rounded-br">
              <form
                id="contact"
                onSubmit={formik.handleSubmit}
                className="bg-white py-4 px-8 rounded-tr rounded-br"
              >
                <h1 className="text-4xl text-gray-800 font-extrabold mb-6">Enter Details</h1>
                
                {/* Name Field */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="name"
                    className="text-gray-800 text-sm font-semibold leading-tight tracking-normal mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    required
                    id="name"
                    name="name"
                    type="text"
                    className="focus:outline-none focus:border-indigo-700 font-normal w-full h-10 pl-3 text-sm border-gray-300 rounded border"
                    placeholder="Name"
                    onChange={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                    value={formik.values.name}
                  />
                  <div className="error text-red-500 text-xs mt-1">
                    {formik.touched.name && formik.errors.name}
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="email"
                    className="text-gray-800 text-sm font-semibold leading-tight tracking-normal mb-2"
                  >
                    Email
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    className="focus:outline-none focus:border-neutral-500 font-normal w-full h-10 pl-3 text-sm border-gray-300 rounded border"
                    placeholder="Email"
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    value={formik.values.email}
                  />
                  <div className="error text-red-500 text-xs mt-1">
                    {formik.touched.email && formik.errors.email}
                  </div>
                </div>

                {/* Mobile Field */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="mobile"
                    className="text-gray-800 text-sm font-semibold leading-tight tracking-normal mb-2"
                  >
                    Mobile Number
                  </label>
                  <input
                    required
                    id="mobile"
                    name="mobile"
                    type="tel"
                    className="focus:outline-none focus:border-indigo-700 font-normal w-full h-10 pl-3 text-sm border-gray-300 rounded border"
                    placeholder="Mobile Number"
                    onChange={formik.handleChange("mobile")}
                    onBlur={formik.handleBlur("mobile")}
                    value={formik.values.mobile}
                  />
                  <div className="error text-red-500 text-xs mt-1">
                    {formik.touched.mobile && formik.errors.mobile}
                  </div>
                </div>

                {/* Comments Field */}
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="comment"
                    className="text-gray-800 text-sm font-semibold leading-tight tracking-normal mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    className="border-gray-300 border rounded py-2 text-sm outline-none resize-none px-3 focus:border-indigo-700"
                    rows="4"
                    placeholder="Message"
                    onChange={formik.handleChange("comment")}
                    onBlur={formik.handleBlur("comment")}
                    value={formik.values.comment}
                  />
                  <div className="error text-red-500 text-xs mt-1">
                    {formik.touched.comment && formik.errors.comment}
                  </div>
                </div>

                <button
                  type="submit"
                  className="focus:outline-none bg-neutral-600 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm leading-6"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Contact;
