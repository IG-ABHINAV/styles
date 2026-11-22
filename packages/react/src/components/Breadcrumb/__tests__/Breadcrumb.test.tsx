import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Breadcrumb } from '../Breadcrumb'

describe('Breadcrumb', () => {
  it("wraps each link's text in a span so the breadcrumb underline can draw", () => {
    const { container } = render(
      <Breadcrumb
        aria-label="Breadcrumb"
        items={[
          { content: 'Home', href: '/' },
          { content: 'Participants', href: '/participants' },
          { content: 'Ada Lovelace', current: true },
        ]}
      />,
    )

    const links = container.querySelectorAll('a.pathable-breadcrumb__link')
    expect(links).toHaveLength(2)
    expect([...links].map((link) => link.textContent)).toEqual([
      'Home',
      'Participants',
    ])
    for (const link of links) {
      expect(link.children).toHaveLength(1)
      expect(link.children[0].tagName).toBe('SPAN')
      expect(link.children[0].textContent).toBe(link.textContent)
    }

    const current = container.querySelector('[aria-current="page"]')
    expect(current).not.toBeNull()
    expect(current!.querySelector('a')).toBeNull()
    expect(current!.textContent).toBe('Ada Lovelace')
  })

  it('does not wrap an item that has no href', () => {
    const { container } = render(<Breadcrumb items={[{ content: 'Home' }]} />)
    const item = container.querySelector('li.pathable-breadcrumb__list-item')
    expect(item).not.toBeNull()
    expect(item!.querySelector('a')).toBeNull()
    expect(item!.querySelector('span')).toBeNull()
    expect(item!.textContent).toBe('Home')
  })
})
