import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadScreenshotToCloudinary = async (buffer, analysisId, format = 'png') => {
    try {
        console.log('☁️ Uploading screenshot to Cloudinary...');
        console.log('📊 Cloudinary config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Found' : 'Missing',
            api_key: process.env.CLOUDINARY_API_KEY ? 'Found' : 'Missing',
            api_secret: process.env.CLOUDINARY_API_SECRET ? 'Found' : 'Missing'
        });
        
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                resource_type: 'image',
                folder: 'youtube-analysis/screenshots',
                public_id: `screenshot_${analysisId}`,
                format: format, // png or jpg
                width: 1280,
                height: 720,
                crop: 'fill'
            };

            // Add quality only for JPEG
            if (format === 'jpg' || format === 'jpeg') {
                uploadOptions.quality = 'auto:good';
            }

            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('❌ Cloudinary upload failed:', error);
                        // Return fallback instead of throwing
                        resolve({
                            url: `/api/media/fallback-screenshot`,
                            publicId: null
                        });
                    } else {
                        console.log('✅ Screenshot uploaded to Cloudinary:', result.secure_url);
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                    }
                }
            ).end(buffer);
        });
        
    } catch (error) {
        console.error('❌ Cloudinary service error:', error);
        // Return fallback URL instead of throwing
        return {
            url: `/api/media/fallback-screenshot`,
            publicId: null
        };
    }
};

export const deleteScreenshotFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('🗑️ Screenshot deleted from Cloudinary:', publicId);
        return result;
    } catch (error) {
        console.error('❌ Failed to delete from Cloudinary:', error);
        throw error;
    }
};