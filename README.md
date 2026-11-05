# DroidUI

**DroidUI is a mobile-first visual interface design studio for creating, previewing, editing, saving, and exporting mobile UI projects.**

This repository contains the actual React Native / Expo application. The Android build workflow compiles this application; generated Compose fixtures are separate test artifacts and are not the DroidUI product.

## Current application capabilities

- Visual component canvas with selectable elements and nested layouts
- Component insertion for containers, cards, text, buttons, inputs, badges, icons, images, progress bars, graphs, switches, sliders, checkboxes, SVG vectors, and animated assets
- Property inspector for component content, styling, opacity, rotation, and supported component states
- Undo and redo history
- Device viewport presets and theme switching
- Local project save, load, create, list, and delete using AsyncStorage
- Image import from the device photo library and project asset references
- SVG import and validation
- Reusable templates and component search
- React Native TSX and Jetpack Compose Kotlin generation, plus SVG, CSS-in-JS, JSON, Jest, CI/CD, store metadata, and native .dui project package exports
- Accessibility, localization, transitions, press states, sound effects, splash screen, release metadata, and Android project export studios

> Feature availability is determined by the actual controls and exporters implemented in the current app. Some generated output studios are helpers or starting points; generated source should be reviewed and built in its target environment before production use.

## Repository layout

- `app/` — Expo React Native application
- `app/src/components/` — editor panels and studios
- `app/src/store/` — Zustand editor state
- `app/src/storage/` — project persistence and .dui package handling
- `app/src/compiler/` — code and asset exporters
- `app/src/templates/` — reusable UI templates
- `scripts/` — repository QA and build-validation scripts
- `.github/workflows/` — inspection gates and Android APK build

## Run the application

Requirements: Node.js 20, npm, and (for local Android builds) JDK 17 plus Android SDK/Android Studio.

```bash
cd app
npm ci
npx expo start
```

For a local Android device/emulator with the Android toolchain configured:

```bash
cd app
npx expo prebuild --platform android
npx expo run:android
```

## Build an installable Android APK with GitHub Actions

1. Push changes to the `overhaul` branch.
2. Open **Actions → DroidUI Android Application APK**.
3. Wait for the workflow to complete successfully.
4. Open the successful run and download the artifact named `droidui-overhaul-debug-apk-<commit>`.
5. Extract `app-debug.apk` and install it on the Android device.

The workflow runs TypeScript and regression checks, generates the native Android project, assembles the real Expo/React Native application, and verifies the package ID, app label, and embedded React Native JavaScript bundle before uploading the APK.

**A generated Android Compose fixture is not an installable DroidUI product build.** Only the artifact from the workflow above is intended for installing the DroidUI application.

## Project persistence

Projects are stored locally on the device using AsyncStorage. Use the Projects studio to create, save, reopen, and delete local designs. Export a `.dui` project package when you need a portable project file.

## Branch policy

Active product work is being developed on `overhaul`. The `main` branch is the stable baseline and is not changed by this development workflow. Changes are not merged to `main` without explicit authorization.

## Validation commands

```bash
cd app
npm run typecheck
npm run test:validation
npm run test:editor-state
npm run test:android-generation
npm run release:integrity
```

## Device acceptance checklist

- Install the APK produced by **DroidUI Android Application APK**.
- Confirm the app opens to the DroidUI editor (not the Compose fixture).
- Add and select multiple component types.
- Change text and styles in the property inspector.
- Undo and redo edits.
- Save a named project, close/reopen the app, and load it again.
- Import an image from the device gallery.
- Export React Native TSX and a `.dui` package.
