# Phase 2H — Editor Workspace Controls

## Goal

Move DroidUI from a component-preview editor toward a dependable visual Android UI authoring workspace while preserving the existing Expo/React Native + TypeScript architecture, local-first project model, Zustand editor store, and release inspection gates.

This document records the implementation scope and acceptance criteria for the next editor milestone. It is not a claim that the features below are already implemented.

## Verified baseline on main

The current `main` branch already contains several capabilities that were not obvious in the mobile workspace:

- Local project persistence through AsyncStorage (`projectStorage.ts`).
- Project listing, loading, saving, and deletion actions in the Zustand store.
- A Project Manager panel with a saved-project list and Load actions.
- A `.dui` project package parser/exporter.
- A `.dui` import panel that currently accepts pasted JSON.
- Existing code generators for React Native TSX, Jetpack Compose Kotlin, SVG, CSS-in-JS, JSON, tests, CI, and store metadata.
- A spacing/alignment panel for flex direction, alignment, padding, margin, and radius.
- Existing per-node animation metadata, but the current `AnimationSpec` is limited to a small set of entrance presets and duration/delay.

The primary issue is therefore not that all these systems are absent. Several are implemented but are difficult to discover, are limited in workflow, or do not yet provide the complete behavior expected of a visual IDE.

## Phase 2H priorities

### H1. Make project open/discovery obvious

- Add a visible **Open Project** action in the main application header.
- Route it directly to the existing Projects panel.
- Keep **Save** and **Open** available without requiring users to scroll through the lower tab strip.
- In the Projects panel, clearly distinguish the active project from other saved projects.
- Confirm before replacing a workspace that has unsaved changes.
- Show actionable error feedback if a project cannot be loaded.
- Preserve the current local project format and backward compatibility.

Acceptance:
- A user can open the project browser from the main header in one tap.
- Selecting Load restores the component tree, theme, locale, splash configuration, and translations.
- Canceling an unsaved-change confirmation leaves the active workspace untouched.
- Loading an invalid project produces an understandable error rather than silently doing nothing.

### H2. Canvas viewport controls

Add a dedicated canvas viewport state that is separate from component styling and persisted project content.

Required controls:
- Zoom in and zoom out.
- Fit to screen.
- Reset to 100%.
- Current zoom percentage.
- Grid visibility toggle.
- Configurable grid spacing, with 4dp and 8dp presets and a custom value.
- Snap-to-grid toggle.
- Pan/scroll support that remains usable on a phone.

Implementation constraints:
- Use React Native dp as the editor coordinate unit.
- Zoom must not mutate component width, height, margin, padding, or position values.
- Grid and snapping are editor aids, not exported UI elements.
- Keep device preview dimensions independent of viewport zoom.
- Clamp zoom to a documented safe range and avoid creating excessively large native views.
- Grid rendering must be performant on the target Android device; avoid rendering thousands of individual line views.

Acceptance:
- Zooming changes only the viewport scale.
- Fit-to-screen displays the full device artboard within the available workspace.
- Grid visibility and spacing work at multiple zoom levels.
- Snapping rounds eligible canvas placement coordinates to the configured grid increment.
- The preview remains scrollable and selectable at supported zoom levels.

### H3. Animation target model

The existing animation schema supports entrance presets only. Extend it in a backward-compatible way so animation describes both **which node** is animated and **which property** changes.

Initial target properties:
- Text: opacity, translateX/Y, scale, rotation, text color.
- Image: opacity, translateX/Y, scale, rotation.
- SVG: opacity, translateX/Y, scale, rotation, fill/stroke where supported.
- Button: opacity, translateX/Y, scale, rotation, background color.
- Icon/badge: opacity, translateX/Y, scale, rotation, color.
- Container/card: opacity, translateX/Y, scale, rotation.
- Progress bar: progress value and fill color.

Initial triggers:
- on mount
- on press
- on focus
- on state change

Animation configuration:
- target property
- from/to values
- duration
- delay
- easing
- repeat count / infinite
- reverse / alternate
- enabled state

Keep the first implementation to a reliable set of Reanimated-compatible scalar properties. Defer morphing, arbitrary SVG path interpolation, and Lottie runtime integration until there is a concrete renderer and dependency strategy.

Acceptance:
- Selecting a node and opening Animation shows the selected node as the target.
- The user can choose an allowed target property based on node type.
- Animation configuration is saved in the project and restored after reopening.
- Existing legacy `preset/duration/delay` animations continue to load.
- Preview and export do not claim support for a property that the target exporter cannot implement.

### H4. Real file export

Current export generators produce source text and the app has clipboard support, but generated source must be savable as a file.

Add a file-export adapter using Expo-supported APIs:
- Generate the selected output format.
- Derive a safe filename and extension.
- Write text to an app cache/document location.
- Use the native share sheet or document destination flow to let the user save/share it.
- Report success only after the write/share operation succeeds.
- Handle cancellation, unavailable storage, and write failures.
- Preserve clipboard export as a secondary option.

Initial formats:
- `.tsx` React Native
- `.kt` Jetpack Compose
- `.svg`
- `.json` component AST
- `.dui` project package
- `.css` / CSS-in-JS only where the generated output is valid for that format

Do not label a preview-only snippet as a complete Android application. The Android project bundle exporter remains the path for generating a full Android project.

Acceptance:
- User selects a format and saves a real file with the correct extension.
- The saved file contains the exact generated source shown in preview.
- Large exports and Unicode text are preserved.
- Export errors are visible and do not crash the editor.

## Follow-on milestones

### Phase 2I — Animation timeline

- Keyframe timeline and playback controls.
- Multiple animation tracks per component.
- Per-track easing and delay.
- Timeline preview and scrubber.
- Explicit reduced-motion preview option.

### Phase 2J — Android component library

Expand the component schema and renderer in tested groups:
- Layout: ScrollView, safe area, row/column, stack, divider.
- Text: rich text, typography variants.
- Controls: icon button, FAB, switch, checkbox, radio, chip.
- Inputs: text field, password, search, dropdown, date/time picker.
- Navigation: app bar, tabs, bottom navigation, drawer.
- Feedback: dialog, snackbar, progress, loading.
- Display: avatar, card, list item, image, video placeholder.
- Advanced: WebView and charts where export support is defined.

Each component must define:
1. Typed props and defaults.
2. Canvas rendering behavior.
3. Inspector editing controls.
4. Validation and persistence behavior.
5. React Native and/or Jetpack Compose export behavior.
6. Accessibility semantics.
7. Unit or fixture coverage.

Do not add a component to the visible toolbar until its rendering and export behavior are explicitly classified as supported, partial, or preview-only.

## Quality gates

Every phase must:
- Pass `npm ci`.
- Pass `npm run typecheck`.
- Pass the relevant validation scripts and QA runner.
- Pass Expo config validation.
- Pass the Android generated-build workflow.
- Preserve release-integrity and automatic version-tag gates.
- Include a test for project save/load round-trip when the schema changes.
- Include device verification for gestures, viewport controls, file access, and editor interaction.

A green CI workflow is necessary but does not replace installation and manual testing on a physical Android device.

## Non-goals for Phase 2H

- No backend or paid cloud infrastructure.
- No mandatory account or login.
- No replacement of the current project storage format.
- No microservices.
- No arbitrary animation scripting.
- No claim that all Android widgets can be faithfully represented by one generic renderer.

## Definition of done

Phase 2H is complete only when project opening is obvious from the main header, viewport controls are usable on Android, animation target configuration is represented by a backward-compatible schema, generated source can be saved as an actual file, inspection gates pass, and a test APK is available for physical-device validation.
