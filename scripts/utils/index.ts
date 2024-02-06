import path from 'node:path'
import stripDirs from 'strip-dirs'
import glob from 'tiny-glob'
import { fileSuffixPlugin } from './esbuild/file-suffix-plugin'

// Taken from https://github.com/sindresorhus/slash/blob/main/index.js (MIT)
export function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path)
  if (isExtendedLengthPath) {
    return path
  }
  return path.replaceAll('\\', '/')
}

export function debouncePromise<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  delay: number,
  onError?: (err: unknown) => void,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  let promiseInFly: Promise<void> | undefined

  let callbackPending: (() => void) | undefined

  return function debounced(...args: Parameters<typeof fn>) {
    if (promiseInFly) {
      callbackPending = () => {
        debounced(...args)
        callbackPending = undefined
      }
    } else {
      if (timeout != null) clearTimeout(timeout)

      timeout = setTimeout(() => {
        timeout = undefined
        promiseInFly = fn(...args)
          .catch(onError)
          .finally(() => {
            promiseInFly = undefined
            if (callbackPending) callbackPending()
          })
      }, delay)
    }
  }
}

function rmExt(filePath: string) {
  return filePath.split(path.extname(filePath))[0]
}

export async function getEntry(entryGlob = 'src/index.ts{,x}') {
  const entries = await glob(entryGlob)
  const entry: Record<string, string> = {}
  entries.forEach((e) => {
    entry[rmExt(stripDirs(e, 1))] = e
  })

  return entry
}

export { fileSuffixPlugin }
