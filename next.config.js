module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Verifica mudanças a cada 1 segundo
        aggregateTimeout: 300,
        ignored: ["**/.next/**", "**/node_modules/**"]
      };
    }
    return config;
  }
};