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

export async function dev(tsup?: Options, chokidar?: WatchOptions) {
  const root = process.cwd()

  const resolvedWatchOptions = resolveChokidarOptions({
    disableGlobbing: true,
    ...chokidar,
  })

  const watcher = watch(path.join(root, 'src'), resolvedWatchOptions)

  async function bundle() {
    try {
      await build({
        ...tsup,
      })
    } catch {}
  }

  bundle()

  watcher.on('change', async () => {
    await bundle()
  })

  watcher.on('add', async () => {
    await bundle()
  })

  watcher.on('unlink', async () => {
    await bundle()
  })
}
