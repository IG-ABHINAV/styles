---
'@pathableai/styles': patch
---

The `pathable-save-status` saved, offline and error states now set their symbol and label in `--pathable-color-text` (PathAble Blue, 12.5:1 on white and 9.6:1 on the page background) instead of Intelligent Jade, amber and red, which were below 4.5:1 on white or on the page background. The symbol and the label word still tell the states apart. The React `SaveStatus` inherits the fix.
