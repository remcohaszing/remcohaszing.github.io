import { type ReactNode } from 'react'

import { assetLink } from '../lib/asset.js'

interface IconProps {
  /**
   * The size of the icon.
   */
  size?: number

  /**
   * The name of the icon asset to render.
   */
  icon: string
}

/**
 * Render an icon asset.
 */
export function Icon({ icon, size = 16 }: IconProps): ReactNode {
  const path = assetLink(`${icon}.svg`)

  return <img alt="" height={size} src={path} width={size} />
}
