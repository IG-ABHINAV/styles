# `@pathableai/styles` intent

This document says what `@pathableai/styles` is for, who it serves, what it
prioritises, how it is distributed and where it is heading. It is the canonical
statement of the package's intent for people and for agents. It owns intent
only: the rules that govern changes live in the
[constitution](../../.specify/memory/constitution.md), repository-wide intent and
release flow in [Repository intent](../engineering/intent.md), and contributor
rules for the package in
[`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md).

Use this document to decide whether a change belongs in the package and how it
should be shaped. When it and a rule document disagree, the rule document wins
and this document should be corrected.

## What it is

`@pathableai/styles` is the PathAble design system's foundation. Every other
package in this repository consumes it, and none redefines it (constitution
principles I and XI). It ships:

- design tokens as CSS custom properties: brand colours, semantic colours,
  typography, spacing, radius, elevation and component tokens;
- `.pathable-*` component, layout, pattern and utility classes;
- self-hosted brand fonts and icons;
- small JavaScript helpers for components that need browser behaviour;
- its SCSS source, for consumers who compile with Sass;
- brand rules and agent guidance that match the installed version.

## Where it came from and where it is going

The package started as a way to dress the
[U.S. Web Design System (USWDS)](https://designsystem.digital.gov/) in the
PathAble brand: configure USWDS's theme with PathAble colours and type, and give
every USWDS component a `.pathable-*` name.

It has grown past that. It is now also where PathAble defines the patterns and
tokens its products share that USWDS does not have, such as application shells,
workflow and wizard layouts, save status, KPI grids, filter bars, resource cards,
skeleton loading and marketing patterns. New shared patterns belong here, not in
an individual product.

USWDS remains the base layer. It gives the package a large, tested,
accessibility-reviewed component foundation, and there is no plan to replace
it. What changes over time is how visible it is to consumers (see
[USWDS: built on, not exposed](#uswds-built-on-not-exposed)).

## Who it serves

1. **PathAble products.** They are the reason the package exists and the
   audience every decision is weighed for. Most products consume it through
   `@pathableai/react`, which loads the compiled CSS for them.
2. **Coding agents in those products.** They build UI from the guidance shipped
   inside the installed package, so that guidance is part of the published
   contract (see [Agents](#agents)).
3. **Anyone else.** The package is released into the public domain under the
   [Unlicense](../../LICENSE). Other teams may use it as their own style library,
   fork it, or take parts of it, and contributions are welcome. Realistically
   PathAble will be its main user, so PathAble's needs decide trade-offs, but
   the package should never assume a consumer is PathAble: no private hosts,
   no PathAble-only build tooling, no undocumented conventions.

## What it prioritises

PathAble serves people who rely on accessible interfaces, often on low-end
devices and unstable network connections. The package's priorities follow from
that, in this order when they conflict:

### 1. Accessibility

Accessibility is a release requirement, not a polish step (constitution
principle X). In practice:

- colour and focus tokens are chosen to meet WCAG contrast; when the brand and
  contrast disagree, contrast wins ([`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md));
- components keep native semantics, visible focus and non-colour cues;
- components are evaluated for narrow layouts, text resizing, long content,
  forced colours and reduced motion (principle XV);
- stable Storybook stories run automated accessibility checks, with only
  narrow, documented exceptions.

The package does not claim WCAG compliance for products built with it. It
avoids the traps it can control so that products can meet the standard.

### 2. Low-end devices

A change should not assume a fast processor or plenty of memory:

- styling works with CSS alone. JavaScript adds behaviour to the few components
  that need it and is never required to make content visible or readable;
- prefer plain CSS (custom properties, flexbox, grid, media queries) over
  JavaScript for layout and state presentation;
- avoid expensive effects on large areas (large blurs, heavy shadows,
  continuous animation), and respect `prefers-reduced-motion`;
- keep selectors simple and the compiled output as small as the contract
  allows; output size is a cost every consumer pays on every page.

### 3. Unstable networks

A change should degrade gracefully when assets arrive late or not at all:

- fonts are self-hosted with the package (no third-party font CDN) and use
  `font-display: swap` with system fallbacks, so text is readable before fonts
  arrive;
- the package loads nothing from third-party hosts; its fonts and icons are
  served from wherever the product serves the package's files;
- components keep a usable layout before images, icons or scripts load;
- loading, empty and error states are part of a component's contract where
  they apply.

### 4. Brand

PathAble's colours, type and tone are applied consistently, through tokens, so
that products look like one product. The brand gives way to the three
priorities above when they conflict.

## How it is distributed

The package has two consumption routes. Both are supported; they are not equal.

### Compiled CSS (primary)

The compiled CSS in `dist/` is the package's public contract (constitution
principle II). A consumer installs the package and imports a stylesheet; no
Sass, no build plugin and no USWDS knowledge is needed. Theming is done by
overriding CSS custom properties at runtime, which works in any framework and
needs no rebuild. This is the route `@pathableai/react` uses and the one most
consumers should use.

### SCSS source (secondary, opt-in)

The SCSS source in `src/` ships for consumers who already compile Sass and want
to build on the package: use its mixins and USWDS's theme functions with
PathAble's configuration, or compile brand-aligned USWDS components the package
does not wrap (principle III). Every published Sass value also exists as a CSS
custom property, so the SCSS route never has tokens the CSS route lacks.

The package README's
[SCSS section](../../packages/styles/README.md#scss-use) gives the current setup.

### SCSS distribution conventions, and where the package stands

Sass libraries have settled on a few conventions. This table records which ones
the package follows today, so that consumers know what to expect and
contributors know what is outstanding.

| Convention                                                                                                                                                         | Status                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ship compiled CSS so most consumers never need Sass.                                                                                                               | Followed.                                                                                                                                                                               |
| Ship the source and write it with the module system (`@use`/`@forward`), not `@import`.                                                                            | Followed. `src/` has no `@import`.                                                                                                                                                      |
| Support Dart Sass only.                                                                                                                                            | Followed (constitution stack constraints).                                                                                                                                              |
| Offer one documented entry module, resolvable as `@use 'pkg:<name>'` through Dart Sass's Node package importer (a `"sass"` condition in `exports`) or an `_index`. | Not yet. The entry is `@pathableai/styles/src/index`, found through `--load-path=node_modules`; `pkg:@pathableai/styles` does not resolve.                                              |
| Separate modules that only expose tokens, functions and mixins from modules that emit CSS, so a consumer can `@use` the API without duplicating the library.       | Not yet. `src/index` emits the whole library (about 800 KB of CSS) wherever it is used.                                                                                                 |
| Resolve the library's own dependencies without consumer configuration.                                                                                             | Not yet. Consumers must add `node_modules/@uswds/uswds/packages` as a load path and install `@uswds/uswds` themselves.                                                                  |
| Expose configuration through `!default` variables and `@use … with (…)`.                                                                                           | Deliberately limited. Only `$theme-font-path` is configurable. Theming goes through CSS custom properties so that both routes theme the same way.                                       |
| Compile the same for consumers as for the package's own build.                                                                                                     | Mostly. The package builds against a patched USWDS 3.13.0; consumers install upstream USWDS within `^3.0.0`. The Sass part of the patch only fixes deprecations, so output is the same. |

## USWDS: built on, not exposed

USWDS is an implementation detail of the package's code and an open part of its
documentation:

- **In code**, the goal is encapsulation. A consumer should be able to use
  everything the package offers without installing USWDS, configuring Sass load
  paths for it, using `.usa-*` classes or `--usa-*` properties, or knowing which
  USWDS version is inside. `.pathable-*` names and `--pathable-*` properties are
  the contract; `.usa-*` and `--usa-*` names are not, and may change with a USWDS
  upgrade.
- **In documentation**, the package is open about USWDS. It says which USWDS
  component each wrapper builds on, how the theme is configured, and how SCSS
  consumers can extend USWDS with PathAble's configuration. Hiding the base layer
  would make the package harder to extend, debug and contribute to.

Encapsulation is not complete yet. Today a consumer can still see USWDS:

- the SCSS route needs `@uswds/uswds` installed and its `packages` directory on
  the Sass load path;
- some JavaScript-driven components must carry both `.usa-*` and `.pathable-*`
  classes in their markup;
- most token and utility values are emitted twice, as `--pathable-*` and
  `--usa-*`;
- the published JavaScript helper is a patched USWDS bundle.

Each of these is a known gap, not a contract. Closing one is a change to the
package's public surface and follows the release rules in constitution principle
XIII.

## Agents

Agents are first-class consumers. The package ships an
[Agent Skill-shaped guide](../../packages/styles/agent-guidance/pathable-styles/SKILL.md)
inside its tarball, at `agent-guidance/pathable-styles/SKILL.md`. Because it is
installed with the package, the guidance always matches the version a product
is using. A product points its agent at the installed copy (the package
[README](../../packages/styles/README.md#agent-guidance) gives the pointer), rather
than copying guidance into its own repository where it would go stale.

`@pathableai/react` ships its own guide for React work; it builds on this one
and does not repeat it.

The shipped guide is part of the published contract. A change to the public
surface of the package (classes, tokens, entry points, consumption routes) must
review it, as
[the styles guidance instructions](../../.github/instructions/styles-agent-guidance.instructions.md)
describe.

## Deciding whether a change belongs here

A change belongs in `@pathableai/styles` when it is:

- a visual foundation (token, font, icon) or a component, layout or pattern
  that more than one PathAble product needs or is likely to need;
- framework-neutral: expressible as HTML, CSS custom properties and classes,
  with JavaScript only for behaviour CSS cannot provide;
- consistent with the priorities above.

It does not belong here when it is specific to one product's domain, depends on
a framework, or only adds framework ergonomics over an existing styles contract
(that belongs in the framework package, such as `@pathableai/react`).

New visual behaviour lands here before any framework package exposes it
(constitution "Source-first sequencing").

## Non-goals

- **Replacing USWDS.** USWDS stays as the base layer.
- **Framework components.** The package stays framework-neutral; React lives in
  `@pathableai/react`.
- **Certifying product accessibility.** The package removes traps; products are
  still responsible for their own conformance.
- **Serving every possible consumer equally.** Outside use is welcome, but
  PathAble's needs decide trade-offs.

## Known gaps

These are the main distances between this intent and the package as of 0.5.0.
They are not scheduled here; open delivery issues are the backlog
([Repository intent](../engineering/intent.md#how-a-consumer-need-flows)).

- The SCSS route does not follow the conventions marked "Not yet" above.
- USWDS encapsulation is incomplete, as listed above.
- Compiled CSS is not minified: `dist/styles.css` is about 800 KB raw and 74 KB
  gzipped, and `dist/components.css` about 740 KB raw and 68 KB gzipped. Most
  of that is USWDS component CSS a product may not use. For low-end devices,
  minified output and smaller component bundles would help.
- The package's contributor rules (`AGENTS.md`) ship in the tarball beside the
  consumer guide. Consumer agents should use the shipped guide instead.
