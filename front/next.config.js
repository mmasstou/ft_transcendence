/** @type {import('next').NextConfig} */
const nextConfig = {};

// next.config.js
module.exports = {
    webpack(config) {
      config.infrastructureLogging = { debug: /PackFileCache/ }
      return config;
    }
  }
module.exports = {
    images: {
        domains: ['images.unsplash.com', 'cdn.intra.42.fr'],
    },
}