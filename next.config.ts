import type { NextConfig } from 'next';
<<<<<<< HEAD

const nextConfig: NextConfig = {
  reactStrictMode: true,
=======
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
};

export default nextConfig;
