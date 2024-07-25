import path from 'path';

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify")
        }
      }
    }
  }
};
