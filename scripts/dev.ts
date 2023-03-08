import path from 'path'
import readline from 'readline'
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

function logInfo(filePath: string) {
  console.log(
    `${picocolors.dim(new Date().toLocaleTimeString())} ${picocolors.blue('update =>')} ${picocolors.cyan(filePath)}`,
  )
}

function clearScreen() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
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
      clearScreen()
      console.log(picocolors.blue('Build Success 👍\nWatching for change...'))
    },
  })

  async function onBundle(f: string) {
    await bundle({
      silent: true,
      async onSuccess() {
        logInfo(f)
      },
    })
  }

  watcher.on('change', async (f) => {
    await onBundle(f)
  })

  watcher.on('add', async (f) => {
    await onBundle(f)
  })

  watcher.on('unlink', async (f) => {
    await onBundle(f)
  })
}
