const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: result.secure_url,
      asset_id: result.asset_id,
      public_id: result.public_id,
    };
  } catch (error) {
    throw error;
  }
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  try {
    const result = await cloudinary.uploader.destroy(fileToDelete, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
