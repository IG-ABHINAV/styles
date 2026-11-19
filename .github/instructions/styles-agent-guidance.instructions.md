---
applyTo: 'packages/styles/**'
---

# Styles consumer guidance review

When reviewing changes under `packages/styles`, consider whether they change the
consumer-visible contract described in
`packages/styles/agent-guidance/pathable-styles/`.

Request a guidance update when a change affects public entry points, the CSS or
SCSS consumption routes, token or class naming conventions, theming, the
JavaScript helpers, accessibility or performance expectations, or which USWDS
details consumers must know about.

Do not request guidance churn for tests, stories, formatting, individual
component styling, new classes that follow the documented naming conventions,
or refactors with no consumer-visible effect. The installed package's compiled
CSS remains the source of truth.

The package's intent, which the guide summarises, is owned by
`docs/styles/intent.md`; a change to the package's purpose or priorities
updates that document first.
