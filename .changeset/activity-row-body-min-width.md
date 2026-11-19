---
'@pathableai/styles': patch
---

Fix `pathable-activity-row__title` and `pathable-activity-row__context` collapsing to zero width beside long status, date and owner text above 640px. The row body now starts from its content size, so it shrinks in proportion to the other columns and the title and context truncate with an ellipsis.
