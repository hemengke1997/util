import { type Options } from './createUseStorageState'
import { type RequireSome } from './types'
import { type StateType, useSetState } from './useSetState'

export function useSessionStorageSetState<T extends StateType>(
  key: string,
  options: RequireSome<Options<T>, 'defaultValue'>,
) {
  return useSetState(options.defaultValue, {
    storage: {
      api: sessionStorage,
      key,
      options: options as Options<T>, // Explicitly cast options to Options<T | undefined>
    },
  })
}
