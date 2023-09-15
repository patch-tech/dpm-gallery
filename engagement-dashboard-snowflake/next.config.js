/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        config.resolve.symlinks = false;
        return config;
    }
}

module.exports = nextConfig
