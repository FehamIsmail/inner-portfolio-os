const nextConfig = {
  allowedDevOrigins: ["192.168.2.10"],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [{ loader: "@svgr/webpack", options: { icon: true } }],
        as: "*.js",
      },
    },
  },
  images: {
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
