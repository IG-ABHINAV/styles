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
          'A `.pathable-heading` at each of the six levels inside `.pathable-dark-background`. The container sets `--pathable-heading-color` to the same white as its `p` and `span` text, so a heading takes it at any depth instead of the theme text colour, which is the container colour in the default theme. The same heading in a plain wrapper, a nested stack, and a raised surface, an inset surface and a card nested in the container is checked too: the first two are white on the container, and the light containers reset the heading to the theme text colour on their own background. The play function checks each of them against the background behind it for a contrast of at least 4.5:1.',
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
      <p style="font-family: var(--pathable-font-body)">Body text in the same container.</p>
      <div>
        <h3 class="pathable-heading pathable-heading--level-3">Heading in a plain wrapper</h3>
      </div>
      <div class="pathable-stack">
        <div class="pathable-stack">
          <h3 class="pathable-heading pathable-heading--level-3">Heading in a nested stack</h3>
        </div>
      </div>
      <div class="pathable-surface pathable-surface--raised pathable-padding-3">
        <h3 class="pathable-heading pathable-heading--level-3">Heading in a raised surface</h3>
      </div>
      <div class="pathable-surface pathable-surface--inset pathable-stack pathable-padding-3">
        <h3 class="pathable-heading pathable-heading--level-3">Heading in an inset surface that is also a stack</h3>
      </div>
      <div class="pathable-bento-tile">
        <h3 class="pathable-heading pathable-heading--level-3">Heading in a bento tile</h3>
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

    for (const name of [
      'Heading in a plain wrapper',
      'Heading in a nested stack',
      'Heading in a raised surface',
      'Heading in an inset surface that is also a stack',
      'Heading in a bento tile',
      'Heading in a card',
    ]) {
      const nested = canvas.getByRole('heading', { name })
      const ratio = contrastRatio(
        view.getComputedStyle(nested).color,
        findOpaqueBackground(nested, view),
      )

      await expect(ratio).toBeGreaterThanOrEqual(4.5)
    }
  },
}
