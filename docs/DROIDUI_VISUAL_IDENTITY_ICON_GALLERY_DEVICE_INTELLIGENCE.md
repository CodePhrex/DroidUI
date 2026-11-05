# DroidUI Visual Identity, Icon Gallery, and Device Intelligence

## Product identity

The application is branded **DroidUI** (not Droid Mobile Studio). The interface should read as a focused mobile UI design environment, not a generic code dashboard.

### Visual direction
- Deep ink/navy workspace surfaces with clear layered panels.
- Cyan/sky-blue interaction accent with restrained electric-blue primary actions.
- High-contrast neutral typography and consistent type scale.
- Rounded cards and controls with subtle borders; avoid excessive gradients, emoji-only navigation, or decorative clutter.
- Keep the device canvas visually dominant.
- Use concise labels, consistent iconography, clear active states, and meaningful empty/loading/error states.
- Header actions (Open, Save, theme, Undo/Redo, Export) must wrap or scroll safely on narrow phones.
- Organize the many specialist tools into discoverable workspaces; do not make users hunt through a long flat strip of tabs.

### Interaction standards
- All interactive surfaces need pressed/selected/disabled feedback.
- Search controls should filter immediately and show an empty result state.
- Keep important actions reachable with one or two taps on a phone.
- Use native alerts or accessible in-app dialogs for destructive actions and failures.
- Maintain accessibility labels and touch targets suitable for Android.
- Do not sacrifice editor canvas space to oversized headers or permanently visible toolbars.

## Icon Gallery Studio

The Icon Gallery Studio introduces multiple bundled vector icon families:
- Material Community Icons
- Material Icons
- Ionicons
- Feather
- Font Awesome 5
- Ant Design

It provides:
- Search across the selected icon family.
- Family selection.
- Live icon preview.
- Editable color and size.
- Apply to the selected Icon node, or insert a new Icon child into the selected layout node.
- Persist icon family, glyph name, size, and color in the component properties/style.
- Canvas rendering through the same icon family used by the gallery.
- React Native TSX generator imports the supported icon families and emits the matching component.

Icon data is bundled locally; browsing does not require network access. Validate every glyph against the installed package's glyph map before treating the catalog as exhaustive. Avoid claiming all glyph names are valid merely because they appear in the searchable list.

### Licensing and export
The icon fonts have distinct licenses and attribution requirements. Before distribution, review each included family license and add required notices. Generated TSX uses `@expo/vector-icons`; a standalone exported Android project must include that dependency or map icons to native vector assets. Jetpack Compose and SVG icon export need dedicated mappings before claiming full fidelity.

## Device Intelligence

The Device Detection Studio uses:
- React Native `Platform.constants` for Android brand, manufacturer, model, build fingerprint, and OS release where the OS exposes them.
- React Native `Dimensions` for available window and screen dimensions.
- `PixelRatio` to distinguish logical dp from physical pixels.

The profile exposes:
- Device brand/manufacturer/model.
- OS version.
- Window dimensions in dp (recommended design viewport).
- Screen dimensions in physical pixels.
- Pixel ratio.
- Device type.
- Detection timestamp and source.

The detected device becomes a selectable **My Device** viewport and the canvas uses its current available window dimensions. The user can create a new local project template sized to those dimensions.

### Accuracy boundaries
- The available window size is not necessarily the panel's physical resolution; status/navigation bars, display cutouts, multi-window, and edge-to-edge configuration affect the usable area.
- Re-detect after orientation, fold/unfold, or multi-window changes.
- Device metadata may be unavailable on simulators or privacy-restricted devices; always show a useful fallback.
- Device detection does not inspect or infer hardware characteristics that the OS does not expose.
- Store the detected profile with a generated template if reproducible device targeting is required; current detection timestamp is metadata, not a live hardware monitor.

## Template workflow

1. Open **Detect Device**.
2. Tap **Detect This Device**.
3. Review model identity, OS, dp viewport, physical pixels, and density.
4. Tap **Create Design Template**.
5. DroidUI creates a new local project, adds a starter heading and device metrics, and sets the canvas viewport to **My Device**.
6. Save the project.

The template is a starting artboard and not a complete OEM skin or exact hardware frame. Device-specific cutouts, rounded corners, fold posture, and system bars are future enhancements.

## Dependencies

- `@expo/vector-icons` for bundled vector icon families.
- React Native `Platform.constants` and window metrics; no additional device package required.

Keep dependency versions aligned with the project's Expo SDK and regenerate/commit the package lockfile through the repository's normal dependency workflow.

## Quality gates

- TypeScript typecheck.
- Expo configuration validation.
- Existing editor-state, project-validation, Android generation, static QA, and release-integrity checks.
- Verify all six icon family renderers and generated TSX on Android.
- Test device detection on a physical Android phone and simulator fallback.
- Test portrait/landscape and window-size changes.
- Confirm new icon properties survive project save/open round trips.
- Verify selected non-icon layout nodes are not overwritten when applying a gallery icon.
- Check icon-font licensing and dependency inclusion in exported projects.
