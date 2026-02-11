import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File uploaded successfully
        fs.unlinkSync(localFilePath); // Remove locally saved temp file
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove locally saved temp file as upload failed
        return null;
    }
}

export { uploadOnCloudinary };
