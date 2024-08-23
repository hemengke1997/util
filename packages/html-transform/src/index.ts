/**
 * MIT License

Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors

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

import { headTagInsertCheck, injectToBody, injectToHead } from './inject'

export interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
  children?: string | HtmlTagDescriptor[]
  /**
   * default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

export function inject(html: string, tags: HtmlTagDescriptor[]): string {
  let headTags: HtmlTagDescriptor[] | undefined
  let headPrependTags: HtmlTagDescriptor[] | undefined
  let bodyTags: HtmlTagDescriptor[] | undefined
  let bodyPrependTags: HtmlTagDescriptor[] | undefined

  for (const tag of tags) {
    switch (tag.injectTo) {
      case 'body':
        ;(bodyTags ??= []).push(tag)
        break
      case 'body-prepend':
        ;(bodyPrependTags ??= []).push(tag)
        break
      case 'head':
        ;(headTags ??= []).push(tag)
        break
      default:
        ;(headPrependTags ??= []).push(tag)
    }
  }

  headTagInsertCheck([...(headTags || []), ...(headPrependTags || [])])

  if (headPrependTags) html = injectToHead(html, headPrependTags, true)
  if (headTags) html = injectToHead(html, headTags)
  if (bodyPrependTags) html = injectToBody(html, bodyPrependTags, true)
  if (bodyTags) html = injectToBody(html, bodyTags)

  return html
}
