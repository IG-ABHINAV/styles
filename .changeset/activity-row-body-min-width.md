---
'@pathableai/styles': patch
---

Fix `pathable-activity-row__title` and `pathable-activity-row__context` collapsing to zero width beside long status, date and owner text above 640px. The row body now starts from half the row width, so long side text shrinks first and the title and context truncate with an ellipsis.
