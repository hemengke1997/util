import readline from 'readline'
import path from 'path'
import type { WatchOptions } from 'chokidar'
import { watch } from 'chokidar'
import type { Options } from 'tsup'
import { build } from './build'
import { LoggerFactory } from './utils/log'
import { debouncePromise, slash } from './utils'
import { getAllDepsHash } from './utils/load'

function resolveChokidarOptions(options: WatchOptions | undefined): WatchOptions {
  const { ignored = [], ...otherOptions } = options ?? {}

  const resolvedWatchOptions: WatchOptions = {
    ignored: [
      '**/.git/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/__tests__/**',
      'scripts/**',
      '**/*.md',
      '**/*.d.ts',
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

function clearScreen() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}

export async function dev(tsup: Options = {}, chokidar?: WatchOptions) {
  const logger = new LoggerFactory(tsup?.name)

  const resolvedWatchOptions = resolveChokidarOptions({
    disableGlobbing: true,
    ...chokidar,
  })

  let depsHash = await getAllDepsHash(process.cwd())

  async function bundle(opts?: Options) {
    try {
      await build(
        {
          dts: false,
          ...tsup,
          ...opts,
        },
        true,
      )
    } catch {}
  }

  let previousFile: string
  let n = 0
  async function onBundle(f: string) {
    try {
      await bundle({
        silent: true,
        async onSuccess() {
          clearScreen()
          logger.info(
            new Date().toLocaleTimeString(),
            `✅ Update success: ${f}`,
            previousFile === f ? `(✖️  ${++n})` : (n = 0) || '',
          )
          previousFile = f
        },
      })
    } catch {}
  }

  const debouncedBundle = debouncePromise((filePath: string) => {
    return onBundle(filePath)
  }, 100)

  const startWatcher = async () => {
    const watcher = watch('.', resolvedWatchOptions)

    watcher.on('all', async (_, file) => {
      file = slash(file)

      let shouldSkipChange = false

      if (file === 'package.json') {
        const currentHash = await getAllDepsHash(process.cwd())
        shouldSkipChange = currentHash === depsHash
        depsHash = currentHash
      }

      if (shouldSkipChange) {
        return
      }

      debouncedBundle(path.join(process.cwd(), file))
    })
  }

  bundle({
    async onSuccess() {
      clearScreen()
      logger.info(process.cwd(), 'Watching for changes...')
    },
  })

  startWatcher()
}
