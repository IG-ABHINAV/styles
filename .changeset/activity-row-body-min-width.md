---
'@pathableai/styles': patch
---

Fix `pathable-activity-row__title` and `pathable-activity-row__context` collapsing to zero width beside long status, date and owner text above 640px. The row body now keeps a minimum width of 6rem there, so the side columns give up room first and the title and context truncate with an ellipsis.
