import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextQuotes from 'retext-quotes'
import retextRepeatedWords from 'retext-repeated-words'
import retextSyntaxURLs from 'retext-syntax-urls'
import { unified } from 'unified'

/**
 * An opiniated remark preset.
 *
 * @type {import('unified').Preset}
 */
export default {
  settings: {
    bullet: '-',
    emphasis: '_',
    fences: true,
    listItemIndent: 'one'
  },
  plugins: [
    ['remark-frontmatter', ['toml', 'yaml']],
    'remark-gfm',
    'remark-lint-definition-case',
    'remark-lint-final-definition',
    'remark-lint-heading-increment',
    'remark-lint-no-duplicate-defined-urls',
    'remark-lint-no-duplicate-definitions',
    'remark-lint-no-empty-url',
    'remark-lint-no-reference-like-url',
    'remark-lint-no-unneeded-full-reference-image',
    'remark-lint-no-unneeded-full-reference-link',
    'remark-lint-no-unused-definitions',
    [
      'remark-retext',
      unified()
        .use(retextEnglish)
        .use(retextIndefiniteArticle)
        .use(retextQuotes)
        .use(retextRepeatedWords)
        .use(retextSyntaxURLs)
    ],
    ['remark-toc', { tight: true }]
  ]
}
