/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port : '',
                pathname: '/**',
                search: '',
            }
        ]
    }
};

export default nextConfig;
