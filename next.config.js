/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns : [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            }
        ],
        domains: ['firebasestorage.googleapis.com'],
    }
}

module.exports = nextConfig
