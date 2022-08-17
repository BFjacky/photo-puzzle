const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    // index_vao: path.resolve(__dirname, './src/renderer/index/index_vao.js'),
    // index_2d: path.resolve(__dirname, './src/renderer/index/index_2d.js'),
    photoPuzzle: path.resolve(__dirname, './src/painter/index/photoPuzzle.js'),
  },
  output: {
    path: path.resolve(__dirname, 'output'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'photoPuzzle.html',
      template: './src/index.html',
      chunks: ['photoPuzzle'],
    }),
  ],
  devServer: {
    port: 3001,
    compress: true, // enable gzip compression
    // historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    // noInfo: true, // only errors & warns on hot reload
    // ...
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    // minimizer: [
    //   new UglifyJSPlugin({
    //     cache: true,
    //     parallel: true,
    //     uglifyOptions: {
    //       safari10: true,
    //     },
    //   }),
    // ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity, // 入口点的最大并行请求数
      minChunks: 1,
      minSize: 0, // 生成块的最小大小（以字节为单位
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packages = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)(.*?)([\\/]|$)/,
            )
            let packageName = packages[1]
            packageName =
              packageName === '@fenbi'
                ? `${packageName}_${packages[3]}`
                : 'common'
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `${packageName.replace('@', '')}`
          },
        },
      },
    },
  },
}
