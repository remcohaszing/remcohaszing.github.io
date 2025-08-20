import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, parse, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { compile, type Jsx, run } from '@mdx-js/mdx'
import { all } from '@wooorm/starry-night'
import klaw from 'klaw'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { renderToString } from 'react-dom/server'
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkHeadingsOptions
} from 'rehype-autolink-headings'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxTitle from 'rehype-mdx-title'
import rehypeSlug from 'rehype-slug'
import rehypeStarryNight from 'rehype-starry-night'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { type PluggableList } from 'unified'
import { rss, type Entry as RssEntry } from 'xast-util-feed'
import { sitemap, type Entry as SitemapEntry } from 'xast-util-sitemap'
import { toXml } from 'xast-util-to-xml'

import { CodeBlock } from './components/code-block.js'
import { Document } from './components/document.js'
import { assetMap } from './lib/asset.js'
import { type Page } from './lib/types.js'

type Entry = RssEntry &
  SitemapEntry & {
    /**
     * Whether or not the entry is an article.
     *
     * Articles show up in the site map and RSS feed.
     */
    isArticle: boolean
  }

const siteUrl = new URL('https://remcohaszing.nl')
const distDir = fileURLToPath(new URL('dist', import.meta.url))
const pagesDir = fileURLToPath(new URL('pages', import.meta.url))
const publicDir = fileURLToPath(new URL('public', import.meta.url))
const entries: Entry[] = []
const mdxComponents = { pre: CodeBlock }

/**
 * Import a page to render.
 *
 * @param url
 *   The file URL to import.
 * @param isArticle
 *   Whether or not the page is an article.
 * @returns
 *   The page module.
 */
async function importPage(url: URL, isArticle: boolean): Promise<Page> {
  if (!/\.mdx?$/.test(url.pathname)) {
    return import(String(url))
  }

  const value = await readFile(url, 'utf8')

  const rehypePlugins: PluggableList = [
    rehypeSlug,
    [rehypeStarryNight, { grammars: all }],
    rehypeMdxCodeProps,
    rehypeMdxTitle
  ]

  if (isArticle) {
    rehypePlugins.push([
      rehypeAutolinkHeadings,
      {
        content: {
          type: 'element',
          tagName: 'span',
          properties: { ariaHidden: true },
          children: [{ type: 'text', value: '§ ' }]
        }
      } satisfies RehypeAutolinkHeadingsOptions
    ])
  }

  const code = await compile(
    { url, value },
    {
      outputFormat: 'function-body',
      remarkPlugins: [remarkFrontmatter, remarkGfm, [remarkMdxFrontmatter, { name: 'meta' }]],
      rehypePlugins
    }
  )
  return run(code, {
    baseUrl: url,
    Fragment,
    jsx: jsx as Jsx,
    jsxs: jsxs as Jsx
  }) as unknown as Promise<Page>
}

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
  const isArticle = dir === 'blog'

  const module = await importPage(importUrl, isArticle)
  const content = <module.default components={mdxComponents} />
  const document = (
    <Document {...module} isArticle={isArticle} url={url}>
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
await cp('node_modules/@wooorm/starry-night/style/both.css', join(distDir, 'starry-night.css'))
