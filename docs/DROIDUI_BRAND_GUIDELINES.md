# DroidUI Brand System

## Official identity
- Product: DroidUI
- Wordmark: DroidUI, with UI highlighted in cyan.
- Symbol: geometric six-sided device frame enclosing a friendly, abstract creative-robot face, with cyan/blue/violet gradient.
- Brand line: **DESIGN • BUILD • INSPIRE**
- Palette: Midnight Navy `#080D1F`, Electric Blue `#398BFF`, Cyan `#38E8F2`, Violet `#9065FF`, Cloud White `#F4F7FF`.

## Interface direction
Use midnight navy as the default canvas, layered blue-black surfaces, fine cool-blue borders, cyan for active states and primary emphasis, and violet as a restrained secondary accent. Use consistent rounded cards, clear typography hierarchy, generous spacing, and high-contrast controls. Avoid emoji as substitutes for core product identity or navigation icons.

## Logo usage
Use the shared `BrandMark` component for in-app identity. Keep the mark's aspect ratio and gradient. Do not recolor, crop, stretch, or replace it with text glyphs. The wordmark may be hidden only where space requires a symbol-only treatment.

## Launch experience
The in-app launch overlay uses the same mark and palette, a brief scale/glow reveal, the brand line, and a smooth fade into the editor. The native OS splash remains a solid midnight-navy surface while JavaScript initializes.

## Implementation notes
The logo is rendered as vector paths with `react-native-svg`, already present in the project's dependency baseline. This avoids introducing a new runtime dependency. A dedicated vector source and app-ready raster launcher exports can be added in the app-icon phase.


# DroidUI Studio Interface System

This document extends the official brand identity into the editor experience. The brand should be visible in every workspace surface, not only the launch screen.

## Visual principles
- **Midnight workspace:** use `#080D1F` for the primary application canvas and deep editor backgrounds.
- **Layered panels:** use `#111B35` for cards, toolbars, inputs, and secondary surfaces.
- **Electric action:** use `#398BFF` for primary actions, selection states, and key controls.
- **Cyan focus:** use `#38E8F2` for active tabs, section labels, focus indicators, and small highlights.
- **Violet accent:** use `#9065FF` for secondary brand emphasis and creative accents.
- **Readable text:** use `#F4F7FF` for primary text and `#9AADD6` for supporting text.
- **Quiet boundaries:** use `#263B68` for panel edges and dividers.

## Component treatment
- Cards and studio panels use layered navy surfaces, fine blue borders, and consistent rounded corners.
- Inputs use a deep navy field, a clear border, and a high-contrast focus treatment.
- Selected tabs and selected inspector controls use cyan/blue accents rather than generic grey.
- Primary actions use electric blue; destructive actions retain a clear warning/red treatment.
- Keep spacing, labels, and section hierarchy consistent. Avoid dense clusters of controls without grouping.

## Covered surfaces in this pass
- Main editor header, workspace actions, panel navigation, and export modal.
- Component toolbar and quick-add controls.
- Property inspector and selected-node controls.
- Template library, preset cards, search, category chips, and save actions.
- Asset library, import controls, asset rows, and icon gallery.
- Layer hierarchy and selection state.
- Theme manager and design-system preset studio.

## Theme behavior
The DroidUI Midnight palette is the default dark identity. Light, Material You, and Cyberpunk remain available as alternate themes; they should remain usable and should not be silently replaced by the brand default.

## Maintenance rule
When adding a new studio or editor panel, use this palette and component treatment from the start. Do not introduce unrelated one-off navy/blue hex values unless a state has a clear semantic reason (for example, warning, success, or destructive feedback).


## Specialist studio coverage
The same palette is applied across the specialist editor studios, including accessibility, native Android export, CI/CD generation, deep links and app icons, device detection, typography, icon gallery, localization, performance profiling, press states, project file I/O, project management, property presets, release/versioning, sound effects, spacing/alignment, splash screen design, store metadata, SVG importing, theme import/export, transitions, unit-test generation, and viewport selection.

These are presentation-only color-token updates. They must not change the underlying editor store actions, generated source output, export formats, or platform behavior. Preserve semantic warning, error, and success colors where they communicate status. New controls should maintain readable contrast and visible selected/focused states.
