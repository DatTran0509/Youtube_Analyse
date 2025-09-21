import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadScreenshotToCloudinary = async (buffer, analysisId, format = 'png') => {
    try {
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                resource_type: 'image',
                folder: 'youtube-analysis/screenshots',
                public_id: `screenshot_${analysisId}`,
                format: format,
                width: 1280,
                height: 720,
                crop: 'fill'
            };

            if (format === 'jpg' || format === 'jpeg') {
                uploadOptions.quality = 'auto:good';
            }

            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        throw Error('Cloudinary upload failed');
                    } else {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                    }
                }
            ).end(buffer);
        });
        
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

export const deleteScreenshotFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
};