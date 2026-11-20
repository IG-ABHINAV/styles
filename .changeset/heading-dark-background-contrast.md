---
'@pathableai/styles': patch
---

A `pathable-heading` inside a `pathable-dark-background` is now drawn in white, like the `p` and `span` elements there, at any depth, instead of the theme text colour. In the default theme the heading was the same colour as the container (1.00:1) and is now 12.48:1. The colour comes from the new `--pathable-heading-color` property, which the container sets and the surface variants with a light background, `pathable-card`, `pathable-modal` and the other components with a light background of their own reset, so a heading in one of them nested in the container keeps the theme text colour on its own background.
