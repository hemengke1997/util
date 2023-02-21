import { createPortal } from 'react-dom'
import type { ReactElement } from 'react'
import { isBrowser } from '@minko-fe/lodash-pro'
import { resolveContainer } from './getContainer'

export type GetContainer = HTMLElement | (() => HTMLElement) | null

export function renderToContainer(getContainer: GetContainer, node: ReactElement): ReactElement {
  if (isBrowser() && getContainer) {
    const container = resolveContainer(getContainer)
    return createPortal(node, container)
  }
  return node
}
