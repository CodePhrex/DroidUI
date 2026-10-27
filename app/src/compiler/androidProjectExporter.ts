import { ComponentNode } from '../types/schema';

export type FrameworkTarget = 'compose' | 'xml_native' | 'react_native_module' | 'flutter_widget';
export type GradleDSL = 'kts' | 'groovy';
export type TargetSDK = 35 | 34 | 33;
export type MinSDK = 21 | 24 | 26;
export type ABIFilter = 'arm64-v8a' | 'armeabi-v7a' | 'x86_64' | 'x86' | 'all';

export interface AndroidExportConfig {
  packageName: string;
  appName: string;
  framework: FrameworkTarget;
  gradleDSL: GradleDSL;
  targetSdk: TargetSDK;
  minSdk: MinSDK;
  abiFilter: ABIFilter;
  enableFlavors: boolean;
  enableABISplit: boolean;
}

export const defaultConfig: AndroidExportConfig = {
  packageName: 'com.droidstudio.app',
  appName: 'DroidStudioApp',
  framework: 'compose',
  gradleDSL: 'kts',
  targetSdk: 35,
  minSdk: 24,
  abiFilter: 'all',
  enableFlavors: true,
  enableABISplit: false,
};

export const generateAppBuildGradleKts = (config: AndroidExportConfig): string => {
  const abiList = config.abiFilter === 'all'
    ? 'setOf("arm64-v8a", "armeabi-v7a", "x86_64")'
    : `setOf("${config.abiFilter}")`;

  return `plugins {
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
        versionName = "1.0.0"

        ndk {
            abiFilters.addAll(${abiList})
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
`;
};

export const generateSettingsGradleKts = (config: AndroidExportConfig): string => {
  return `rootProject.name = "${config.appName}"
include(":app")
`;
};

export const generateFullProjectFileTree = (rootNode: ComponentNode, config: AndroidExportConfig = defaultConfig): string => {
  return `ANDROID PROJECT BUNDLE FILE TREE
Target Framework: ${config.framework.toUpperCase()}
Package Name: ${config.packageName}
Target SDK: ${config.targetSdk} | Min SDK: ${config.minSdk}
ABI Architectures: ${config.abiFilter}
Build DSL: ${config.gradleDSL.toUpperCase()}

${config.appName}/
├── settings.gradle.kts
├── build.gradle.kts
└── app/
    ├── build.gradle.kts
    └── src/
        └── main/
            ├── AndroidManifest.xml
            └── java/
`;
};
