import { isBrowser, isFunction } from '@minko-fe/lodash-pro'
import { useLatest, useMemoizedFn } from 'ahooks'
import { useState } from 'react'
import { type Options as StorageOptions, createUseStorageState } from './createUseStorageState'

export type StateType = Record<string, any>

export type SetState<S extends StateType> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void

type Plugin<S extends StateType> = {
  (options: Options<S>): PluginReturn<S>
}

type WaterfallPlugin<S extends StateType> = (state: S, prevState?: S) => S | void

interface PluginReturn<S extends StateType> {
  onInit?: WaterfallPlugin<S>
  onSetState?: WaterfallPlugin<S>
}

export interface Options<S extends StateType> {
  storage?: {
    key: string
    api: Storage
    options?: StorageOptions<S>
  }
}

function reduceWaterfallPlugins<S extends StateType>(plugins: PluginReturn<S>[], pluginName: keyof PluginReturn<S>) {
  return (state: S, prevState: S) => {
    return plugins.reduce((acc, p) => {
      if (p[pluginName]) {
        acc = p[pluginName]?.(acc, prevState) ?? acc
      }
      return acc
    }, state)
  }
}

function useSetStateImpl<S extends StateType>(
  initialState: S | (() => S),
  options: Options<S>,
  plugins: Plugin<S>[],
): [S, SetState<S>] {
  const pluginImpls = plugins.map((plugin) => plugin(options))

  const [state, setState] = useState<S>(() => {
    const value = isFunction(initialState) ? initialState() : initialState
    return reduceWaterfallPlugins(pluginImpls, 'onInit')(value, value)
  })
  const stateRef = useLatest(state)

  const setMergeState: SetState<S> = useMemoizedFn((patch) => {
    const prevState = stateRef.current
    const newState = isFunction(patch) ? patch(prevState) : patch
    const currentState = newState ? { ...prevState, ...newState } : prevState
    const value = reduceWaterfallPlugins(pluginImpls, 'onSetState')(currentState, prevState)
    setState(value)
  })

  return [state, setMergeState]
}

const useStoragePlugin: Plugin<any> = <S extends StateType>(option: Options<S>) => {
  const { storage } = option as Required<Options<S>>
  const useStorageState = createUseStorageState(() => (isBrowser() ? storage.api : undefined))
  const [state, setState] = useStorageState(storage.key, storage.options)
  return {
    onInit: () => {
      return state
    },
    onSetState: (state) => {
      setState(state)
    },
  }
}

export function useSetState<S extends StateType>(
  initialState: S | (() => S),
  options?: Options<S>,
  plugins?: Plugin<S>[],
): [S, SetState<S>] {
  const builtInPlugins: Plugin<S>[] = []
  if (options?.storage) {
    builtInPlugins.push(useStoragePlugin)
  }
  return useSetStateImpl(initialState, options || {}, [...(plugins || []), ...builtInPlugins])
}
