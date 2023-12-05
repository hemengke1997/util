import { isTest } from 'std-env'
import { viteVConsole, type viteVConsoleOptions } from 'vite-plugin-vconsole'

export function vConsole(options: viteVConsoleOptions) {
  return isTest ? viteVConsole(options) : undefined
}
