import { injectToBody, injectToHead } from './inject'
export { snippets } from './snippets'
export * from './inject'

export interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
  children?: string | HtmlTagDescriptor[]
  /**
   * default: 'head-prepend'
   */
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

export type HtmlTransformResult =
  | string
  | HtmlTagDescriptor[]
  | {
      html: string
      tags: HtmlTagDescriptor[]
    }

export function applyHtmlTransforms(html: string, res: HtmlTransformResult): string {
  if (typeof res === 'string') {
    html = res
  } else {
    let tags: HtmlTagDescriptor[]
    if (Array.isArray(res)) {
      tags = res
    } else {
      html = res.html || html
      tags = res.tags
    }

    const headTags: HtmlTagDescriptor[] = []
    const headPrependTags: HtmlTagDescriptor[] = []
    const bodyTags: HtmlTagDescriptor[] = []
    const bodyPrependTags: HtmlTagDescriptor[] = []

    for (const tag of tags) {
      if (tag.injectTo === 'body') {
        bodyTags.push(tag)
      } else if (tag.injectTo === 'body-prepend') {
        bodyPrependTags.push(tag)
      } else if (tag.injectTo === 'head') {
        headTags.push(tag)
      } else {
        headPrependTags.push(tag)
      }
    }

    html = injectToHead(html, headPrependTags, true)
    html = injectToHead(html, headTags)
    html = injectToBody(html, bodyPrependTags, true)
    html = injectToBody(html, bodyTags)
  }

  return html
}
