import fs from 'fs-extra'
import JoyCon from 'joycon'
import JSONC from 'jsonc-simple-parser'
import path from 'node:path'

const joycon = new JoyCon()

const loadJson = async (filepath: string) => {
  try {
    return JSONC.parse(await fs.readFile(filepath, 'utf8'))
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Failed to parse ${path.relative(process.cwd(), filepath)}: ${error.message}`)
    } else {
      throw error
    }
  }
}

const jsonLoader = {
  test: /\.json5?$/,
  load(filepath: string) {
    return loadJson(filepath)
  },
}

joycon.addLoader(jsonLoader)

export async function loadPkg(cwd: string, clearCache = false) {
  if (clearCache) {
    joycon.clearCache()
  }
  const { data } = await joycon.load(['package.json'], cwd, path.dirname(cwd))
  return data || {}
}

/**
 * Use this to determine if we should rebuild when package.json changes
 */
export async function getAllDepsHash(cwd: string) {
  const data = await loadPkg(cwd, true)

  return JSON.stringify({
    ...data.dependencies,
    ...data.peerDependencies,
    ...data.devDependencies,
  })
}
