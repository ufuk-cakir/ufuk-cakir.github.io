const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'development' ? '' : '/ufuk-cakir.github.io',
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : '/ufuk-cakir.github.io/',
}

module.exports = nextConfig

