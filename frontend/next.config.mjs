/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['res.cloudinary.com'], // Thêm "res.cloudinary.com" vào danh sách domain hợp lệ
    },
};

export default nextConfig;
