import path from 'path'
import { Configuration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import merge from 'webpack-merge'

import { EPath } from '../data'
import { baseConfig } from './base'

const config: Configuration & {
  devServer: WebpackDevServerConfiguration
} = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    watchFiles: [path.join(EPath.Src, '**/*.css')],
    static: EPath.Static,
    open: true,
    hot: false
  }
}

export default merge(baseConfig, config)
