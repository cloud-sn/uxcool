const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const configFn = require('./dev.js');
const { getRoot } = require('../utils');

const root = getRoot();
// const distRoot = path.resolve(root, 'examples/dist');
const distRoot = path.resolve(root);

function buildConfig(config) {
  return merge(config, {
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
      contentBase: [distRoot, path.resolve(distRoot, 'examples/dist')],
      hot: true,
      noInfo: true,
      stats: 'errors-only',
      open: true,
      openPage: 'index.html',
      host: '0.0.0.0',
      public: 'localhost:8080',
      proxy: {
        '/upload': {
          target: 'http://localhost/jQuery-File-Upload/server/php/',
          changeOrigin: true,
          secure: false,
          pathRewrite: { '^/upload': '' },
          // target: 'http://dip.cnsuning.com:80/service/2698/1.0.0',
        },
      },
    },
    devtool: '#sourcemap',
  });
}
module.exports = configFn({ server: true }).then(buildConfig);
