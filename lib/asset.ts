import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { parse } from 'node:path'
import { fileURLToPath } from 'node:url'

export const assetMap = new Map<string, [string, Buffer]>()

/**
 * Get the link to an asset.
 *
 * @param name
 *   The filename of the asset to get a link for.
 * @returns
 *   The link to the asset.
 */
export function assetLink(name: string): string {
  const { ext } = parse(name)
  const filePath = fileURLToPath(new URL(`../assets/${name}`, import.meta.url))
  let output = assetMap.get(filePath)

  if (!output) {
    const content = readFileSync(filePath)
    const hash = createHash('md5').update(content).digest('hex').slice(12)
    output = [`assets/${hash}${ext}`, content]
    assetMap.set(filePath, output)
  }

  return `/${output[0]}`
}
