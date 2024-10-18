import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const uploadImg = async (data) => {
  const response = await axios.post(`${base_url}upload/`, data, {
    headers: {
      // Do not set 'Content-Type'; let axios handle it
      // Include authorization headers if needed
    },
  });
  return response.data;
};

const deleteImg = async (filename) => {
  const response = await axios.delete(`${base_url}upload/delete-img/${filename}`, {
    headers: {
      // Include authorization headers if needed
    },
  });
  return response.data;
};

export default {
  uploadImg,
  deleteImg,
};
