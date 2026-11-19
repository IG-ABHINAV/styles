---
name: pathable-styles
description: Build or revise interfaces that use @pathableai/styles directly, including choosing CSS or SCSS consumption, PathAble tokens and classes, theming, accessibility, performance on low-end devices, and extending USWDS with the PathAble theme.
---

# PathAble Styles

`@pathableai/styles` is the PathAble design system's foundation: design tokens
as CSS custom properties, `.pathable-*` component, layout, pattern and utility
classes, self-hosted fonts and icons, small JavaScript helpers, and SCSS
source. It is built on the U.S. Web Design System (USWDS), themed with the
PathAble brand, and extended with patterns PathAble products share.

If the application imports `@pathableai/react`, read that package's
`agent-guidance/pathable-react/SKILL.md` first. React components already add
the classes and load the CSS described here; do not import these stylesheets
again.

## Work from the installed contract

- This guide ships inside the installed package, so it matches the version in
  use. Resolve the installed package rather than assuming a path.
- Import only the public entry points listed in the package
  [README](../../README.md#usage). Do not import `dist/*` files by path.
- The compiled CSS and its `--pathable-*` custom properties are the contract.
  `.usa-*` classes and `--usa-*` properties are USWDS internals that may change
  with a USWDS upgrade; use them only where the package's documentation tells
  you to.
- Do not infer an exhaustive class or token list from this guide. The
  installed `dist/*.css` files and the README are the source of truth.
- If documentation and the compiled CSS disagree, follow the CSS and report
  the documentation drift.

## Honour the package's priorities

PathAble serves people who rely on accessible interfaces, often on low-end
devices and unstable networks. Weigh choices in this order:

1. **Accessibility.** Keep native semantics, accessible names, visible focus
   and non-colour cues. Check contrast before pairing colours for text; when
   the brand and contrast disagree, contrast wins.
2. **Low-end devices.** Make content visible and usable with CSS alone; use
   JavaScript only for behaviour CSS cannot provide. Avoid large blurs, heavy
   shadows and continuous animation, and respect `prefers-reduced-motion`.
3. **Unstable networks.** Keep layouts usable before fonts, images, icons or
   scripts arrive. Do not add third-party font or asset hosts; the package
   self-hosts its fonts with system fallbacks.
4. **Brand.** Apply PathAble colours and type through tokens.

## Choose a consumption route

- **Compiled CSS (default).** Import a stylesheet and theme with CSS custom
  properties. No Sass, build plugin or USWDS knowledge is needed. Read
  [CSS consumption](references/css.md).
- **SCSS (opt-in).** Use only when the project already compiles Dart Sass and
  needs PathAble's mixins, USWDS theme functions with the PathAble
  configuration, or brand-aligned USWDS components the package does not wrap.
  Read [SCSS and extending USWDS](references/scss-and-uswds.md).

Do not combine routes for the same styles. Compiling the SCSS entry and also
importing the compiled CSS ships the library twice.

## Use tokens and classes, not raw values

- Use semantic tokens such as `--pathable-color-text`,
  `--pathable-color-surface`, `--pathable-color-border`,
  `--pathable-color-link` and `--pathable-color-focus-ring` for application
  UI. Use raw brand tokens only to define a theme or document the palette.
- Use `.pathable-{component}`, `.pathable-{component}__{element}` and
  `.pathable-{component}--{modifier}` classes for components, and
  `.pathable-*` utility classes for spacing, colour, display, flex and
  typography before writing custom CSS.
- Use a component's existing open, loading, empty, error and disabled states
  rather than styling your own.
- Do not invent brand colours, typography rules, component modifiers or token
  names. Name any application token by role (`--app-color-callout-bg`), not by
  appearance.
- For JavaScript-driven components, follow the markup and class rules in
  [`BRAND_RULES.md`](../../BRAND_RULES.md#component-wrapper-rules) exactly; some
  of them need more than one class on the same element.

## Route to focused guidance

- Brand palette, colour pairings, typography hierarchy, logos and the full
  component wrapper catalogue:
  [`BRAND_RULES.md`](../../BRAND_RULES.md).
- Imports, theming with custom properties, fonts and the JavaScript helpers:
  [CSS consumption](references/css.md).
- Sass setup, PathAble's USWDS theme functions and compiling extra USWDS
  components: [SCSS and extending USWDS](references/scss-and-uswds.md).

`AGENTS.md` in this package is for contributors changing the package itself.
Use it only to look up utility class patterns; follow this guide for
consuming the package.
