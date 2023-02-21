import path from 'path'
import type { WatchOptions } from 'chokidar'
import { watch } from 'chokidar'
import type { Options } from 'tsup'
import { build } from './build'

function resolveChokidarOptions(options: WatchOptions | undefined): WatchOptions {
  const { ignored = [], ...otherOptions } = options ?? {}

  const resolvedWatchOptions: WatchOptions = {
    ignored: [
      '**/.git/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/CHANGELOG.md',
      ...(Array.isArray(ignored) ? ignored : [ignored]),
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ...otherOptions,
  }

  return resolvedWatchOptions
}

interface DevOptions {
  tsup: Options
  chokidar: WatchOptions
}

export async function dev(options?: DevOptions) {
  const root = process.cwd()
  const { chokidar, tsup } = options || {}

  const resolvedWatchOptions = resolveChokidarOptions({
    disableGlobbing: true,
    ...chokidar,
  })

  const watcher = watch(path.resolve(path.join(root, 'src')), resolvedWatchOptions)

  await build(tsup)

  watcher.on('change', () => {
    build()
  })

  watcher.on('add', () => {
    build()
  })

  watcher.on('unlink', () => {
    build()
  })
}
