import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface CodeBlockProps extends ComponentPropsWithoutRef<'pre'> {
  /**
   * An optional filename for the code block.
   */
  filename?: string
}

/**
 * Render a code block with a copy button.
 */
export function CodeBlock({ filename, ...props }: CodeBlockProps): ReactNode {
  return (
    <div className="code-block">
      {filename ? <label>{filename}</label> : null}
      <pre {...props} />
    </div>
  )
}
