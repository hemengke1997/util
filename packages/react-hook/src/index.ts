/**
 * MIT License

 Copyright (c) 2020 ahooks

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import * as ReactUse from 'react-use'

export {
  clearCache,
  configResponsive,
  createUpdateEffect,
  useAntdTable,
  useAsyncEffect,
  useBoolean,
  useClickAway,
  useCookieState,
  useCountDown,
  useCounter,
  useCreation,
  useDebounce,
  useDebounceEffect,
  useDebounceFn,
  useDeepCompareEffect,
  useDeepCompareLayoutEffect,
  useDocumentVisibility,
  useDrag,
  useDrop,
  useDynamicList,
  useEventEmitter,
  useEventListener,
  useEventTarget,
  useExternal,
  useFavicon,
  useFocusWithin,
  useFullscreen,
  useFusionTable,
  useGetState,
  useHistoryTravel,
  useHover,
  useInViewport,
  useInfiniteScroll,
  useInterval,
  useIsomorphicLayoutEffect,
  useKeyPress,
  useLatest,
  useLocalStorageState,
  useLockFn,
  useLongPress,
  useMap,
  useMemoizedFn,
  useMount,
  useMouse,
  useMutationObserver,
  useNetwork,
  usePagination,
  usePrevious,
  useRafInterval,
  useRafState,
  useRafTimeout,
  useReactive,
  useRequest,
  useResetState,
  useResponsive,
  useSafeState,
  useScroll,
  useSelections,
  useSessionStorageState,
  useSet,
  useSize,
  useTextSelection,
  useThrottle,
  useThrottleEffect,
  useThrottleFn,
  useTimeout,
  useTitle,
  useToggle,
  useTrackedEffect,
  useUnmount,
  useUnmountedRef,
  useUpdate,
  useUpdateEffect,
  useUpdateLayoutEffect,
  useVirtualList,
  useWebSocket,
  useWhyDidYouUpdate,
} from 'ahooks'

const {
  useAsync,
  useAsyncFn,
  useAsyncRetry,
  useBeforeUnload,
  useCopyToClipboard,
  useCss,
  useCustomCompareEffect,
  useDefault,
  useError,
  useEvent,
  useFirstMountState,
  useGetSet,
  useGetSetState,
  useHash,
  useHoverDirty,
  useIntersection,
  useLockBodyScroll,
  useMeasure,
  usePageLeave,
  usePermission,
  usePinchZoom,
  usePreviousDistinct,
  useQueue,
  useRaf,
  useRafLoop,
  useScrollbarWidth,
  useScrolling,
  useSearchParam,
  useSlider,
  useSpeech,
  useStartTyping,
  useWindowScroll,
  useWindowSize,
} = ReactUse
export {
  useAsync,
  useAsyncFn,
  useAsyncRetry,
  useBeforeUnload,
  useCopyToClipboard,
  useCss,
  useCustomCompareEffect,
  useDefault,
  useError,
  useEvent,
  useFirstMountState,
  useGetSet,
  useGetSetState,
  useHash,
  useHoverDirty,
  useIntersection,
  useLockBodyScroll,
  useMeasure,
  usePageLeave,
  usePermission,
  usePinchZoom,
  usePreviousDistinct,
  useQueue,
  useRaf,
  useRafLoop,
  useScrollbarWidth,
  useScrolling,
  useSearchParam,
  useSlider,
  useSpeech,
  useStartTyping,
  useWindowScroll,
  useWindowSize,
}

export { EventEmitter } from './useEventEmitter'
export { createUseStorageState } from './createUseStorageState'
export { useControlledState } from './useControlledState'
export { useEffectOnce } from './useEffectOnce'
export { useStrictInput } from './useStrictInput'
export { useTouch } from './useTouch'
export { useLockScroll } from './useLockScroll'
export { useScrollParent } from './useScrollParent'
export { useLayoutUpdateEffect } from './useLayoutUpdateEffect'
export { useConstant } from './useConstant'
export { useSetState } from './useSetState'
export { useLocalStorageSetState } from './useLocalStorageSetState'
export { useSessionStorageSetState } from './useSessionStorageSetState'
export { useGlobalStyle } from './useGlobalStyle'
export type { UseGlobalStyleOptions } from './useGlobalStyle'
