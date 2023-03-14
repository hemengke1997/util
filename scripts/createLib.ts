import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import picocolors from 'picocolors'
import prompts from 'prompts'
import validate from 'validate-npm-package-name'

const __dirname = path.resolve(fileURLToPath(import.meta.url), '..')

const join = (target: string) => path.join(__dirname, target)

function cp(p: string) {
  const dirName = p
  const targetDir = `../packages/${dirName}`
  fs.copySync(join('../template'), join(targetDir))
  const currentVersion = fs.readJSONSync(join('../package.json')).version
  // rename `template` with folder name in package.json
  const pkgStr = fs.readFileSync(join('../template/package.json'), 'utf-8')
  const pkg = JSON.parse(pkgStr.replaceAll('template', dirName))
  pkg.version = currentVersion
  fs.writeFileSync(join(`${targetDir}/package.json`), `${JSON.stringify(pkg, null, 2)}\n`)
  console.log(picocolors.green('✅ Generate success'))
}

const createLib = async () => {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: 'lib name?',
    validate: (value) => {
      const v = validate(value)
      const isValid = v.validForNewPackages
      if (!isValid) {
        const err = v.errors || v.warnings
        return err?.join(',') || 'lib name is invalid'
      }
      return true
    },
  })

  cp(response.value)
}

createLib()
