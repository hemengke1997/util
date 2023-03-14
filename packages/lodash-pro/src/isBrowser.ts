import { isUndefined } from './isUndefined'

export function isBrowser() {
  return !isUndefined(window) && window.document && window.document.createElement
}
