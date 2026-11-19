---
'@pathableai/styles': patch
---

Fix `pathable-activity-row__title` and `pathable-activity-row__context` collapsing to zero width beside long status, date and owner text above 640px. The status label, date and owner now each stop at 15% of the row width, so the title and context keep room and truncate with an ellipsis, and short side text keeps its natural width.
