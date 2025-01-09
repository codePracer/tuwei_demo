const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = [
  // 客户端配置
  {
    entry: './client/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.client.js',
      publicPath: '/public/'
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.json$/, // 匹配所有 .json 文件
          type: 'asset/resource', // 采用 Webpack 5 自带的资源模块处理 JSON 文件
          generator: {
            filename: 'assets/[name].[hash][ext]', // 输出路径和文件名
          },
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /.*\.(js|css|html|json)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              }
            }
          }
        ]
      })
    ]
  },

  // 服务器端配置
  {
    entry: './server/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.server.js'
    },
    target: 'node',
    externals: [webpackNodeExternals()],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    }
  }
];
