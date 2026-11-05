# DroidUI Phase 2I — Interactive Canvas, Color, Splash, Audio & Events

## Current baseline (verified from branch source)
The editor already contains:
- `SplashScreenStudio`, `SplashScreenConfig`, and a splash preview overlay.
- `SoundEffectsStudio`, `SoundEffectSpec`, a sound synthesizer, and sound playback on component press.
- `PressStateSpec` and a Press States workspace.
- `TransitionsStudio` and transition metadata.
- A component tree with nested Container/Card children, layer reordering, and Zustand editor history.
- `ComponentStyle` based on React Native ViewStyle/TextStyle/ImageStyle.

These are useful foundations, but they are not yet a complete interaction authoring system. The existing splash editor is a first version with symbol/color presets and config preview; the sound editor currently focuses on synthesized presets; and click currently selects a node and plays its attached sound rather than executing a configurable event workflow.

## Product goal
Make DroidUI a mobile-first visual Android UI authoring environment. A designer should be able to place and style components, configure their behavior, preview it, and export usable project source without hand-editing generated code.

## A. Canvas manipulation and placement system

### Interaction model
Support two placement modes:
1. **Flow mode (default):** components participate in their parent Container/Card layout. Dragging reorders or reparents components and does not silently convert the whole screen into absolute positioning.
2. **Freeform mode (opt-in per parent/container):** child elements use canvas coordinates and may overlap. Store coordinates in a dedicated editor layout field, not as arbitrary React Native style values.

### Gestures
- Drag an existing selected element to move it.
- Drag a component from the toolbar onto the canvas to insert at the drop target.
- Long-press to begin dragging on touch devices; provide an explicit Move action for accessibility and devices where gesture conflicts occur.
- Selection handles support resize where the component type allows it.
- Pan and pinch-to-zoom apply to the canvas viewport, not to component geometry.
- Multi-select and group movement are later enhancements.

### Placement placeholders / smart guides
While dragging, render contextual drop targets:
- Before/after sibling insertion slots.
- Inside eligible Container/Card targets.
- Top, bottom, leading, trailing, and center anchors for freeform containers.
- Grid-cell targets when grid mode is enabled.

Display alignment guides, spacing measurements, container bounds, and an invalid-drop state. A drop target must be validated against the component's parent/child constraints. Do not show a location that would create an invalid tree (for example, nesting a screen-level element inside a non-container).

### Data contract
Keep layout metadata separate from style:
```ts
type EditorLayoutMode = 'flow' | 'freeform' | 'grid';
interface EditorPlacement {
  mode?: EditorLayoutMode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  gridColumn?: number;
  gridRow?: number;
  anchor?: 'top' | 'bottom' | 'leading' | 'trailing' | 'center';
}
```
Add optional `placement` to ComponentNode. Coordinates use logical dp relative to the parent content box. Store parent layout mode and grid configuration in the parent node. Migrate older projects with missing placement metadata to flow mode without changing their appearance.

### Grid and snap
- Grid visibility toggle, configurable cell size, and snap enable/disable.
- Default snap step 8 dp; allow 4/8/16 dp presets and custom spacing.
- Smart snapping to sibling edges, centers, baselines, and equal spacing.
- Snap tolerance should be zoom-aware.
- Respect parent padding and safe-area guides.
- Grid is an editor overlay; never export grid lines as UI elements.

### Zoom and viewport
- Pinch zoom and +/- controls with fit-to-screen and 100% actions.
- Pan canvas when zoomed.
- Keep the inspector and toolbars stationary while canvas content transforms.
- Clamp zoom to a practical range and preserve the focal point during pinch.
- Ensure drag coordinates are converted from screen coordinates to canvas dp using the current zoom and pan transform.

## B. RGB Spectrum Color Studio

Create a reusable `ColorPickerStudio` control that can edit any supported color property:
- Two-dimensional saturation/value field and hue spectrum.
- Alpha/opacity slider.
- RGB integer inputs (0–255).
- HEX input with validation.
- HSL and HSV representations.
- Recent colors and project palette.
- Eyedropper only where a platform-supported implementation is available; otherwise disable it with an explanation.
- Optional gradient editor (linear angle, ordered color stops, stop positions) in a later increment.

Store colors in standard CSS-compatible hex/rgba strings supported by React Native. Validate and normalize input before writing it into the project. Do not introduce a heavyweight color dependency if a small local conversion utility is sufficient. Use the same picker for text, background, border, icon, SVG, shadow, splash, and sound-independent visual properties.

## C. Splash Screen Studio — complete the existing first version
Extend the existing studio rather than creating a duplicate:
- Import logo/image assets; control fit, position, size, and safe-area placement.
- Background solid color or gradient.
- Title/subtitle typography and alignment.
- Animation target selection (logo, title, subtitle, spinner, background).
- Per-target entrance animation, duration, delay, easing, and optional exit transition.
- Static Android launch-screen export plus a separate in-app animated intro screen.
- Live device preview across the supported Android viewport presets.
- Validate Android launch-screen constraints. Android's native splash screen is platform controlled; complex multi-element animations should be implemented as an in-app intro after launch, not promised as native system splash behavior.

## D. Sound and audio assets
Extend the existing sound effects studio:
- Sound node/asset type for imported audio (MP3, WAV, OGG where supported).
- Project asset metadata and file references; do not embed large audio binaries in JSON project files.
- Preview, play/pause, stop, volume, mute, loop, and trim metadata.
- Attach audio to click, long press, focus, success, error, or screen lifecycle events.
- Keep synthesized UI sound presets as lightweight offline defaults.
- Respect Android audio focus and lifecycle; never autoplay background audio unexpectedly.
- Export/copy referenced assets into generated Android project assets and include licensing/source metadata.

## E. Event & Action Designer

Add an explicit `events` map to ComponentNode, separate from style, sound, and press-state data.

Initial event triggers:
- onPress / onClick
- onLongPress
- onFocus / onBlur
- onValueChange (inputs, switches, sliders)
- onScreenEnter / onScreenExit

Initial action types:
- navigateToScreen
- playSound / stopSound
- setText
- setVisibility
- setEnabled
- setValue
- showAlert / showDialog
- openUrl (allowlisted URL schemes; validate URLs)
- startAnimation
- setTheme

Each action has a stable ID and typed configuration. Events may contain ordered actions and simple conditions. Add validation for missing targets, invalid values, navigation destinations, and unsupported action/component combinations.

### Preview safety and execution
- Build a small deterministic preview event interpreter; never use eval or execute arbitrary JavaScript supplied by a project.
- Preview actions that can be safely simulated in the editor.
- Clearly label actions that require a generated app runtime or backend and cannot be fully simulated inside the editor.
- External navigation must require an explicit click and use React Native Linking after URL validation.
- Keep preview state isolated from the saved design unless the user explicitly commits changes.

### Export
React Native TSX export should generate real callbacks and required imports for supported actions. Jetpack Compose export must either generate equivalent behavior or mark unsupported actions in a validation report; never silently drop configured events. Include a generated action registry/runtime helper where multiple screens/actions need shared state.

## F. Accessibility and mobile usability
- Provide non-gesture Move Up/Move Down and Move Into actions.
- Support screen-reader labels for canvas elements, placement targets, and handles.
- Ensure touch targets are comfortably sized.
- Add keyboard/DPAD focus support where practical.
- Expose a reduced-motion option for animation previews.

## G. Recommended delivery sequence

### Phase 2I-A — data model and interaction safety
- Placement schema and project migration.
- Typed event/action schema and validation.
- Define container/child eligibility rules.
- Add tests for save/open round trips and undo/redo.

### Phase 2I-B — canvas gestures and smart placement
- PanResponder/Gesture Handler implementation for drag, pan, pinch, and resize.
- Contextual drop placeholders, guides, grid, and snap.
- Flow reorder/reparent and opt-in freeform positioning.
- Verify touch handling does not break tap-to-select or nested scrolling.

### Phase 2I-C — color and splash experience
- Reusable RGB/HEX/HSL/HSV/alpha picker.
- Apply shared color control throughout inspector and Splash Screen Studio.
- Complete splash asset and animation target controls.
- Validate native splash versus in-app intro export.

### Phase 2I-D — audio and events
- Imported audio asset pipeline.
- Event & Action Designer.
- Preview interpreter and sound-event binding.
- React Native export with working callbacks; Compose parity report.

## Quality gates
- Existing TypeScript, static QA, editor-state, project validation, Android generation, and release-integrity scripts all pass.
- Migration tests preserve older project layouts.
- Gesture tests cover nested containers, scroll conflicts, invalid drops, undo/redo, and zoom-adjusted coordinates.
- Color tests cover valid/invalid HEX, RGB bounds, alpha, and conversion round trips.
- Event tests cover action ordering, missing targets, safe URL validation, preview isolation, and export output.
- Audio tests cover missing assets, unsupported formats, mute, volume bounds, lifecycle, and export inclusion.
- Build and install a debug APK; test on a physical Android phone in portrait and landscape.
- Do not mark the phase complete until actual APK interaction and generated-project compilation have been verified.

## Scope discipline
Keep the current Expo SDK / React Native version and existing dependencies unless a concrete compatibility need is demonstrated. Prefer existing React Native Gesture Handler/Reanimated already in the project. Avoid introducing large libraries for color picking, audio, or state management without a measured need. Keep all new capabilities modular and feature-gated so the editor remains responsive on modest Android hardware.
