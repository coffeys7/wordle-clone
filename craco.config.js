const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@stylesheets': path.resolve(__dirname, 'src/stylesheets')
    }
  },
  style: {
    postcss: {
      plugins: [
        require("tailwindcss")("./tailwind.config.js")
      ]
    }
  }
};