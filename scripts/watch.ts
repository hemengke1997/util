import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import { watch } from 'chokidar'
import pc from 'picocolors'

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

async function dev_watch() {
  const watcher = watch(path.resolve(path.join(__dirname, '../packages')), {
    depth: 0,
    ignoreInitial: true,
    ignorePermissionErrors: true,
  })

  watcher.on('ready', () => {
    console.log(pc.green('watch folder ready!'))
  })

  const join = (target: string) => path.join(__dirname, target)

  watcher.on('addDir', (p) => {
    console.log(pc.cyan(`dir added: ${p}`))
    const dirName = path.parse(p).name
    const targetDir = `../packages/${dirName}`
    fs.copySync(join('../template'), join(targetDir))
    const currentVersion = fs.readJSONSync(join('../package.json')).version
    // rename `template` in package.json
    const pkgStr = fs.readFileSync(join('../template/package.json'), 'utf-8')
    const pkg = JSON.parse(pkgStr.replaceAll('template', dirName))
    pkg.version = currentVersion
    fs.writeFileSync(join(`${targetDir}/package.json`), `${JSON.stringify(pkg, null, 2)}\n`)
    console.log(pc.green('generate success\n'))
  })
}

dev_watch()
