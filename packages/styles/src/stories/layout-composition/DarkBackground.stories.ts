import { expect, within } from 'storybook/test'

import { contrastRatio, findOpaqueBackground } from '../shared/contrast'

export default {
  title: 'Layout Composition/Dark Background',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\n`.pathable-dark-background` is a PathAble Blue container whose `p`, `span` and `a` text is drawn in the reverse colour.',
      },
    },
  },
}

const levels = [1, 2, 3, 4, 5, 6]

const headingContrast = (heading: HTMLElement, view: Window) =>
  contrastRatio(
    view.getComputedStyle(heading).color,
    findOpaqueBackground(heading, view),
  )

export const HeadingContrast = {
  parameters: {
    docs: {
      description: {
        story:
          'A `.pathable-heading` with `.pathable-heading--on-dark` at each of the six levels inside `.pathable-dark-background`, directly and inside a plain wrapper. The modifier draws the heading in white, like the `p` and `span` text in the container; without it the heading takes the theme text colour, which is the container colour in the default theme. A long word in a narrow box wraps inside it instead of running past the container. A heading in a light card inside the container, without the modifier, keeps the theme text colour on the card. The play function checks each heading against the background behind it for a contrast of at least 4.5:1.',
      },
    },
  },
  render: () => `
    <div class="pathable-dark-background pathable-padding-3 pathable-stack pathable-stack--gap-md">
      ${levels
        .map(
          (level) =>
            `<h${level} class="pathable-heading pathable-heading--level-${level} pathable-heading--on-dark">Level ${level}</h${level}>`,
        )
        .join('')}
      <p style="font-family: var(--pathable-font-body)">Body text in the same container.</p>
      <div>
        <div>
          <h3 class="pathable-heading pathable-heading--level-3 pathable-heading--on-dark">Wrapped title</h3>
        </div>
      </div>
      <div style="max-width: 8rem">
        <h3 class="pathable-heading pathable-heading--level-3 pathable-heading--on-dark">Disproportionately</h3>
      </div>
      <div class="pathable-inline" data-row>
        <h3 class="pathable-heading pathable-heading--level-3 pathable-heading--on-dark">Accommodations</h3>
        <button class="pathable-button" type="button">Go</button>
      </div>
      <div class="pathable-card">
        <div class="pathable-card__container">
          <h3 class="pathable-heading pathable-heading--level-3">Card title</h3>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Dark background story window is unavailable')

    const names = [
      ...levels.map((level) => `Level ${level}`),
      'Wrapped title',
      'Disproportionately',
      'Card title',
    ]

    for (const name of names) {
      const heading = canvas.getByRole('heading', { name })

      await expect(headingContrast(heading, view)).toBeGreaterThanOrEqual(4.5)
    }

    const narrow = canvas.getByRole('heading', { name: 'Disproportionately' })
    const narrowBox = narrow.parentElement

    if (!narrowBox) throw new Error('Narrow heading box is unavailable')

    const row = canvasElement.querySelector<HTMLElement>('[data-row]')
    const rowHeading = row?.querySelector<HTMLElement>('h3')

    if (!row || !rowHeading) throw new Error('Row heading is unavailable')

    // In a row beside a button the heading shrinks and breaks the word, so it
    // stays inside the dark container.
    await expect(rowHeading.getBoundingClientRect().right).toBeLessThanOrEqual(
      row.getBoundingClientRect().right + 1,
    )

    // The long word wraps inside its box instead of running past the dark
    // container, where white text would be on the white page.
    await expect(narrow.scrollWidth).toBeLessThanOrEqual(narrowBox.clientWidth)
  },
}
