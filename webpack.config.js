const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const target = process.env.TARGET || 'umd'

const styleLoader = {
  loader : 'style-loader',
  options: { insertAt: 'top' }
}

const fileLoader = {
  loader : 'file-loader',
  options: { name: 'static/[name].[ext]' }
}

const postcssLoader = {
  loader : 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer({ browsers: [ 'IE >= 9', 'last 2 versions', '> 1%' ] })
    ]
  }
}

const cssLoader = isLocal => ({
  loader : 'css-loader',
  options: {
    '-autoprefixer': true,
    importLoaders  : true,
    localIdentName : isLocal ? 'rstcustom__[local]' : null,
    modules        : true
  }
})

const config = {
  devtool: 'source-map',
  entry  : './index',
  module : {
    rules: [
      {
        exclude: path.join(__dirname, 'node_modules'),
        test   : /\.jsx?$/,
        use    : [ 'babel-loader' ]
      },
      {
        exclude: path.join(__dirname, 'node_modules'),
        test   : /\.scss$/,
        use    : [ styleLoader, cssLoader(true), postcssLoader, 'sass-loader' ]
      },
      {
        // Used for importing css from external modules (react-virtualized, etc.)
        test: /\.css$/,
        use : [ styleLoader, cssLoader(false), postcssLoader ]
      }
    ]
  },
  output: {
    filename     : '[name].js',
    library      : 'ReactSortableTreeThemeFileExplorer',
    libraryTarget: 'umd',
    path         : path.join(__dirname, 'dist')
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new webpack.optimize.OccurrenceOrderPlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: true,
    //   comments: true,
    //   compress: {
    //     warnings: false
    //   },
    //   mangle: false
    // })
  ]
}

switch (target) {
  case 'umd':
    config.optimization = {
      minimize: true
    }
    // Exclude library dependencies from the bundle
    config.externals = [
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        whitelist: [ /\.(?!(?:jsx?|json)$).{1,5}$/i ]
      })
    ]
    break
  case 'development':
    config.optimization = {
      minimize: false
    }
    config.devtool = 'eval'
    config.module.rules.push({
      exclude: path.join(__dirname, 'node_modules'),
      test   : /\.(jpe?g|png|gif|ico|svg)$/,
      use    : [ fileLoader ]
    })
    config.entry = [ 'react-hot-loader/patch', './demo/index' ]
    config.output = {
      filename: 'static/[name].js',
      path    : path.join(__dirname, 'build')
    }
    config.plugins = [
      new HtmlWebpackPlugin({
        inject  : true,
        template: './demo/index.html'
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      new webpack.NoEmitOnErrorsPlugin()
    ]
    config.devServer = {
      contentBase: path.join(__dirname, 'build'),
      port       : process.env.PORT || 3001,
      stats      : 'minimal'
    }

    break
  case 'demo':
    config.optimization = {
      minimize: true
    }
    config.module.rules.push({
      exclude: path.join(__dirname, 'node_modules'),
      test   : /\.(jpe?g|png|gif|ico|svg)$/,
      use    : [ fileLoader ]
    })
    config.entry = './demo/index'
    config.output = {
      filename: 'static/[name].js',
      path    : path.join(__dirname, 'build')
    }
    config.plugins = [
      new HtmlWebpackPlugin({
        inject  : true,
        template: './demo/index.html'
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]

    break
  default:
}

module.exports = config
