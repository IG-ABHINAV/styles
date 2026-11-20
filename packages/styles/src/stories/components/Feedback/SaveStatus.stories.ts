export default {
  title: 'Components/Feedback/SaveStatus',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. Put the indicator in a `role="status"` container that is on the page before the state changes, and swap the state modifier in application code as saving progresses.',
      },
    },
  },
}

const states = ['loading', 'saving', 'saved', 'offline', 'error']

export const States = {
  render: () =>
    `<div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; font-family: var(--pathable-font-body); color: var(--pathable-color-text); background: var(--pathable-color-surface);">
${states.map((s) => `      <div role="status"><span class="pathable-save-status pathable-save-status--${s}"></span></div>`).join('\n')}
    </div>`,
}

export const OnPageBackground = {
  render: () =>
    `<div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; font-family: var(--pathable-font-body); color: var(--pathable-color-text); background: var(--pathable-color-bg);">
${states.map((s) => `      <div role="status"><span class="pathable-save-status pathable-save-status--${s}"></span></div>`).join('\n')}
    </div>`,
}
