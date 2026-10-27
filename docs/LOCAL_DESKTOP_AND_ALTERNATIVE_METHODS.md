# Local Desktop & Alternative Execution Methods

## Local Desktop (macOS / Linux / Windows WSL2)
- Require Node.js 20+, JDK 17, Python 3.12, Android Studio
- Run: npm ci && npm start
- Press 'a' for Android Emulator or 'w' for Web Preview.

## Docker Container
- Build image: docker build -t droidui-studio .
- Run container: docker run -p 8081:8081 -it droidui-studio
