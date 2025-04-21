// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // You can add MDX options here
  },
});

module.exports = withMDX({
  // Append the default extensions with mdx
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
