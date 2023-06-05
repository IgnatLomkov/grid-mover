import CopyPlugin from 'copy-webpack-plugin'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { Configuration } from 'webpack'

import { EPath } from '../data'

export const baseConfig: Configuration = {
  entry: path.join(process.cwd(), EPath.Src, EPath.EntryTS),
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ESLintWebpackPlugin({
      extensions: ['ts']
    }),
    new HtmlWebpackPlugin({
      filename: EPath.EntryHTML,
      template: path.join(EPath.Src, EPath.EntryHTML),
      scriptLoading: 'blocking'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: EPath.Src,
          filter: resourcePath => path.extname(resourcePath) === '.css'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  output: {
    filename: EPath.OutputEntryJS,
    path: path.join(process.cwd(), EPath.Build),
    clean: true
  }
}
