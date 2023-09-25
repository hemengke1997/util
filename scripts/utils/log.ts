/**
 * https://github.com/egoist/tsup/blob/HEAD/src/log.ts
 */
import util from 'node:util'
import { isMainThread, parentPort } from 'node:worker_threads'
import colors from 'picocolors'

type LOG_TYPE = 'info' | 'success' | 'error' | 'warn'

export const colorize = (type: LOG_TYPE, data: any, onlyImportant = false) => {
  if (onlyImportant && (type === 'info' || type === 'success')) return colors.blue(data)

  const color = type === 'info' ? 'dim' : type === 'error' ? 'red' : type === 'warn' ? 'yellow' : 'green'
  return colors[color](data)
}

export const makeLabel = (name: string | undefined, input: string, type: LOG_TYPE) => {
  return [name && `${colors.dim('[')}${name.toUpperCase()}${colors.dim(']')}`, colorize(type, input)]
    .filter(Boolean)
    .join(' ')
}

let silent = false

export function setSilent(isSilent?: boolean) {
  silent = !!isSilent
}

export function getSilent() {
  return silent
}

export class LoggerFactory {
  private name: string | undefined
  constructor(n?: string) {
    this.name = n
  }

  setName(_name: string) {
    this.name = _name
  }

  success(label: string, ...args: any[]) {
    return this.log(label, 'success', ...args)
  }

  info(label: string, ...args: any[]) {
    return this.log(label, 'info', ...args)
  }

  error(label: string, ...args: any[]) {
    return this.log(label, 'error', ...args)
  }

  warn(label: string, ...args: any[]) {
    return this.log(label, 'warn', ...args)
  }

  log(label: string, type: 'info' | 'success' | 'error' | 'warn', ...data: unknown[]) {
    const args = [makeLabel(this.name, label, type), ...data.map((item) => colorize(type, item, true))]
    switch (type) {
      case 'error': {
        if (!isMainThread) {
          parentPort?.postMessage({
            type: 'error',
            text: util.format(...args),
          })
          return
        }

        return console.error(...args)
      }
      default:
        if (silent) return

        if (!isMainThread) {
          parentPort?.postMessage({
            type: 'log',
            text: util.format(...args),
          })
          return
        }

        console.log(...args)
    }
  }
}
