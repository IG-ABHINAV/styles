import { expect, within } from 'storybook/test'

import { contrastRatio, findOpaqueBackground } from '../shared/contrast'

export default {
  title: 'Layout Composition/Dark Background',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\n`.pathable-dark-background` is a PathAble Blue container whose text is drawn in the reverse colour.',
      },
    },
  },
}

const levels = [1, 2, 3, 4, 5, 6]

export const HeadingContrast = {
  parameters: {
    docs: {
      description: {
        story:
          'A `.pathable-heading` at each of the six levels inside `.pathable-dark-background`. The heading takes the same white as the `p` and `span` text in the container instead of the theme text colour, which is the container colour in the default theme. A heading in a light `.pathable-surface--raised` nested in the container keeps the theme text colour. The play function checks every level, and the nested heading, against the background behind it for a contrast of at least 4.5:1.',
      },
    },
  },
  render: () => `
    <div class="pathable-dark-background pathable-padding-3">
      ${levels
        .map(
          (level) =>
            `<h${level} class="pathable-heading pathable-heading--level-${level}">Heading level ${level}</h${level}>`,
        )
        .join('')}
      <p>Body text in the same container.</p>
      <div class="pathable-surface pathable-surface--raised pathable-padding-3">
        <h3 class="pathable-heading pathable-heading--level-3">Heading in a light surface</h3>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Dark background story window is unavailable')

    for (const level of levels) {
      const heading = canvas.getByRole('heading', {
        name: `Heading level ${level}`,
      })
      const background = findOpaqueBackground(heading, view)
      const ratio = contrastRatio(
        view.getComputedStyle(heading).color,
        background,
      )

      await expect(ratio).toBeGreaterThanOrEqual(4.5)
    }

    const nested = canvas.getByRole('heading', {
      name: 'Heading in a light surface',
    })

    await expect(
      contrastRatio(
        view.getComputedStyle(nested).color,
        findOpaqueBackground(nested, view),
      ),
    ).toBeGreaterThanOrEqual(4.5)
  },
}
