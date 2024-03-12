import { type ReactNode } from 'react'

import { assetLink } from '../lib/asset.js'
import { gravatar } from '../lib/gravatar.js'

interface Meta {
  /**
   * The description of a page.
   */
  description?: string
}

interface DocumentProps {
  /**
   * The content on the page.
   */
  children: ReactNode

  /**
   * The title of the page.
   */
  title: string

  /**
   * The canonical URL.
   */
  url: string

  /**
   * Additional page metadata. This is typically defined in frontmatter.
   */
  meta: Meta

  /**
   * Whether the page is an article or a resular website page.
   */
  type: 'article' | 'website'
}

/**
 * Render a document page.
 */
export function Document({ children, meta, title, type, url }: DocumentProps): ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf8" />
        <meta content="light dark" name="color-scheme" />
        <meta
          content="default-src 'self'; img-src 'self' www.gravatar.com; style-src 'self' 'unsafe-inline'"
          httpEquiv="Content-Security-Policy"
        />
        <meta content="#121212" name="theme-color" />
        <meta content="width=device-width" name="viewport" />
        {meta.description ? <meta content={meta.description} name="description" /> : null}
        {meta.description ? <meta content={meta.description} name="og:description" /> : null}
        <meta content={url} name="og:url" />
        <meta content={title} name="og:title" />
        <meta content={gravatar(256)} name="og:image" />
        <meta content="Remco Haszing" name="og:image:alt" />
        <meta content="256" name="og:image:height" />
        <meta content="image/jpeg" name="og:image:type" />
        <meta content="256" name="og:image:width" />
        <meta content={type} name="og:type" />
        <meta content="summary" name="twitter:card" />
        <meta content="@remcohaszing" name="twitter:creator" />
        <meta content="@remcohaszing" name="twitter:site" />
        <title>{title}</title>
        <link href="/index.css" rel="stylesheet" />
        <link href={assetLink('favicon.svg')} rel="icon" type="image/svg+xml" />
        <link href="/rss.xml" rel="alternate" title="Remco’s blog" type="application/rss+xml" />
        <link href={url} rel="canonical" />
      </head>
      <body>
        {children}
        <script src={assetLink('script.js')} type="module" />
      </body>
    </html>
  )
}
