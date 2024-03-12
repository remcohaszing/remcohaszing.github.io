import preset from '../.remarkrc.js'

export default {
  ...preset,
  plugins: ['remark-mdx', ...preset.plugins]
}
