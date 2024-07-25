
module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "stream": false,
          "fs": false
        }
      }
    }
  }
};
