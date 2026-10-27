# GitHub Codespaces Execution Guide for DroidUI

1. Create a Codespace from your GitHub repository.
2. Install dependencies: npm ci
3. Run tests: npm test -- --coverage
4. Start Expo: npx expo start --tunnel
5. Forward port 8081 / scan QR code on mobile.
6. Run QA verification: python3 scripts/droid_studio_qa_runner.py
