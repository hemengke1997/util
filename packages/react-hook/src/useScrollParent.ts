import { isBrowser } from '@minko-fe/lodash-pro'
import { useEffect, useState } from 'react'
import { type BasicTarget, getTargetElement } from './dom/getTargetElement'

type ScrollElement = Element | HTMLElement | Window | undefined

const overflowScrollReg = /scroll|auto/i
const defaultRoot = isBrowser() ? window : undefined

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE
}

export function getScrollParent(el: Element, root: ScrollElement = defaultRoot): ScrollElement {
  if (root === undefined) {
    root = window
  }
  let node = el
  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node
      }

      const htmlOverflowY = window.getComputedStyle(node.parentNode as Element).overflowY
      if (overflowScrollReg.test(htmlOverflowY)) {
        return node
      }
    }
    node = node.parentNode as Element
  }
  return root
}

function useScrollParent(el: BasicTarget<HTMLElement | Element | Window | Document>): Element | Window | undefined {
  const [scrollParent, setScrollParent] = useState<Element | Window>()

  useEffect(() => {
    if (el) {
      const element = getTargetElement(el) as Element
      setScrollParent(getScrollParent(element))
    }
  }, [])

  return scrollParent
}

export { useScrollParent }
