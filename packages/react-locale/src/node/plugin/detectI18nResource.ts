import path from 'path'
import type { PluginOption } from 'vite'
import { normalizePath } from 'vite'
import parseGlob from 'parse-glob'
import glob from 'tiny-glob'
import stripDirs from 'strip-dirs'
import depth from 'depth'
import fs from 'fs-extra'

interface DetectI18nResourceOptions {
  localeEntry: string
}

type ResourceType<T = any> = Record<string, T>

// Do not edit this directly
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

const PKGNAME = '@minko-fe/react-locale/plugin/detectI18nResource'

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

export const virtualModuleId = 'virtual:i18n-resources'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

export async function detectI18nResource(options: DetectI18nResourceOptions) {
  const { localeEntry } = options

  if (path.parse(localeEntry).ext) {
    throw new Error('localeEntry should be a dir, but it is a file now.')
  }

  const entry = normalizePath(`${localeEntry}/**/*.json`)

  const parsedEntry = parseGlob(entry)

  const { base } = parsedEntry

  setGlobalData({
    localeDirBasename: path.basename(base),
    localeEntry,
  })

  const files = await glob(entry)

  return {
    name: 'vite:detect-I18n-resource',
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        exclude: [virtualModuleId],
      },
    }),
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const resources = files.reduce(getResource, {})
        return `export const resources = ${JSON.stringify(resources)}`
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.includes(parsedEntry.base) && path.extname(file) === '.json') {
        const virtualModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId)!
        server.moduleGraph.invalidateModule(virtualModule)
        server.ws.send({
          type: 'full-reload',
          path: '*',
        })
      }
    },
  } as PluginOption
}
