// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;
// Configuration
cloudinary.config({
  cloud_name: "dyra7qgdb",
  api_key: "562881924769971",
  api_secret: "DRsEUSwc4TBQXVHIel8RzqR9Ib8", // Click 'View Credentials' below to copy your API secret
});

module.exports = cloudinary;
