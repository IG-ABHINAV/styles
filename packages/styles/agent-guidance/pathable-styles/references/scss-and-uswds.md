# SCSS and extending USWDS

Use this route only when the project already compiles Dart Sass and needs
something the compiled CSS cannot give it. Theming does not need Sass: override
CSS custom properties as described in [CSS consumption](css.md).

## What the SCSS route is for

- Using USWDS theme functions (`color()`, `family()`, `units()`, `type-scale()`)
  with PathAble's brand configuration, so custom styles resolve to brand values.
- Compiling USWDS components that the package does not include, themed with the
  PathAble brand.
- Building the PathAble styles into the application's own Sass output.

## Set it up

Install the package, USWDS and Dart Sass. LibSass and `node-sass` are not
supported.

```bash
pnpm add @pathableai/styles @uswds/uswds
pnpm add -D sass
```

Configure Sass with two load paths: `node_modules`, and USWDS's `packages`
directory. With the command-line compiler:

```bash
pnpm exec sass --quiet-deps \
  --load-path=node_modules \
  --load-path=node_modules/@uswds/uswds/packages \
  src/app.scss dist/app.css
```

Bundler Sass options take the same two paths (for example `loadPaths` or
`includePaths`). `pkg:@pathableai/styles` URLs do not resolve yet; use the
`src/index` path below.

## Load the PathAble entry first

```scss
@use '@pathableai/styles/src/index' as pathable;
```

This configures USWDS with the PathAble theme and emits the whole PathAble
library: tokens, components, utilities and fonts, about as large as the compiled
`dist/styles.css`. Use it once, in the application's root stylesheet, and do not
also import the compiled CSS.

The source emits font URLs relative to the compiled output (`../fonts/…`). Copy
the package's `fonts/` directory next to the output directory, or let the bundler
copy referenced assets.

## Use USWDS functions with the PathAble theme

After the PathAble entry, `uswds-core` is already configured, so its functions
resolve to brand values:

```scss
@use '@pathableai/styles/src/index' as pathable;
@use 'uswds-core' as uswds;

.app-callout {
  color: uswds.color('primary'); // #00365c, PathAble Blue
  font-family: uswds.family('heading'); // Fredoka
  padding: uswds.units(2); // 1rem
}
```

- Use theme tokens such as `'primary'`, `'accent-cool-dark'` and `'base-light'`.
  Do not use USWDS system tokens such as `'blue-warm-80v'`; they only
  approximate the brand.
- Do not read `$theme-*` settings directly. They are configuration inputs, not
  resolved values.
- Do not configure `uswds-core` again with `@use … with (…)`. The PathAble entry
  owns that configuration, and Sass allows a module to be configured only once.
- In styles other people will theme, prefer `var(--pathable-*)` custom
  properties over values resolved at compile time; compiled values do not follow
  runtime theme overrides.

## Add USWDS components the package does not include

The package already wraps almost every USWDS component; check the catalogue in
[`BRAND_RULES.md`](../../../BRAND_RULES.md#component-wrapper-naming-convention)
first. To add one it does not include, load that single USWDS package (a
directory under `@uswds/uswds/packages`) after the PathAble entry. It compiles
with the PathAble theme:

```scss
@use '@pathableai/styles/src/index' as pathable;
@use 'usa-example-component'; // Replace with the USWDS package name.
```

- Load only the packages you need. `@use 'uswds'` loads every USWDS package and
  its full utility set, which adds over 300 KB of CSS, most of it unused.
- Do not import USWDS's precompiled CSS. It is unbranded and duplicates styles.
- A USWDS component added this way uses `.usa-*` class names; the package does
  not give it a `.pathable-*` name. If more than one product needs it, ask for a
  wrapper in `@pathableai/styles` instead.

## Know the current limits

- The SCSS entry emits CSS wherever it is used. There is not yet a module that
  exposes only tokens, functions and mixins, so `@use` it once.
- USWDS must be installed and on the load path; it is not yet encapsulated.
- The package builds against a pinned, patched USWDS 3.x. Your install may
  resolve a different 3.x version. The patch's Sass changes only fix Sass
  deprecations, which `--quiet-deps` hides.
