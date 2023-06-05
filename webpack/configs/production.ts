import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'
import merge from 'webpack-merge'

import { EPath } from '../data'
import { baseConfig } from './base'

export default merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [path.join(process.cwd(), EPath.Static)]
    })
  ]
})
