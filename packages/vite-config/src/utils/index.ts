import path from 'path'
import { getTsconfig } from 'get-tsconfig'

export function injectEnv(envConf: Record<string, any>): ImportMetaEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }

  return ret
}

export interface PathMapping {
  find: RegExp
  replacement: string
}

export function pathsMapToAlias(root: string) {
  const tsconfig = getTsconfig(root)

  const compilerOptions = tsconfig?.config.compilerOptions

  function resolvePathMappings(paths: Record<string, string[]>, base: string) {
    const sortedPatterns = Object.keys(paths).sort((a: string, b: string) => getPrefixLength(b) - getPrefixLength(a))
    const resolved: PathMapping[] = []
    for (let pattern of sortedPatterns) {
      const relativePaths = paths[pattern]
      if (relativePaths.length > 1) {
        continue
      }
      pattern = escapeStringRegexp(pattern).replace(/\/\*/g, '')
      resolved.push({
        find: new RegExp(`^${pattern}`),
        replacement: path.resolve(base, relativePaths[0].replace(/\/\*/g, '')),
      })
    }
    return resolved
  }
  function getPrefixLength(pattern: string): number {
    const prefixLength = pattern.indexOf('*')
    return pattern.substring(0, prefixLength).length
  }

  function escapeStringRegexp(string: string) {
    return string.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/-/g, '\\x2d')
  }

  return resolvePathMappings(compilerOptions?.paths || {}, compilerOptions?.baseUrl || '.')
}
