import { type Plugin } from 'vite'
import compressPlugin from 'vite-plugin-compression'

export interface CompressOptions {
  compress?: 'gzip' | 'brotli' | 'none'
  deleteOriginFile?: boolean
}

export function compress(options?: CompressOptions): Plugin | Plugin[] {
  const { compress, deleteOriginFile } = options || {}

  const compressList = compress?.split(',')

  const plugins: Plugin[] = []

  if (compressList?.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      }),
    )
  }

  if (compressList?.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    )
  }
  return plugins
}
