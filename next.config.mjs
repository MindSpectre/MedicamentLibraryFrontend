/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
    experimental: {
        appDir: true, // Enable app directory features if applicable
    },
    typescript: {
        ignoreBuildErrors: true, // Ignore TypeScript errors during build
    },
    eslint: {
        ignoreDuringBuilds: true, // Ignore ESLint errors during build
    },
};

