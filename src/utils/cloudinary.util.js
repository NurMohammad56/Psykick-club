import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { promises as fsPromises } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload on Cloudinary method
const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    console.error("No file provided for upload");
    return null;
  }

  try {
    if (!fs.existsSync(localFilePath)) {
      console.error("File not found on local path:", localFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Auto-detected type of the uploaded file
    });

    // Check if the response contains a URL
    if (response?.url) {
      try {
        // Delete local file after successful upload
        await fsPromises.unlink(localFilePath);
      } catch (deleteError) {
        console.error("Error deleting local file:", deleteError.message);
      }
      return response;
    } else {
      console.error("No URL found in the Cloudinary response");
      try {
        // Delete local file if Cloudinary upload fails
        await fsPromises.unlink(localFilePath);
      } catch (deleteError) {
        console.error(
          "Error deleting local file after failure:",
          deleteError.message
        );
      }
      return null;
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    try {
      // Delete local file if upload fails
      await fsPromises.unlink(localFilePath);
    } catch (deleteError) {
      console.error(
        "Error deleting local file after upload failure:",
        deleteError.message
      );
    }
    return null;
  }
};

export { uploadOnCloudinary };
