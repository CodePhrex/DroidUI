import { DroidUiProjectPackage } from '../storage/droidUiProjectFile';

export interface VersionBumpConfig {
  bumpType: 'patch' | 'minor' | 'major';
  currentVersion: string; // e.g. "1.0.0"
  currentVersionCode: number; // e.g. 10000
  releaseTitle: string;
}

export const calculateNextVersion = (currentVersion: string, bumpType: 'patch' | 'minor' | 'major'): string => {
  const parts = currentVersion.split('.').map((p) => parseInt(p, 10) || 0);
  let major = parts[0] || 1;
  let minor = parts[1] || 0;
  let patch = parts[2] || 0;

  if (bumpType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (bumpType === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
};

export const generateReleaseNotesMarkdown = (
  pkg: DroidUiProjectPackage,
  config: VersionBumpConfig
): string => {
  const newVersion = calculateNextVersion(config.currentVersion, config.bumpType);
  const newVersionCode = config.currentVersionCode + 1;
  const nowStr = new Date().toISOString().split('T')[0];

  const root = pkg.workspaceState.rootNode;
  const theme = pkg.workspaceState.currentTheme || 'dark';
  const locale = pkg.workspaceState.activeLocale || 'en';
  const i18nKeys = Object.keys(pkg.workspaceState.i18nDict || {}).length;

  return `# Release Notes: ${pkg.projectMeta.name || 'Droid Mobile UI'} ${newVersion}

**Tag**: \`v${newVersion}\`  
**Android versionCode**: \`${newVersionCode}\`  
**Date**: ${nowStr}  
**Format**: \`.dui\` Native Package Version ${pkg.schemaVersion || 30}  

---

### 🚀 Highlights & Release Summary
${config.releaseTitle || `Automated release bump (${config.bumpType.toUpperCase()}) for ${pkg.projectMeta.name}.`}

### 📱 UI & Layout Architecture
- **Root AST Container**: \`${root.type}\` (ID: \`${root.id}\`)
- **Total AST Component Nodes**: \`${pkg.projectMeta.nodeCount || 1}\` UI elements
- **Active Workspace Theme**: \`${theme.toUpperCase()}\` Mode
- **Primary Locale & Translations**: \`${locale.toUpperCase()}\` (${i18nKeys} key definitions)

### ⚙️ Android & Expo Configuration Updates
- **\`.dui\` Package Signature**: \`${pkg.signature || 'DROID_STUDIO_PROJECT_V30'}\`
- **Expo \`app.json\` Version**: \`version: "${newVersion}"\`, \`versionCode: ${newVersionCode}\`
- **Android Gradle \`build.gradle.kts\`**: \`versionName = "${newVersion}"\`, \`versionCode = ${newVersionCode}\`

---

### 📦 Automated Deployment & Tagging Commands

\`\`\`bash
# 1. Stage project changes and bump configuration
git add .
git commit -m "chore(release): bump version to v${newVersion} [build ${newVersionCode}]"

# 2. Create annotated git release tag
git tag -a v${newVersion} -m "Release v${newVersion}: ${pkg.projectMeta.name}"

# 3. Push commits and release tags to remote
git push origin main --follow-tags

# 4. Create GitHub Release via CLI
gh release create v${newVersion} \\
  --title "${pkg.projectMeta.name} v${newVersion}" \\
  --notes-file RELEASE_NOTES.md
\`\`\`
`;
};

export const generateReleaseScriptBash = (
  pkg: DroidUiProjectPackage,
  config: VersionBumpConfig
): string => {
  const newVersion = calculateNextVersion(config.currentVersion, config.bumpType);
  const newVersionCode = config.currentVersionCode + 1;

  return `#!/usr/bin/env bash
# ======================================================================
# DROID MOBILE STUDIO - AUTOMATED RELEASE TAGGER & BUMPER
# ======================================================================
set -euo pipefail

NEW_VERSION="${newVersion}"
NEW_VERSION_CODE="${newVersionCode}"
PROJECT_NAME="${pkg.projectMeta.name || 'Droid UI App'}"

echo "======================================================================"
echo " 🏷️ Bumping ${pkg.projectMeta.name} to v\${NEW_VERSION} (code \${NEW_VERSION_CODE})"
echo "======================================================================"

# 1. Update app.json version fields
if [ -f "app.json" ]; then
  echo "[✓] Updating app.json version parameters..."
  node -e '
    const fs = require("fs");
    const app = JSON.parse(fs.readFileSync("app.json", "utf8"));
    if (app.expo) {
      app.expo.version = "'"\${NEW_VERSION}"'";
      if (app.expo.android) app.expo.android.versionCode = '"\${NEW_VERSION_CODE}"';
      fs.writeFileSync("app.json", JSON.stringify(app, null, 2));
    }
  '
fi

# 2. Update Android build.gradle.kts if present
if [ -f "android/app/build.gradle.kts" ]; then
  echo "[✓] Updating android/app/build.gradle.kts..."
  sed -i "s/versionCode = [0-9]*/versionCode = \${NEW_VERSION_CODE}/g" android/app/build.gradle.kts
  sed -i "s/versionName = \".*\"/versionName = \"\${NEW_VERSION}\"/g" android/app/build.gradle.kts
fi

# 3. Create git commit & tag
git add .
git commit -m "chore(release): bump \${PROJECT_NAME} to v\${NEW_VERSION} [code \${NEW_VERSION_CODE}]" || true
git tag -a "v\${NEW_VERSION}" -m "Release v\${NEW_VERSION} for \${PROJECT_NAME}"

echo "======================================================================"
echo " 🎉 RELEASE TAG v\${NEW_VERSION} CREATED SUCCESSFULLY!"
echo "    Run 'git push origin main --follow-tags' to trigger CI/CD deployment."
echo "======================================================================"
`;
};
