import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Cloudinary Cloud Name
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, // API Key
    api_secret: process.env.CLOUDINARY_API_SECRET, // API Secret (không cần trên client-side)
});

export default cloudinary;
