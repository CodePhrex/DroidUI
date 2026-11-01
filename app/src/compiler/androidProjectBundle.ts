import { ComponentNode } from '../types/schema';
import { AndroidExportConfig, defaultConfig } from './androidProjectExporter';

export interface GeneratedAndroidFile {
  path: string;
  content: string;
}

export interface AndroidGenerationDiagnostic {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  nodeId?: string;
}

export interface AndroidProjectBundle {
  projectName: string;
  packageName: string;
  framework: 'compose';
  files: GeneratedAndroidFile[];
  diagnostics: AndroidGenerationDiagnostic[];
}

const escapeKotlin = (value: unknown): string =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '');

const safeIdentifier = (value: string): string =>
  value.trim().replace(/[^A-Za-z0-9_]/g, '_').replace(/^[^A-Za-z_]/, '_$&') || 'DroidGeneratedApp';

const packagePattern = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)+$/;
const supportedTypes = new Set(['Container', 'Card', 'Text', 'Button', 'Badge', 'ProgressBar', 'Switch', 'Slider', 'Checkbox']);

const walk = (node: ComponentNode, visit: (node: ComponentNode) => void): void => {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
};

const styleModifier = (node: ComponentNode): string => {
  const parts: string[] = [];
  const style = node.style || {};
  if (typeof style.padding === 'number') parts.push(`.padding(${style.padding}.dp)`);
  if (typeof style.paddingHorizontal === 'number') parts.push(`.padding(horizontal = ${style.paddingHorizontal}.dp)`);
  if (typeof style.paddingVertical === 'number') parts.push(`.padding(vertical = ${style.paddingVertical}.dp)`);
  if (typeof style.width === 'number') parts.push(`.width(${style.width}.dp)`);
  if (typeof style.height === 'number') parts.push(`.height(${style.height}.dp)`);
  if (typeof style.rotation === 'number' && style.rotation !== 0) parts.push(`.rotate(${style.rotation}f)`);
  if (typeof style.opacity === 'number') parts.push(`.alpha(${Math.max(0, Math.min(1, style.opacity))}f)`);
  return 'Modifier' + parts.join('');
};

const renderNode = (node: ComponentNode, indent: string, diagnostics: AndroidGenerationDiagnostic[]): string => {
  const pad = indent;
  const modifier = styleModifier(node);
  const children = node.children || [];
  if (node.type === 'Container' || node.type === 'Card') {
    const isRow = node.style?.flexDirection === 'row';
    const layout = isRow ? 'Row' : 'Column';
    const body = children.map((child) => renderNode(child, pad + '    ', diagnostics)).join('\n');
    const background = typeof node.style?.backgroundColor === 'string' ? node.style.backgroundColor : undefined;
    const bgModifier = background && /^#[0-9a-fA-F]{6}$/.test(background)
      ? `.background(Color(0xFF${background.slice(1)}))`
      : '';
    return `${pad}${layout}(modifier = ${modifier}${bgModifier}) {\n${body}\n${pad}}`;
  }
  if (node.type === 'Text') {
    const text = escapeKotlin(node.props?.text || 'Text');
    const color = typeof node.style?.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(node.style.color)
      ? `, color = Color(0xFF${node.style.color.slice(1)})`
      : '';
    const size = typeof node.style?.fontSize === 'number' ? `, fontSize = ${node.style.fontSize}.sp` : '';
    return `${pad}Text(text = "${text}", modifier = ${modifier}${color}${size})`;
  }
  if (node.type === 'Button') {
    const label = escapeKotlin(node.props?.label || 'Button');
    const action = node.props?.action;
    if (action?.type === 'change_label' && typeof action.successLabel === 'string' && action.successLabel.trim()) {
      const stateName = safeIdentifier(node.id) + 'Clicked';
      return `${pad}var ${stateName} by remember { mutableStateOf(false) }\n${pad}Button(onClick = { ${stateName} = true }, modifier = ${modifier}) {\n${pad}    Text(if (${stateName}) "${escapeKotlin(action.successLabel)}" else "${label}")\n${pad}}`;
    }
    diagnostics.push({ severity: 'warning', code: 'BUTTON_ACTION_UNBOUND', nodeId: node.id, message: 'Button has no supported action. Supported action: { type: "change_label", successLabel: "..." }.' });
    return `${pad}Button(onClick = { }, modifier = ${modifier}) { Text("${label}") }`;
  }
  if (node.type === 'Badge') {
    return `${pad}Surface(modifier = ${modifier}, color = Color(0xFF334155), shape = RoundedCornerShape(50.dp)) { Text("${escapeKotlin(node.props?.text || 'Badge')}", modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), color = Color.White) }`;
  }
  if (node.type === 'ProgressBar') {
    const progress = Math.max(0, Math.min(100, Number(node.props?.progress ?? 70))) / 100;
    return `${pad}LinearProgressIndicator(progress = ${progress}f, modifier = ${modifier})`;
  }
  if (node.type === 'Switch') {
    const initial = node.props?.value === false ? 'false' : 'true';
    return `${pad}var ${safeIdentifier(node.id)}State by remember { mutableStateOf(${initial}) }\n${pad}Row(verticalAlignment = Alignment.CenterVertically, modifier = ${modifier}) {\n${pad}    Text("${escapeKotlin(node.props?.label || 'Switch')}")\n${pad}    Switch(checked = ${safeIdentifier(node.id)}State, onCheckedChange = { ${safeIdentifier(node.id)}State = it })\n${pad}}`;
  }
  if (node.type === 'Slider') {
    const initial = Math.max(0, Math.min(100, Number(node.props?.value ?? 50))) / 100;
    const stateName = safeIdentifier(node.id);
    return `${pad}var ${stateName}Value by remember { mutableFloatStateOf(${initial}f) }\n${pad}Column(modifier = ${modifier}) {\n${pad}    Text("${escapeKotlin(node.props?.label || 'Slider')}: \${(${stateName}Value * 100).toInt()}%")\n${pad}    Slider(value = ${stateName}Value, onValueChange = { ${stateName}Value = it })\n${pad}}`;
  }
  if (node.type === 'Checkbox') {
    const initial = node.props?.checked === false ? 'false' : 'true';
    const stateName = safeIdentifier(node.id);
    return `${pad}var ${stateName}Checked by remember { mutableStateOf(${initial}) }\n${pad}Row(verticalAlignment = Alignment.CenterVertically, modifier = ${modifier}) {\n${pad}    Checkbox(checked = ${stateName}Checked, onCheckedChange = { ${stateName}Checked = it })\n${pad}    Text("${escapeKotlin(node.props?.label || 'Checkbox')}")\n${pad}}`;
  }
  diagnostics.push({ severity: 'error', code: 'UNSUPPORTED_COMPONENT', nodeId: node.id, message: `Component type "${node.type}" is not supported by the Jetpack Compose generator yet.` });
  return '';
};

export const validateAndroidExportConfig = (config: AndroidExportConfig): AndroidGenerationDiagnostic[] => {
  const diagnostics: AndroidGenerationDiagnostic[] = [];
  if (!packagePattern.test(config.packageName)) diagnostics.push({ severity: 'error', code: 'INVALID_PACKAGE_NAME', message: 'Package name must contain at least two dot-separated Java/Kotlin identifier segments.' });
  if (!config.appName.trim()) diagnostics.push({ severity: 'error', code: 'EMPTY_APP_NAME', message: 'Application name is required.' });
  if (config.framework !== 'compose') diagnostics.push({ severity: 'error', code: 'FRAMEWORK_NOT_IMPLEMENTED', message: 'Only Jetpack Compose generation is implemented in this release. Other framework choices are disabled for export.' });
  if (config.minSdk > config.targetSdk) diagnostics.push({ severity: 'error', code: 'SDK_RANGE_INVALID', message: 'Minimum SDK cannot exceed target SDK.' });
  if (config.gradleDSL !== 'kts') diagnostics.push({ severity: 'error', code: 'DSL_NOT_IMPLEMENTED', message: 'The generated project currently uses Gradle Kotlin DSL.' });
  return diagnostics;
};

export const generateAndroidProjectBundle = (
  rootNode: ComponentNode,
  config: AndroidExportConfig = defaultConfig,
): AndroidProjectBundle => {
  const diagnostics = validateAndroidExportConfig(config);
  walk(rootNode, (node) => {
    if (!supportedTypes.has(node.type)) {
      diagnostics.push({ severity: 'error', code: 'UNSUPPORTED_COMPONENT', nodeId: node.id, message: `Component type "${node.type}" is not supported by the Jetpack Compose generator yet.` });
    }
  });
  if (diagnostics.some((item) => item.severity === 'error')) {
    return { projectName: config.appName, packageName: config.packageName, framework: 'compose', files: [], diagnostics };
  }

  const packagePath = config.packageName.split('.').join('/');
  const renderDiagnostics: AndroidGenerationDiagnostic[] = [];
  const ui = renderNode(rootNode, '        ', renderDiagnostics);
  diagnostics.push(...renderDiagnostics);
  const appName = escapeKotlin(config.appName);
  const appClass = safeIdentifier(config.appName);
  const abiFilters = config.abiFilter === 'all' ? '' : `\n        ndk { abiFilters += listOf("${config.abiFilter}") }`;
  const appGradle = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${config.packageName}"
    compileSdk = ${config.targetSdk}

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = ${config.minSdk}
        targetSdk = ${config.targetSdk}
        versionCode = 1
        versionName = "1.0.0"${abiFilters}
    }

    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.06.00"))
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
`;
  const files: GeneratedAndroidFile[] = [
    { path: 'settings.gradle.kts', content: `pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "${appName}"
include(":app")
` },
    { path: 'build.gradle.kts', content: `plugins {
    id("com.android.application") version "8.6.1" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
` },
    { path: 'gradle.properties', content: 'org.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nkotlin.code.style=official\n' },
    { path: 'app/build.gradle.kts', content: appGradle },
    { path: 'app/src/main/AndroidManifest.xml', content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:allowBackup="true" android:label="${appName}" android:supportsRtl="true" android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
` },
    { path: `app/src/main/java/${packagePath}/MainActivity.kt`, content: `package ${config.packageName}

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.background
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize().safeDrawingPadding()) {
                    ${appClass}Screen()
                }
            }
        }
    }
}

@Composable
fun ${appClass}Screen() {
    ${ui}
}
` },
    { path: 'README.md', content: `# ${config.appName}

Generated by DroidUI as a native Android Jetpack Compose project.

## Build
- Android Studio: open this directory and sync Gradle.
- Command line (with Gradle 8.7 installed): gradle assembleDebug
- Minimum SDK: API ${config.minSdk}
- Target SDK: API ${config.targetSdk}

The source UI is generated from the current DroidUI component tree. Review the generation diagnostics before release. A successful source export is not a verified APK build.
` },
  ];
  return { projectName: config.appName, packageName: config.packageName, framework: 'compose', files, diagnostics };
};

export const serializeAndroidProjectBundle = (bundle: AndroidProjectBundle): string =>
  JSON.stringify({ format: 'droidui-android-project', formatVersion: 1, ...bundle }, null, 2);
