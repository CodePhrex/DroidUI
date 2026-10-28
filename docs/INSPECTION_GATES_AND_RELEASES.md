# DroidUI Inspection Gates and Release Tagging

## Purpose

This document describes the merge/release guardrails added to DroidUI. The checks are intended to catch source/configuration defects early. They do not replace an Android device test, and a successful static check must not be described as proof of runtime stability.

## Pull-request inspection

Workflow: `.github/workflows/inspection-gates.yml`

It runs for pull requests targeting `main`, pushes to `main`, and manual dispatch. It:

1. Checks required repository configuration with `scripts/droid_studio_qa_runner.py`.
2. Installs app dependencies from the `app/` directory.
3. Runs the TypeScript compiler through `npm run typecheck`.
4. Resolves the Expo public configuration.
5. Uploads a small inspection-context artifact even if a prior step fails.

The Python inspection runner now uses real file/config checks and a small in-memory accessibility/node-budget fixture. It exits non-zero when required gates fail. It does **not** claim to measure FPS or prove TLS/manifest settings when the native Android project is not present; unavailable native checks are reported as `SKIP`.

## Version source and automatic tags

The source of truth for the release version is `app/package.json`. Keep `app/app.json`'s `expo.version` equal to it.

After a successful `DroidUI Inspection Gates` run on `main`, `.github/workflows/automatic-version-tag.yml`:

1. Reads and validates the app version as SemVer.
2. Builds the tag name `v<version>`, for example `v7.0.0`.
3. Checks whether that tag already exists.
4. Creates and pushes an annotated tag only when it does not already exist.

The workflow uses the repository's built-in GitHub token and requests only the permissions it needs. It does not publish an APK or create a GitHub Release. Those can be added later once release builds and device acceptance are automated.

### How to release a new version

1. Update `app/package.json` `version`.
2. Update `app/app.json` `expo.version` to the same value.
3. Run local checks and submit a pull request.
4. Merge only after the inspection workflow succeeds.
5. Confirm the tag exists in GitHub after the successful main-branch run.

Never reuse an existing version tag. Increment the version according to SemVer: patch for compatible fixes, minor for backward-compatible functionality, major for incompatible changes. Pre-release versions such as `7.1.0-rc.1` are accepted by the validation regex.

## Current known blockers

At the time these gates were introduced, the source audit found that:

- `app/package-lock.json` was absent, so fully reproducible `npm ci` installation was not yet possible.
- The Expo configuration references icon/splash PNGs that were not present in the inspected tree.
- The repository's prior QA runner reported hardcoded security/FPS successes.
- A TypeScript source file contained an invalid Python-style comment (fixed on the implementation branch).

The gate intentionally reports missing required artifacts instead of silently fabricating assets or claiming the repository is release-ready. Generate and commit the lockfile from a compatible npm environment and add the intended branded image assets before treating the workflow as green.

## Local commands

From the repository root:

```bash
python3 scripts/droid_studio_qa_runner.py
cd app
npm install
npm run typecheck
npx expo config --type public
```

Once `app/package-lock.json` has been generated and committed, prefer `npm ci` for clean, reproducible installs. Runtime acceptance must still cover app cold start, navigation, project save/reopen, asset import, export, clipboard behavior, and at least one physical Android device.
