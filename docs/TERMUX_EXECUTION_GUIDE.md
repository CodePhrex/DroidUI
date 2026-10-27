# Termux Execution Guide for DroidUI

1. Install Termux from F-Droid.
2. Setup storage: termux-setup-storage
3. Install packages: pkg update && pkg install -y nodejs-lts python git openjdk-17 build-essential
4. Extract package and navigate to app directory.
5. Install node modules: npm ci
6. Start Expo server: npx expo start --tunnel
7. Run QA verification: python3 ../scripts/droid_studio_qa_runner.py
