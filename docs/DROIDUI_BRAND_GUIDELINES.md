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
