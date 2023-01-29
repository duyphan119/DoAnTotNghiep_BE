import cloudinary from "cloudinary";
require("dotenv").config();
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const getCloudinary = () => {
  cloudinary.v2.config({
    api_key: API_KEY,
    api_secret: API_SECRET,
    cloud_name: CLOUD_NAME,
  });
  return cloudinary;
};
