const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@styles': path.resolve(__dirname, 'src/rootStyles'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@features': path.resolve(__dirname, 'src/features'),
    },
  },
};

