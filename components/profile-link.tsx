import { type ReactNode } from 'react'

import { Icon } from './icon.js'

interface ProfileLinkProps {
  /**
   * The rendered name of the profile.
   */
  name: string

  /**
   * An asset icon name to represent the profile.
   */
  icon: string

  /**
   * The hover title of the link.
   */
  title?: string

  /**
   * The profile URL to link to.
   */
  url: string
}

/**
 * A link to one of Remco’s profiles.
 */
export function ProfileLink({
  name,
  icon,
  url,
  title = `Remco’s ${name} profile`
}: ProfileLinkProps): ReactNode {
  return (
    <a href={url} title={title}>
      <Icon icon={icon} />
      <span>{name}</span>
    </a>
  )
}
