import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const uploadImg = async (data) => {
  // Ensure you're sending FormData
  const formData = new FormData();
  data.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axios.post(`${base_url}upload/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
  return response.data;
};

const deleteImg = async (id) => {
  const response = await axios.delete(
    `${base_url}upload/delete-img/${id}`,
    config
  );
  return response.data;
};

const uploadService = {
  uploadImg,
  deleteImg,
};

export default uploadService;
