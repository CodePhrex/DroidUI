# DroidUI Design Presets, Complete Screens & Rich UI Styling

## Product objective
Ship a substantial, locally bundled starter library so users can start from a complete screen, a reusable component kit, or a single component pattern, then customize and save their own variations.

The preset library is a first-class editor workspace, not a static demo gallery.

## Three levels of reusable design

### 1. Component presets
Examples:
- App title bars and screen headers.
- Text fields, search fields, password fields, labeled form groups.
- Primary, secondary, destructive, icon and floating action buttons.
- Badges, chips, tabs, segmented controls and bottom navigation.
- Cards, information panels, KPI tiles, list rows and empty states.
- Dialogs, confirmation panels, switches, sliders, checkboxes and progress indicators.

Each component preset must be independently editable, with stable properties and child nodes.

### 2. Component kits
Coordinated collections of reusable components with a shared type scale, spacing, color palette, corner radius and interaction treatment. Examples: authentication kit, commerce kit, dashboard kit, settings kit, creator profile kit and navigation kit.

### 3. Complete screen designs
Complete starting screens users can apply as the root canvas:
- Fintech dashboard.
- Commerce storefront.
- Creator/social profile.
- Login and signup.
- Settings and preferences.
- Analytics and operations dashboard.
- Messaging/inbox.
- Booking/service discovery.
- Media player.
- Onboarding/welcome.

Each screen should contain meaningful placeholder content, realistic component hierarchy and coherent visual styling. Screen presets should be device-responsive and editable, not flattened screenshots.

## User workflows

Each catalog item supports two distinct actions:

**Insert into canvas**
- Clone the selected preset subtree.
- Generate unique IDs for every descendant.
- Insert into the selected eligible Container/Card.
- Preserve the existing screen and other components.
- Select the inserted root so users can immediately edit it.

**Use as starting design**
- Replace the current root canvas with a cloned complete design.
- Create a new unsaved project with the preset name.
- Preserve undo history so the user can undo the replacement.
- Generate unique IDs for every node.
- Do not delete any previously saved project; this action only replaces the current in-memory canvas.

The UI must clearly distinguish these actions and should warn before replacing a non-empty unsaved canvas if the current project contains meaningful work.

## Catalog experience
- Search by name, category, component type, and descriptive keywords.
- Categories: Complete Screens, Component Kits, Navigation, Forms, Cards & Content, Buttons & Actions, Data & Charts, Device-Specific.
- Preview thumbnail or live miniature rendered from the component tree.
- Show device suitability, style family, component count and short description.
- Favorite, recently used and user-created presets.
- Duplicate a preset into a user collection and edit the copy.
- Save current selection or complete screen as a reusable preset.
- Import/export preset packs using a versioned schema.
- Bundled presets must work offline.

## Rich style system

DroidUI is an Expo/React Native editor. The source of truth is a typed cross-platform style-token model; React Native exports use `StyleSheet`/style objects. Do not promise browser CSS compatibility or emit web-only CSS properties in Android exports.

Provide one-tap visual treatments:
- Soft Surface.
- Elevated Card.
- Glass Dark.
- Neon Edge.
- Outline.
- Pill.
- Midnight.
- Warm Editorial.

The shared style model should cover:
- Color and alpha.
- Background and supported gradients.
- Borders and corner radii.
- Padding, margins and gaps.
- Typography, line height, letter spacing and alignment.
- Elevation and shadow.
- Opacity and transforms.
- State styles for pressed, focused, disabled and selected states.

Use design tokens so a user can apply a theme across a whole screen and then override individual components. Preserve per-component overrides when switching themes unless the user explicitly chooses to replace all styles.

### Platform mapping
- Map common visual tokens to React Native ViewStyle/TextStyle/ImageStyle.
- Implement gradients through an explicit supported renderer/dependency, not by passing a CSS gradient string to React Native backgroundColor.
- Map shadows carefully to Android elevation and supported shadow properties.
- Produce a validation report for unsupported style properties in each export target.
- Keep style tokens serializable in DroidUI project files.

## Implementation currently committed
The development branch now contains:
- A catalog of five complete starter screens: fintech dashboard, storefront, creator profile, login/signup and settings.
- Reusable title bar, search field, labeled input group, action button pair, information card, bottom navigation and glass panel presets.
- Existing prebuilt templates combined into the searchable categorized catalog.
- Search and category filtering.
- Separate **Insert into canvas** and **Use as starting design** actions.
- Store action that replaces the current root canvas with a cloned preset and records undo history.
- Unique descendant IDs through the existing recursive clone mechanism.
- Eight quick visual style treatments exposed in the Property Inspector.

## Follow-up enhancements
- Add live thumbnail rendering for every preset.
- Add richer preset coverage for messaging, media, onboarding, bookings, charts, lists, tabs, dialogs, empty states and responsive navigation.
- Add theme tokens and global theme application.
- Add save-as-preset and custom preset folders.
- Add confirmation before replacing unsaved work.
- Add automated tests for unique IDs, root replacement, insert target validity, undo/redo and save/open round trips.
- Validate that every preset renders and compiles to generated Android source.
