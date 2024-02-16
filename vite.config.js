import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    polyfillModulePreload: false,
  },
  plugins: [
    createHtmlPlugin({
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeOptionalTags: true,
      },
    }),
  ],
});
