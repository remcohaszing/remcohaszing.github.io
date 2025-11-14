import type { MDXContent } from 'mdx/types.js'

declare module 'mdx/types.js' {
  // eslint-disable-next-line id-denylist
  export import JSX = React.JSX
}

interface Meta {
  /**
   * The date on which an article was created.
   */
  created: string

  /**
   * The description of a page.
   */
  description?: string
}

export interface Page {
  /**
   * The page content to render.
   */
  default: MDXContent

  /**
   * Additional page metadata. This is typically defined in frontmatter.
   */
  meta: Meta

  /**
   * The title of the page.
   */
  title: string
}
