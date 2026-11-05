# DroidUI Design System Studio

## Purpose
A screen-level visual consistency tool that allows creators to preview and deliberately apply a coherent design language.

## Included
- Four starter systems: Midnight Blue, Emerald, Warm Editorial, and Violet Glass.
- Editable HEX tokens for primary actions, surfaces, canvas/container backgrounds, primary text, and secondary text.
- Editable base text size, corner radius, and container padding.
- Live preview of title, supporting copy, content card, and primary action.
- Explicit apply action that updates supported component types in the current tree.
- One undo checkpoint before applying.

## Apply mapping
- Container: canvas background and spacing.
- Card: surface background and spacing.
- Button and Badge: primary action color.
- Input: surface background and primary text.
- Text: primary text color and base font size.
- All mapped nodes receive the selected corner radius.

Applying a system intentionally replaces mapped colors and dimensions while preserving unrelated style properties and component props. Numeric bounds: radius 0–48, spacing 0–64, font size 8–48. HEX accepts 3- or 6-digit values.

## Persistence
Applied values are stored in the component tree and therefore flow through existing project save and .dui export workflows. Reusable user-defined token libraries and project-level named theme persistence remain future work.
