const path = require('path');
const webpack = require('webpack');
const address = require('address');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const createThemeColorReplacerPlugin = require('./plugin.config');
const { name } = require('./package');

const needHost = address.ip() || 'localhost';

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL,
  devServer: {
    // host: needHost,
    open: true, // process.platform === 'win32'
    port: 8080,
    hot: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  outputDir: 'site',
  css: {
    extract: process.env.NODE_ENV == 'production',
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      less: {
        additionalData: `@import "~@/assets/less/var.less";`,
        lessOptions: {
          modifyVars: {
            // 'primary-color': '#1890ff',
            // 'link-color': '#1DA57A',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  chainWebpack: config => {
    config.resolve.alias
      .set('COMPONENTS', resolve('src/components'))
      .set('VIEWS', resolve('src/views'))
      .set('REQUEST', resolve('src/request'))
      .set('ASSETS', resolve('src/assets'))
      .set('UTILS', resolve('src/utils'));

    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        // other modules
        introJs: ['intro.js'],
      },
    ]);

    /* config.module
			.rule("images")
			.use("image-webpack-loader")
			.loader("image-webpack-loader")
			.options({
				bypassOnDebug: true
			})
			.end(); */
  },
  configureWebpack: () => ({
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
    performance: {
      // 关闭webpack性能提示，主要用在打包时
      hints: false,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c|le)ss$/,
            chunks: 'all',
            enforce: true,
          },
          runtimeChunk: {
            name: 'manifest',
          },
        },
      },
    },
    plugins: [
      createThemeColorReplacerPlugin(),
      // new CompressionWebpackPlugin({
      // 	filename: '[path].gz[query]',
      // 	algorithm: 'gzip',
      // 	test: /\.js$|\.html$|\.json$|\.css/,
      // 	threshold: 0, // 只有大小大于该值的资源会被处理
      // 	minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      // 	deleteOriginalAssets: true // 删除原文件
      // })
    ],
  }),
};
