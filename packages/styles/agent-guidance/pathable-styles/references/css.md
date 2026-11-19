# CSS consumption

Use this route unless the project needs Sass for a reason listed in the
[skill](../SKILL.md#choose-a-consumption-route).

## Import one entry point

The package [README](../../../README.md#usage) lists the stylesheet entry points
and the files they resolve to. Choose one of these:

- **Default theme and everything else:** import `@pathableai/styles`. This is
  the right choice for most CSS-only applications.
- **Your own complete theme:** import `@pathableai/styles/components` and
  `@pathableai/styles/utilities`, then define every token the components use in
  your own stylesheet.

Import each stylesheet once, from the application's global styles, not from
individual components. An application that imports `@pathableai/react` already
has all of these and must not import them again.

## Theme with custom properties

Default token values are declared on `:where(:root)`, which has zero
specificity. Any application rule that sets the same property wins, whatever
the stylesheet order:

```css
:root {
  --pathable-color-accent: #015a76;
}

.marketing-section {
  /* Scoped override: applies to this subtree only. */
  --pathable-color-surface: #f4f7fa;
}
```

- Override semantic tokens (`--pathable-color-*` roles), not the raw brand
  tokens they are built from, so that one change updates every component that
  uses the role.
- Check text contrast for every colour you change, in each state (hover,
  focus, disabled) the token is used for.
- Treat a generated or algorithmic colour set as a draft until a person has
  reviewed it.

## Serve the fonts and icons

The compiled CSS loads fonts with relative URLs (`../fonts/…` from
`dist/styles.css`), and icons live in the package's `img/` directory. Most
bundlers copy referenced files automatically. If yours does not, or you serve
the CSS file without a bundler, serve the package's `fonts/` directory beside
its `dist/` directory so the relative URLs resolve.

Fonts use `font-display: swap` with system fallbacks, so text is readable
before they load. Do not replace them with a third-party font host.

## Load the JavaScript helpers only when needed

Most components need no JavaScript. Some USWDS-based components (for example
the accordion, combo box, date picker, header navigation, modal and tooltip)
need the browser helper for their interactive behaviour.

- `@pathableai/styles/js` is the helper bundle. It reads `window` and
  `document` when it runs, so load it once, in the browser, for example as a
  `defer` script. Never evaluate it on a server.
- `@pathableai/styles/js/init` is a tiny script for the document `<head>`. It
  marks the page as loading JavaScript so that components which depend on the
  helper do not flash in an unfinished state. If the helper has not loaded
  after 8 seconds, it removes the mark so content is still shown on slow or
  failed connections. Load it before the stylesheet-dependent content renders,
  and only together with the helper bundle.

Skip both when the page uses no JavaScript-driven component.
