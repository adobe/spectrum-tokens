---
"@adobe/spectrum-component-api-schemas": major
---

**BREAKING CHANGE**: Add 6 new components and 3 breaking schema changes

**New Components (6):**

- coach-indicator, in-field-progress-button, in-field-progress-circle
- opacity-checkerboard, radio-button, thumbnail

**Breaking Changes (3):**

- avatar: Remove "hover" state, change image enum, size default 100→500
- badge: Expand variant colors (15 new), add style property
- checkbox: Remove isReadOnly property

**Migration:** Update state handling, image enum mapping, remove isReadOnly usage.

## Component Schema Diff Report

Generated using `@adobe/spectrum-component-diff-generator`:

```
Added Components: 6
- coach-indicator: New component schema
- in-field-progress-button: New component schema
- in-field-progress-circle: New component schema
- opacity-checkerboard: New component schema
- radio-button: New component schema
- thumbnail: New component schema

Breaking Updates: 3
- avatar: Schema changes that break backward compatibility
- badge: Schema changes that break backward compatibility
- checkbox: Schema changes that break backward compatibility
```
