import path from 'path'
import type { PluginOption, ViteDevServer } from 'vite'
import { normalizePath } from 'vite'
import parseGlob from 'parse-glob'
import glob from 'tiny-glob'
import stripDirs from 'strip-dirs'
import depth from 'depth'
import fs from 'fs-extra'
import { cloneDeep } from '@minko-fe/lodash-pro'

const PKGNAME = '@minko-fe/react-locale/plugin/detectI18nResource'

interface DetectI18nResourceOptions {
  localeEntry: string
}

type ResourceType<T = any> = Record<string, T>

// Do not modify this variable directly
let globalData = {
  localeDirBasename: '',
  localeEntry: '',
}

function setGlobalData(d: typeof globalData) {
  globalData = d
}

function getGlobalData() {
  return globalData
}

function getLangName(filePath: string) {
  const fileBase = path.basename(path.dirname(filePath))
  const { localeDirBasename, localeEntry } = getGlobalData()
  if (fileBase === localeDirBasename) {
    // FileName is lang
    return [path.parse(filePath).name]
  }
  // Dir is lang
  const len = depth(localeEntry)
  const parsedFile = path.parse(stripDirs(filePath, len))
  return [...path.parse(stripDirs(filePath, len)).dir.split(path.sep), parsedFile.name]
}

function fillObject(obj: ResourceType, keyArray: string[], data: Record<string, any>) {
  keyArray.reduce((current, key, i) => {
    if (!current[key]) {
      current[key] = {}
    }
    if (i === keyArray.length - 1) {
      current[key] = {
        ...current[key],
        ...data,
      }
    }
    return current[key]
  }, obj)

  return obj
}

function getResource(resources: ResourceType, filePath: string) {
  try {
    const lang = getLangName(filePath)

    const jsonData = fs.readJsonSync(filePath)

    fillObject(resources, lang, jsonData)

    return resources
  } catch (error: any) {
    throw new Error(`[${PKGNAME}]: ${filePath} ${error.message}`)
  }
}

const VIRTUAL = 'virtual:i18n-resources'

const VIRTUAL_PREFIX = `\0/@virtual:vite:detect-I18n-resource/`

function invalidateVirtualModule(server: ViteDevServer, id: string): void {
  const { moduleGraph, ws } = server
  const module = moduleGraph.getModuleById(`${VIRTUAL_PREFIX}${id}`)
  if (module) {
    moduleGraph.invalidateModule(module)
    if (ws) {
      ws.send({
        type: 'full-reload',
        path: '*',
      })
    }
  }
}

function clearObjectValue(obj: Record<string, any>) {
  const clone = cloneDeep(obj)
  for (const k in clone) {
    clone[k] = {}
  }
  return clone
}

async function initModules(opts: { entry: string }) {
  const { entry } = opts
  const files = await glob(entry)

  const langModules = files.reduce(getResource, {})
  const resolvedIds = new Map<string, string>()

  const ALL = 'all'

  langModules[ALL] = cloneDeep(langModules)

  Object.keys(langModules).forEach((k) => {
    const id = `${VIRTUAL}:${k}`
    langModules[id] = k === ALL ? clearObjectValue(langModules[k]) : { [k]: langModules[k] }
    resolvedIds.set(path.resolve(id), id)
    delete langModules[k]
  })

  return {
    langModules,
    resolvedIds,
    files,
  }
}

export async function detectI18nResource(options: DetectI18nResourceOptions) {
  const { localeEntry } = options

  if (path.parse(localeEntry).ext) {
    throw new Error(`[${PKGNAME}]: localeEntry should be a dir, but it is a file now.`)
  }

  const entry = normalizePath(`${localeEntry}/**/*.json`)

  const parsedEntry = parseGlob(entry)

  const { base } = parsedEntry

  setGlobalData({
    localeDirBasename: path.basename(base),
    localeEntry,
  })

  let { langModules, resolvedIds } = await initModules({ entry })

  return {
    name: 'vite:detect-I18n-resource',
    enforce: 'pre',
    config: () => ({
      build: {
        dynamicImportVarsOptions: {
          exclude: [/react-locale/, /node_modules/],
        },
      },
    }),
    async resolveId(id: string, importer: string) {
      if (id in langModules) {
        return VIRTUAL_PREFIX + id
      }

      const langKeys = Object.keys(langModules)
      for (let i = 0; i < langKeys.length; i++) {
        if (id.includes(langKeys[i])) {
          return VIRTUAL_PREFIX + langKeys[i]
        }
      }

      if (importer) {
        const importerNoPrefix = importer.startsWith(VIRTUAL_PREFIX) ? importer.slice(VIRTUAL_PREFIX.length) : importer
        const resolved = path.resolve(path.dirname(importerNoPrefix), id)
        if (resolvedIds.has(resolved)) {
          return VIRTUAL_PREFIX + resolved
        }
      }

      return null
    },
    async load(id) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        const idNoPrefix = id.slice(VIRTUAL_PREFIX.length)
        const resolvedId = idNoPrefix in langModules ? idNoPrefix : resolvedIds.get(idNoPrefix)
        if (resolvedId) {
          const module = langModules[resolvedId]
          return typeof module === 'string' ? module : `export default ${JSON.stringify(module)}`
        }
      }
      return null
    },
    async handleHotUpdate({ file, server }) {
      if (file.includes(parsedEntry.base) && path.extname(file) === '.json') {
        for (const [, value] of resolvedIds) {
          const modules = await initModules({ entry })
          langModules = modules.langModules
          resolvedIds = modules.resolvedIds
          invalidateVirtualModule(server, value)
        }
      }
    },
  } as PluginOption
}
