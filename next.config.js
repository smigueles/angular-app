// eslint-disable-next-line no-undef
module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.externals.push("environments/environment");
      }
      return config;
    },
  };
  