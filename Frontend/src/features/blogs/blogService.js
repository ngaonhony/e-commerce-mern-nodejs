import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const getBlogs = async () => {
  const response = await axios.get(`${base_url}api/blog`);
  if (response.data) {
    return response.data;
  }
};

const getBlog = async (id) => {
  const response = await axios.get(`${base_url}api/blog/${id}`);
  if (response.data) {
    return response.data;
  }
};

const getCategories = async () => {
  const response = await axios.get(`${base_url}api/blogcategory/`);
  if (response.data) {
    return response.data;
  }
};

export const blogService = {
  getBlogs,
  getBlog,
  getCategories,
};
