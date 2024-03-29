import { type ReactNode } from 'react'

import { assetLink } from '../lib/asset.js'
import { gravatar } from '../lib/gravatar.js'
import { formatDate } from '../lib/intl.js'

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

interface DocumentProps {
  /**
   * The content on the page.
   */
  children: ReactNode

  /**
   * Whether this is an article or a different kind of page.
   */
  isArticle: boolean

  /**
   * Additional page metadata. This is typically defined in frontmatter.
   */
  meta: Meta

  /**
   * The title of the page.
   */
  title: string

  /**
   * The canonical URL.
   */
  url: string
}

/**
 * Render a document page.
 */
export function Document({ children, isArticle, meta, title, url }: DocumentProps): ReactNode {
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
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        {meta.description ? <meta content={meta.description} name="description" /> : null}
        {meta.description ? <meta content={meta.description} name="og:description" /> : null}
        <meta content={url} name="og:url" />
        <meta content={title} name="og:title" />
        <meta content={gravatar(256)} name="og:image" />
        <meta content="Remco Haszing" name="og:image:alt" />
        <meta content="256" name="og:image:height" />
        <meta content="image/jpeg" name="og:image:type" />
        <meta content="256" name="og:image:width" />
        <meta content={isArticle ? 'article' : 'website'} name="og:type" />
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
        {isArticle ? (
          <>
            <nav>
              <a href="/">About</a>
            </nav>
            <main>
              <time className="date" dateTime={meta.created}>
                {formatDate(meta.created)}
              </time>
              {children}
            </main>
          </>
        ) : (
          children
        )}
        <script src={assetLink('script.js')} type="module" />
      </body>
    </html>
  )
}
