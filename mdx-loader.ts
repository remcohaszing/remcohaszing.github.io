import { createLoader } from '@mdx-js/node-loader'
import rehypeShiki from '@shikijs/rehype'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxTitle from 'rehype-mdx-title'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export const { load } = createLoader({
  remarkPlugins: [
    remarkFrontmatter,
    remarkGfm,
    [
      remarkMdxFrontmatter,
      {
        name: 'meta'
      }
    ]
  ],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeShiki,
      {
        themes: {
          light: 'github-light',
          dark: 'github-dark'
        }
      }
    ],
    rehypeMdxCodeProps,
    rehypeMdxTitle
  ]
})
