import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const localFilePath = req.file.path;
        const uploadResponse = await uploadOnCloudinary(localFilePath);

        if (!uploadResponse) {
            return res.status(500).json({ success: false, message: "Failed to upload image to cloud" });
        }

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ success: false, message: "Server error during upload" });
    }
};
