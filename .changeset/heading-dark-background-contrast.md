---
'@pathableai/styles': patch
---

A `pathable-heading` that sits in a `pathable-dark-background`, directly or in a direct-child `pathable-stack`, `pathable-cluster` or `pathable-container`, is now drawn in the reverse text colour (white), like the `p` and `span` elements there, instead of the theme text colour. A heading in a light surface, card or modal nested in the container keeps the theme text colour. In the default theme the heading was the same colour as the container (1.00:1) and is now 12.48:1.
