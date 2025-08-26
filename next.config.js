/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'mbnadpygrnushzotoncf.supabase.co', // <-- Add your Supabase project domain here
    ],
  },
};

module.exports = nextConfig;