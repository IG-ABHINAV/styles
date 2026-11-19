---
'@pathableai/styles': patch
---

Load utilities after components in the full stylesheet (`@pathableai/styles`,
`dist/styles.css`), the order the split `components` then `utilities` imports
and `@pathableai/react` already use. A utility class on a component, such as
`pathable-margin-x-2` on `pathable-container` or `pathable-flex-align-start` on
`pathable-cluster`, now wins over the component's own declaration of the same
specificity in every entry point. Applications on the full stylesheet that
relied on the component rule beating such a utility will see the utility apply.
