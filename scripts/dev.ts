import path from 'path'
import type { WatchOptions } from 'chokidar'
import { watch } from 'chokidar'
import type { Options } from 'tsup'
import picocolors from 'picocolors'
import { build } from './build'

function resolveChokidarOptions(options: WatchOptions | undefined): WatchOptions {
  const { ignored = [], ...otherOptions } = options ?? {}

  const resolvedWatchOptions: WatchOptions = {
    ignored: [
      '**/.git/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/CHANGELOG.md',
      '**/__tests__/**',
      '**/*.spec.*',
      '**/*.test.*',
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

  async function bundle(opts?: Options) {
    try {
      await build({
        ...tsup,
        ...opts,
      })
    } catch {}
  }

  bundle({
    async onSuccess() {
      console.log(picocolors.blue('build success 👍'))
    },
  })

  watcher.on('change', async (f) => {
    await bundle({
      silent: true,
      async onSuccess() {
        console.log(picocolors.blue('file changed ==>'), picocolors.cyan(f))
      },
    })
  })

  watcher.on('add', async (f) => {
    await bundle({
      silent: true,
      async onSuccess() {
        console.log(picocolors.blue('file added ==>'), picocolors.cyan(f))
      },
    })
  })

  watcher.on('unlink', async (f) => {
    await bundle({
      silent: true,
      async onSuccess() {
        console.log(picocolors.blue('file unlinked ==>'), picocolors.cyan(f))
      },
    })
  })
}
