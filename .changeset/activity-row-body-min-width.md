---
'@pathableai/styles': patch
---

Fix `pathable-activity-row__title` and `pathable-activity-row__context` collapsing to zero width beside long status, date and owner text above 640px. In a list at least 36rem wide the row body now keeps a minimum width of 6rem, so the side columns give up room first and the title and context truncate with an ellipsis. Rows in a list narrower than 36rem now wrap onto several lines, as they already did on narrow viewports. `.pathable-activity-list` is now a size container (`container-type: inline-size`).
