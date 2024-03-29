import { isBrowser } from '@minko-fe/lodash-pro'
import { type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { resolveContainer } from './getContainer'

export type GetContainer = HTMLElement | (() => HTMLElement) | null

export function renderToContainer(getContainer: GetContainer, node: ReactElement): ReactElement {
  if (isBrowser() && getContainer) {
    const container = resolveContainer(getContainer)
    return createPortal(node, container)
  }
  return node
}
