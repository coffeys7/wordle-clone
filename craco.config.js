const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@stylesheets': path.resolve(__dirname, 'src/stylesheets'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@utilities': path.resolve(__dirname, 'src/utilities'),
      '@images': path.resolve(__dirname, 'src/images')
    }
  }
};