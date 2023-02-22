import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import { watch } from 'chokidar'
import pc from 'picocolors'
pc.green('watch ready!')

const __dirname = resolve(fileURLToPath(import.meta.url), '..')

async function dev_watch() {
  const watcher = watch(path.resolve(path.join(__dirname, '../packages')), {
    depth: 0,
    ignoreInitial: true,
    ignorePermissionErrors: true,
  })

  console.log('fdsafsd')

  pc.green('watch ready!')

  watcher.on('addDir', (p) => {
    pc.cyan(`dir added...: ${p}`)
    // copy direcotry
    const cwd = process.cwd()
    // cp(path.join(cwd, '../template'), ])
  })
}

// dev_watch()
