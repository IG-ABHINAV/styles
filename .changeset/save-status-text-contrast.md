---
'@pathableai/styles': patch
---

The `pathable-save-status` saved, offline and error states no longer set Intelligent Jade, amber and red on their symbol and label, which were below 4.5:1 on white or on the page background. They now inherit the surrounding text colour, so the contrast follows the surface they sit on (12.5:1 on white and 9.6:1 on the page background with `--pathable-color-text`). The symbol and the label word still tell the states apart.
