export type ProviderType = 'github' | 'gitlab' | 'bitbucket';

export const generateGitHubActionsYAML = (projectName = 'Droid Studio App'): string => {
  return `# GitHub Actions CI/CD Workflow for ${projectName}
name: Android CI/CD Pipeline

on:
  push:
    branches: [ main, master, release/* ]
  pull_request:
    branches: [ main, master ]

jobs:
  test-and-lint:
    name: 🧪 Test & Lint
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🔍 TypeScript Static Typecheck
        run: npx tsc --noEmit

      - name: 🧪 Run Jest Unit Tests
        run: npm test -- --coverage --ci --maxWorkers=2

  build-android-apk:
    name: 🤖 Build Android APK (Expo EAS)
    needs: test-and-lint
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x

      - name: ☕ Setup Java Development Kit (JDK 17)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: 🚀 Setup Expo EAS CLI
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EAS_BUILD_TOKEN }}

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🏗️ Trigger Cloud APK Build
        run: eas build --platform android --profile preview --non-interactive

      - name: 📤 Upload Build Artifact Summary
        uses: actions/upload-artifact@v4
        with:
          name: build-logs
          path: ./.eas-build-logs/
`;
};

export const generateGitLabCIYAML = (projectName = 'Droid Studio App'): string => {
  return `# GitLab CI/CD Pipeline for ${projectName}
image: node:20-alpine

stages:
  - test
  - build

cache:
  paths:
    - node_modules/

lint_and_test:
  stage: test
  script:
    - npm ci
    - npm test -- --ci

build_apk:
  stage: build
  only:
    - main
  script:
    - npm ci
    - npm install -g eas-cli
    - eas build --platform android --profile preview --non-interactive
`;
};

export const generateBitbucketPipelinesYAML = (projectName = 'Droid Studio App'): string => {
  return `# Bitbucket Pipelines Config for ${projectName}
image: node:20

pipelines:
  default:
    - step:
        name: Lint & Unit Testing
        script:
          - npm ci
          - npm test -- --ci
  branches:
    main:
      - step:
          name: Test & Build Android APK
          script:
            - npm ci
            - npm test -- --ci
            - npm install -g eas-cli
            - eas build --platform android --profile preview --non-interactive
`;
};
