# DroidUI Premium Studio Expansion Roadmap

## Product direction
DroidUI is evolving from a component-based mobile UI editor into a mobile-first app design and asset-production studio. The expansion is organized into independent modules so each can be implemented, tested, and shipped without pretending that a visual mockup is a working platform integration.

## 1. Premium component collection

### First delivered collection
The Template Library now includes a **Premium Components** category with eight reusable, editable component-tree presets:
- Creator Spotlight Hero
- SaaS Pricing Selector
- Media Player Card
- Glass Analytics KPI
- Smart Notification Toast
- Profile Completion Panel
- Social Post Composer
- Feature Comparison Table

These are real ComponentNode trees built from the schema's currently supported primitives. They can be inserted and customized like other design presets. They are not yet new native runtime component types.

### Next premium packs
- Commerce: product cards, cart summary, checkout steps, product gallery, review summary.
- Communication: chat bubbles, inbox rows, message composer, call controls.
- Data: KPI dashboards, charts, filter panels, empty states, loading skeletons.
- Identity: profile cards, verification marks, creator badges, membership tiers.
- Navigation: tab bars, drawers, breadcrumbs, segmented controls.
- Subscription: paywall, trial banner, entitlement card, plan selector.
- Accessibility: large-touch controls, high-contrast presets, accessible form groups.

## 2. Special elements

Build these as explicit schema types only when their rendering and export contracts exist:
- Lottie/vector animation player with reduced-motion fallback.
- Video and audio player controls with local asset references.
- Maps/location preview with permission-aware runtime behavior.
- QR/barcode generator and scanner surfaces.
- Charts, gauges, timers, countdowns and progress rings.
- Rich text, markdown, code blocks and syntax-highlighted panels.
- Web content/embed frame with domain allow-list and external-open fallback.
- Camera/media capture affordances with permission states.
- Haptics and sound action bindings.
- Gesture surfaces, swipe actions and draggable cards.

Each special element needs a typed props schema, editor inspector, preview behavior, React Native generator mapping, Android generator mapping or a clear unsupported-target diagnostic, accessibility behavior, and tests. A visual placeholder alone must not be represented as a functional feature.

## 3. Social media integration

### Editor-side features
- Platform-specific preview presets for Instagram posts/stories/reels, TikTok vertical video, YouTube thumbnails/banners, Facebook posts/covers, and X posts.
- Social profile, follow, share, embed, post composer, media carousel and engagement component kits.
- Safe share-sheet action and copy-link actions.
- Content dimension presets and crop-safe guides.

### Account integrations
Actual account linking requires provider-approved OAuth flows and a secure backend. Do not put provider client secrets or long-lived access tokens in the mobile app. Use server-side token exchange, encrypted token storage, revocation, minimum scopes, audit logs and explicit user consent. Publishing APIs differ by platform and account type; ship each provider as a separate adapter after its current API requirements are verified. Do not promise arbitrary cross-platform auto-publishing.

## 4. Built-in web browser

Create a browser workspace with:
- URL/address input, back/forward, reload and home.
- Loading/progress and network error states.
- Page preview inside a sandboxed WebView.
- Open externally, copy URL and add current page as a design reference.
- Optional desktop/mobile viewport toggle for responsive inspection.

Security requirements:
- Restrict navigation to HTTP/HTTPS and block dangerous schemes.
- Handle external links with explicit confirmation or system browser handoff.
- Disable file access, universal file access, mixed content and JavaScript bridges unless a reviewed feature requires them.
- Do not inject credentials or expose app internals to page scripts.
- Treat downloaded HTML and page content as untrusted.
- Provide clear privacy messaging; do not silently collect browsing history.

Implementation choice: evaluate a compatible React Native WebView package for the app's Expo SDK 50 / React Native 0.73 baseline. Confirm native config-plugin/prebuild compatibility before adding it. A lightweight external-browser handoff can ship earlier than embedded browsing.

## 5. App Icon Maker

Dedicated icon workspace:
- Square canvas with safe-zone guides and live rounded-mask previews.
- Background color/gradient, image import, SVG/vector placement, text, shapes, layers and alignment.
- Preset visual directions and brand palettes.
- Android adaptive icon foreground/background and monochrome layer support where target SDK permits.
- Export Android density assets and adaptive icon resources, plus iOS AppIcon catalog assets.
- Validate dimensions, transparency, contrast, safe area and missing variants.
- Bundle generated assets into Android project export; provide a preview sheet before export.

Do not claim platform-compliant icon generation until all required output sizes and manifest/catalog references are validated.

## 6. Materials importing / asset manager

Support import flows for:
- Raster images: PNG, JPG/JPEG, WebP, GIF (with animation support status shown).
- Vector: SVG with sanitization and size limits.
- Fonts: TTF/OTF with license/source metadata.
- Audio: MP3, M4A, WAV, AAC.
- Video: MP4 and MOV where device codecs support them.
- JSON/Lottie animation files after schema validation.
- Project resources and bundled asset packs.

Requirements:
- Native document picker and file-system integration; inspect MIME type, extension, actual file signature, file size and dimensions.
- Preview before importing; rename, categorize, tag, replace and remove.
- Stable asset IDs, deduplication, usage counts, missing-reference diagnostics and project-relative references.
- Never trust filenames or MIME declarations alone.
- Avoid embedding large base64 assets in project JSON. Prefer managed file URIs and portable asset bundles with explicit export/import handling.
- Show license/source fields and warn that imported assets may have usage restrictions.

## Delivery sequence

### Phase A — Premium library (started)
- [x] Add eight Premium Components presets using current supported node primitives.
- [ ] Add Commerce, Communication, Data and Identity packs.
- [ ] Add visual preview cards and tags for platform, use case and complexity.
- [ ] Add snapshot tests for preset node trees and insertion behavior.

### Phase B — Materials pipeline
- [ ] Add document picker and file-system dependencies compatible with the current Expo SDK.
- [ ] Centralize asset import, validation, metadata, preview, persistence and export.
- [ ] Migrate large embedded image payloads to managed asset references without breaking existing projects.
- [ ] Add font/audio/video import and format-specific previews.

### Phase C — App Icon Maker
- [ ] Create editable icon canvas and layer model.
- [ ] Generate Android adaptive icon assets and iOS icon catalog.
- [ ] Add export diagnostics and fixture tests.

### Phase D — Social Studio
- [ ] Add platform format presets and safe-zone previews.
- [ ] Add share-sheet and deep-link actions.
- [ ] Add server-side OAuth provider adapters only after API and policy review.

### Phase E — Browser workspace
- [ ] First deliver external browser handoff and responsive URL preview.
- [ ] Add embedded WebView only after Expo/native compatibility and security review.
- [ ] Add responsive capture/reference workflow.

### Phase F — Special elements
- [ ] Add typed element contracts and renderer support incrementally.
- [ ] Gate unsupported code-generation targets with explicit diagnostics.
- [ ] Add accessibility, permissions, security and automated validation for each element.

## Current dependency baseline
The app currently declares Expo ~50.0.0 and React Native 0.73.2. The package manifest includes Expo ImagePicker, Clipboard, AsyncStorage, SVG, and vector icons. It does not currently declare a document picker, file-system, sharing, or WebView dependency. Any dependency additions must be checked against this Expo SDK baseline rather than installing latest package versions blindly.

## Definition of done
A feature is complete only when its editor UI, typed data model, persisted project representation, renderer/preview, export behavior, error handling, accessibility, documentation and relevant automated tests are implemented. OAuth/API integrations and embedded browsing also require security review. CI green and a real Android device test are required before calling a release ready.
