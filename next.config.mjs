const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        });
        return config;
    },
    images: {
        domains: ['localhost'],
    },
};

export default nextConfig;
