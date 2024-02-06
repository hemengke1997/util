import { type RequireSome } from '../@types/types'
import { type Options } from '../createUseStorageState'
import { type StateType, useSetState } from '../useSetState'

export function useLocalStorageSetState<T extends StateType>(
  key: string,
  options: RequireSome<Options<T>, 'defaultValue'>,
) {
  return useSetState(options.defaultValue!, {
    storage: {
      api: localStorage,
      key,
      options: options as Options<T>, // Explicitly cast options to Options<T | undefined>
    },
  })
}
