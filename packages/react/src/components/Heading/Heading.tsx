import React, { ReactNode, forwardRef } from 'react'
import { mergeClasses } from '../../internal/resolvers/mergeClasses.js'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const HEADING_LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: 'pathable-heading--level-1',
  2: 'pathable-heading--level-2',
  3: 'pathable-heading--level-3',
  4: 'pathable-heading--level-4',
  5: 'pathable-heading--level-5',
  6: 'pathable-heading--level-6',
}

export interface HeadingProps extends Omit<
  React.HTMLAttributes<HTMLHeadingElement>,
  'color'
> {
  /** Document outline level. Controls rendered HTML element (h1–h6). Required. */
  level: HeadingLevel
  /** Optional visual style override. When set, the CSS class uses this level
   *  while the HTML element uses `level`. Defaults to `level`. */
  visualLevel?: HeadingLevel
  /** Draw the heading in white, for use on a dark background such as
   *  `pathable-dark-background`, where the default colour is the container's.
   *  Defaults to false. */
  onDark?: boolean
  /** Heading content. */
  children?: ReactNode
}

const HeadingInner = (
  {
    level,
    visualLevel,
    onDark = false,
    children,
    className = '',
    ...rest
  }: HeadingProps,
  ref: React.ForwardedRef<HTMLHeadingElement>,
) => {
  const Tag = `h${level}` as const
  const visual = visualLevel ?? level
  const classes = mergeClasses(
    'pathable-heading',
    HEADING_LEVEL_CLASS[visual],
    onDark ? 'pathable-heading--on-dark' : undefined,
    className,
  )
  return React.createElement(
    Tag,
    { ref, className: classes, ...rest },
    children,
  )
}

export const Heading = forwardRef(HeadingInner)
