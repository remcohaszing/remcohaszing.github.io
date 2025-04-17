import { type ReactNode } from 'react'

import { Icon } from './icon.js'

interface JobSectionProps {
  /**
   * The name of the icon asset to render.
   */
  icon: string

  /**
   * The name of the organization.
   */
  name: ReactNode

  /**
   * The starting year.
   */
  from: number

  /**
   * The end year.
   */
  to?: 'Present' | number

  /**
   * Content to render.
   */
  children: ReactNode
}

/**
 * Render a job section on the home page.
 */
export function JobSection({ children, from, icon, name, to }: JobSectionProps): ReactNode {
  return (
    <section>
      <h3>
        <Icon icon={icon} /> {name}{' '}
        <span className="date">
          <time dateTime={String(from)}>{from}</time>
          {to ? ' — ' : null}
          {to ? <time dateTime={String(to)}>{to}</time> : null}
        </span>
      </h3>
      {children}
    </section>
  )
}
