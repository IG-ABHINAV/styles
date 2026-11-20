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
          'A `.pathable-heading` with `.pathable-heading--on-dark` at each of the six levels inside `.pathable-dark-background`, directly and inside a plain wrapper. The modifier draws the heading in white, like the `p` and `span` text in the container; without it the heading takes the theme text colour, which is the container colour in the default theme. A heading in a light card inside the container, without the modifier, keeps the theme text colour on the card. The play function checks each heading against the background behind it for a contrast of at least 4.5:1.',
      },
    },
  },
  render: () => `
    <div class="pathable-dark-background pathable-padding-3">
      ${levels
        .map(
          (level) =>
            `<h${level} class="pathable-heading pathable-heading--level-${level} pathable-heading--on-dark">Heading level ${level}</h${level}>`,
        )
        .join('')}
      <p style="font-family: var(--pathable-font-body)">Body text in the same container.</p>
      <div>
        <div>
          <h3 class="pathable-heading pathable-heading--level-3 pathable-heading--on-dark">Heading in plain wrappers</h3>
        </div>
      </div>
      <div class="pathable-card">
        <div class="pathable-card__container">
          <h3 class="pathable-heading pathable-heading--level-3">Heading in a card</h3>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Dark background story window is unavailable')

    const names = [
      ...levels.map((level) => `Heading level ${level}`),
      'Heading in plain wrappers',
      'Heading in a card',
    ]

    for (const name of names) {
      const heading = canvas.getByRole('heading', { name })

      await expect(headingContrast(heading, view)).toBeGreaterThanOrEqual(4.5)
    }
  },
}
