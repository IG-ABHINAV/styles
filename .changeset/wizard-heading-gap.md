---
'@pathableai/styles': patch
---

Fix `pathable-wizard__heading` having no space above it. The heading now sits
one `--pathable-wizard-gap` (16px by default) below the region before it, like
every other wizard region after the first.
