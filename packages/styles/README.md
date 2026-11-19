# @pathableai/styles

The PathAble design system's foundation: design tokens as CSS custom
properties, `.pathable-*` component, layout, pattern and utility classes,
self-hosted brand fonts and icons, small JavaScript helpers, and the SCSS
source they are built from. Every other PathAble design-system package,
including [`@pathableai/react`](https://www.npmjs.com/package/@pathableai/react),
builds on it.

It began as the [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/)
themed with the PathAble brand, and it is now also where PathAble defines the
patterns and tokens its products share. It is built for people who rely on
accessible interfaces, often on low-end devices and unstable networks, and
puts accessibility first, then low-end devices, then unstable networks, then
brand.

PathAble products are its main users, but it is public domain
([Unlicense](#license)): anyone may use it as their own style library, and
contributions are welcome. The full statement of purpose, priorities,
distribution model and known gaps is
[the package intent on GitHub](https://github.com/PathableAI-org/styles/blob/main/docs/styles/intent.md).

## What This Package Includes

- Brand, semantic, typography, spacing, radius and elevation tokens, as CSS
  custom properties
- Light theme defaults, and dark and high-contrast theme foundations
- `.pathable-*` wrappers for USWDS components, plus PathAble layouts and
  patterns USWDS does not have
- `.pathable-*` utility classes with responsive and state variants
- Self-hosted brand fonts and icons
- JavaScript helpers for the components that need browser behaviour
- SCSS source for consumers who compile with Sass
- Brand rules and [agent guidance](#agent-guidance) that match the installed
  version

## Brand Colors

| Name               |       Hex |
| ------------------ | --------: |
| Intelligent Jade   | `#1cae96` |
| PathAble Blue      | `#00365c` |
| Bright Blue Brooks | `#4899e8` |
| Tech Teal          | `#015a76` |
| Lived-In Lime      | `#d3ff66` |
| Shilling Silver    | `#dde2e8` |

## Typography

| Use               | Font         | Weight    |
| ----------------- | ------------ | --------- |
| Heading           | `Fredoka`    | `Regular` |
| Alternate Heading | `Montserrat` | `Bold`    |
| Subheading        | `Poppins`    | `Bold`    |
| Body Text         | `Nunito`     | `Regular` |

## Usage

Install the package:

```bash
pnpm add @pathableai/styles
```

There are two ways to consume it:

| Route                  | Use it when                                                                                                                                             | Needs                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Compiled CSS (default) | Almost always. Import a stylesheet and theme with CSS custom properties.                                                                                | Nothing beyond the package.                   |
| SCSS (opt-in)          | The project already compiles Dart Sass and needs USWDS theme functions with PathAble's configuration, or USWDS components the package does not include. | Dart Sass, `@uswds/uswds` and two load paths. |

The compiled CSS is the package's public contract. Every token available to
SCSS is also a CSS custom property, so choosing CSS never loses a token.

Import the compiled CSS entry point to get all default styles, tokens, and utilities:

```css
/* Full import — components, utilities, and default theme tokens */
@import '@pathableai/styles';
```

CSS-only consumers that supply a complete application-owned theme can import
only the component and utility layers without loading the default tokens:

```css
/* Component styles and utilities only — no default :root theme tokens */
@import '@pathableai/styles/components';
@import '@pathableai/styles/utilities';
/* Define the complete application-owned token set separately. */
```

React consumers should import only `@pathableai/react`, which loads the default
theme, component, and utility layers automatically. Use `ThemeProvider` for
scoped runtime overrides.

The root import and all three subpath imports resolve to corresponding files
under `dist/`:

| Import                          | Resolves to              |
| ------------------------------- | ------------------------ |
| `@pathableai/styles`            | `dist/styles.css`        |
| `@pathableai/styles/components` | `dist/components.css`    |
| `@pathableai/styles/utilities`  | `dist/utilities.css`     |
| `@pathableai/styles/theme`      | `dist/theme-default.css` |

### SCSS (`@use`)

Install Dart Sass and USWDS, then use the published source entry once, in the
application's root stylesheet:

```bash
pnpm add @pathableai/styles @uswds/uswds
pnpm add -D sass
```

```scss
@use '@pathableai/styles/src/index' as pathable;
```

This configures USWDS with the PathAble theme and emits the whole library
(about as large as `dist/styles.css`), so do not also import the compiled CSS.
Give Sass two load paths, `node_modules` and USWDS's `packages` directory. With
the command-line compiler:

```bash
pnpm exec sass --quiet-deps --load-path=node_modules --load-path=node_modules/@uswds/uswds/packages src/app.scss dist/app.css
node -e "require('node:fs').cpSync('node_modules/@pathableai/styles/fonts', 'fonts', { recursive: true })"
```

The source emits font URLs relative to the compiled CSS (`../fonts/…`); let
your bundler copy those assets, or copy them as above. `pkg:@pathableai/styles`
URLs do not resolve yet.

### Built on USWDS

The package configures the USWDS v3.x theme with the exact PathAble brand
values and wraps USWDS components as `.pathable-*` classes. The compiled CSS
already contains every USWDS component the wrappers use, compiled with that
theme.

The `.pathable-*` classes and `--pathable-*` custom properties are the contract.
`.usa-*` classes and `--usa-*` properties come from USWDS and can change with a
USWDS upgrade; use them only where this package's documentation says to. The
goal is for consumers never to need USWDS directly. That is not complete yet:
the SCSS route needs USWDS installed, and some JavaScript-driven components
need `.usa-*` classes in their markup.

SCSS consumers can build on USWDS with the PathAble theme. After the PathAble
entry, USWDS theme functions resolve to brand values, and individual USWDS
packages compile with the brand:

```scss
@use '@pathableai/styles/src/index' as pathable;
@use 'uswds-core' as uswds;

.app-callout {
  color: uswds.color('primary'); // #00365c, PathAble Blue
}
```

Load individual USWDS packages rather than `@use 'uswds'`, which adds the whole
USWDS utility set (over 300 KB of CSS). Importing USWDS's precompiled CSS adds
stock, unbranded components; it does not apply the PathAble theme. The
[SCSS and extending USWDS guide](agent-guidance/pathable-styles/references/scss-and-uswds.md)
covers this in full.

### Token Usage

Use exported tokens instead of hardcoded colors or font names whenever possible.

```css
.example {
  color: var(--pathable-color-text);
  background: var(--pathable-color-surface);
  font-family: var(--pathable-font-body);
}
```

## Agent guidance

This package ships an Agent Skill-shaped guide for coding agents at
`agent-guidance/pathable-styles/SKILL.md`. Because it is installed with the
package, it always matches the version in use. Agents that discover skills from
a skills directory will not find a guide inside `node_modules` automatically,
so add this pointer to the consuming repository's root `AGENTS.md`,
`CLAUDE.md` or equivalent agent instructions:

> When creating or editing UI that uses `@pathableai/styles` directly, locate
> the installed `@pathableai/styles` package and read
> `agent-guidance/pathable-styles/SKILL.md` from that package before making
> changes. Read only the linked reference relevant to the task.

The usual npm layout places it at
`node_modules/@pathableai/styles/agent-guidance/pathable-styles/SKILL.md`, but
agents should resolve the installed package rather than assume that location;
pnpm and other package managers may use a different physical path.

Applications that use `@pathableai/react` should point their agents at that
package's guide first; this guide applies to any CSS they write beside it.

`AGENTS.md` in this package holds the rules for contributors changing the
package itself, not consumer guidance.

## Theming

Override semantic color tokens with the typed theming API in
`@pathableai/react`. Package defaults use zero selector specificity, so CSS-only
consumers can also define an application-wide theme with `:root` declarations.
The canonical theming documentation lives under `docs/theming/`:

- [Consumer guide on GitHub](https://github.com/PathableAI-org/styles/blob/main/docs/theming/consumer-guide.md) — override with
  `createTheme` + `ThemeProvider`, extend `defaultTheme`, and understand
  automatic React styles versus CSS-only imports.
- [Token vocabulary on GitHub](https://github.com/PathableAI-org/styles/blob/main/docs/theming/token-vocabulary.md) — every overridable
  color token with its CSS custom property, default value, and role.

## Modal open shell

Open Modal markup uses styles-owned classes. No ad-hoc consumer overlay CSS is
required for backdrop or centering.

| Layer   | Classes                              | Role                                      |
| ------- | ------------------------------------ | ----------------------------------------- |
| Wrapper | `.pathable-modal-wrapper.is-visible` | Fixed open shell; add `.is-visible` open  |
| Overlay | `.pathable-modal-overlay`            | Dimmed full-viewport backdrop + centering |
| Dialog  | `.pathable-modal` and `.usa-modal`   | Dialog panel (dual-class)                 |

PathAble-only wrapper and overlay classes with `.is-visible` on the wrapper are
enough for the open presentation (backdrop + centering) without USWDS JavaScript.
When dual-classing (for example `@pathableai/react`), also include
`.usa-modal-wrapper` and `.usa-modal-overlay` beside the PathAble shell classes.
The overlay fits the viewport and keeps the dialog inside it and centred within
the overlay at every width, down to 320 px. Place only the dialog inside the overlay: the overlay sets
`font-size: 0` so the dialog stays on its centring line, and the dialog sets its
own font size.
See BRAND_RULES.md for the full PathAble ↔ USWDS Modal catalogue.

## Guidance

See BRAND_RULES.md for full color and typography guidance.
See the [agent guidance](#agent-guidance) for coding agents that consume this package, and AGENTS.md for contributors changing it.
See the [story authoring guide on GitHub](https://github.com/PathableAI-org/styles/blob/main/packages/styles/STORY_AUTHORING.md) for its checklist and PR requirements.
Applications SHOULD consume semantic tokens like --pathable-color-text instead of directly using brand colors like #00365c.
Brand colors SHOULD be used through this package so changes can be made centrally.

## Accessibility

PathAble styles should prioritize readability, contrast, and usability. When a brand color combination does not provide sufficient contrast, accessibility MUST take priority over visual preference.

## Contributing

Issues and pull requests are welcome at
[PathableAI-org/styles](https://github.com/PathableAI-org/styles). The repository
[README](https://github.com/PathableAI-org/styles#readme) covers setup, and the
[package intent](https://github.com/PathableAI-org/styles/blob/main/docs/styles/intent.md)
says what belongs in this package.

## License

Unlicense
