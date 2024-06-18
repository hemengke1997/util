import { getTsconfig } from 'get-tsconfig'
import path from 'node:path'

export function injectEnv(envConf: Record<string, any>): ImportMetaEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replaceAll('\\n', '\n')
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
  find: RegExp | string
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
      pattern = escapeStringRegexp(pattern).replaceAll('/*', '')
      resolved.push({
        find: pattern,
        replacement: path.resolve(base, relativePaths[0].replaceAll('/*', '')),
      })
    }

    return resolved
  }
  function getPrefixLength(pattern: string): number {
    const prefixLength = pattern.indexOf('*')
    return pattern.slice(0, Math.max(0, prefixLength)).length
  }

  function escapeStringRegexp(string: string) {
    return string.replaceAll(/[$()+.?[\\\]^{|}]/g, '\\$&').replaceAll('-', '\\x2d')
  }

  return resolvePathMappings(compilerOptions?.paths || {}, compilerOptions?.baseUrl || '.')
}
