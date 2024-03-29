import { type MDXContent } from 'mdx/types.js'

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
