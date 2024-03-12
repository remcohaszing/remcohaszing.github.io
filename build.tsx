import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { register } from 'node:module'
import { dirname, join, parse, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import klaw from 'klaw'
import { renderToString } from 'react-dom/server'
import { rss, type Entry as RssEntry } from 'xast-util-feed'
import { sitemap, type Entry as SitemapEntry } from 'xast-util-sitemap'
import { toXml } from 'xast-util-to-xml'

import { CodeBlock } from './components/code-block.js'
import { Document } from './components/document.js'
import { assetMap } from './lib/asset.js'

type Entry = RssEntry &
  SitemapEntry & {
    /**
     * Whether or not the entry is an article.
     *
     * Articles show up in the site map and RSS feed.
     */
    isArticle: boolean
  }

register('./mdx-loader.ts', import.meta.url)

const siteUrl = new URL('https://remcohaszing.nl')
const distDir = fileURLToPath(new URL('dist', import.meta.url))
const pagesDir = fileURLToPath(new URL('pages', import.meta.url))
const publicDir = fileURLToPath(new URL('public', import.meta.url))
const entries: Entry[] = []
const mdxComponents = { pre: CodeBlock }

/**
 * Emit a file to the `dist` directory.
 *
 * Ancestor directories are created if necessary.
 *
 * @param path
 *   The relative path to emit to.
 * @param content
 *   The content to write to the file.
 */
async function emit(path: string, content: Buffer | string): Promise<void> {
  const fullPath = join(distDir, path)
  const dir = dirname(fullPath)
  // eslint-disable-next-line no-console
  console.log('Emit:', relative(process.cwd(), fullPath))
  await mkdir(dir, { recursive: true })
  await writeFile(fullPath, content)
}

await rm(distDir, { force: true, recursive: true })

for await (const { path, stats } of klaw(pagesDir, {})) {
  if (!stats.isFile()) {
    continue
  }

  const { dir, name } = parse(relative(pagesDir, path))
  if (name.startsWith('.')) {
    continue
  }

  // eslint-disable-next-line no-console
  console.log('Read:', relative(process.cwd(), path))
  const url = String(new URL(`${dir}/${name.replace(/^index$/, '')}`, siteUrl))
  const importUrl = pathToFileURL(path)

  const { default: Content, ...module } = await import(String(importUrl))
  const isArticle = dir === 'blog'
  const content = <Content components={mdxComponents} />
  const document = (
    <Document {...module} type={isArticle ? 'article' : 'website'} url={url}>
      {content}
    </Document>
  )
  const html = `<!doctype html>${renderToString(document)}`
  entries.push({
    author: 'Remco Haszing',
    descriptionHtml: renderToString(content),
    isArticle,
    lang: 'en',
    title: module.title,
    url
  })
  await emit(join(dir, `${name}.html`), html)
}

for (const [path, buffer] of assetMap.values()) {
  await emit(path, buffer)
}

await emit('sitemap.xml', toXml(sitemap(entries)))
await emit(
  'rss.xml',
  toXml(
    rss(
      {
        author: 'Remco Haszing',
        feedUrl: String(new URL('rss.xml', siteUrl)),
        lang: 'en',
        title: 'Remco’s blog',
        url: String(siteUrl)
      },
      entries.filter((entry) => entry.isArticle)
    )
  )
)
await cp(publicDir, distDir, { recursive: true })
