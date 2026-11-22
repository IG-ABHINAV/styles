---
'@pathableai/styles': minor
---

Add the `pathable-breadcrumb--truncate` modifier, which keeps the breadcrumb
trail on one line from 480 px and cuts a trail wider than its container off
with an ellipsis. In the truncated trail the ellipsis is now drawn on the last
item instead of the list, at the same place, and the items sit in a flex row
with the same 0.25em gap as before. On a narrow screen the parent back link's
list item is now a block item instead of an inline one; the link renders in the
same place.
