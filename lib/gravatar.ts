/**
 * Get a link to Remco’s Gravatar URL.
 *
 * @param size
 *   The size query parameter.
 * @returns
 *   The Gravatar URL as a string.
 */
export function gravatar(size: number): string {
  const url = new URL('https://www.gravatar.com/avatar/fe52b3d3928f49a5057987549d39d1cb')
  url.searchParams.set('s', String(size))
  return String(url)
}
