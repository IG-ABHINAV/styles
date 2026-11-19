---
'@pathableai/styles': patch
---

`pathable-workflow-panel--offline` no longer dims the continue button or blocks the pointer on it. Before, the button looked disabled and ignored the mouse, but stayed in the tab order and still activated from the keyboard, and assistive technology was not told it was disabled. The modifier now shows the offline status only. Disable the continue button with `disabled` or `aria-disabled="true"` when offline; `pathable-button` styles both.
