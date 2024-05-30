import { type PluginOption } from 'vite'
import { viteVConsole, type viteVConsoleOptions } from 'vite-plugin-vconsole'

export function vConsole(options: viteVConsoleOptions): PluginOption {
  return viteVConsole(options) as PluginOption
}
