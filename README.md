This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Crypto Mining App

A React Native application with a Node.js backend for cryptocurrency mining simulation with real-time notifications.

## ✨ Features

- 🔐 Wallet-based authentication
- ⛏️ Mining sessions with customizable durations
- 🚀 Multiplier upgrades for faster mining
- 💰 Real-time token balance tracking
- 🔔 **Push notifications when mining completes** (NEW!)
- 📱 Works on iOS and Android
- 🎨 Beautiful UI with animations

## 🔔 Mining Completion Notifications

This app now includes comprehensive notification functionality:

- ✅ Get notified when mining completes (app open, closed, or backgrounded)
- ✅ Works whether you're logged in or logged out
- ✅ Automatic checks every minute (backend) and every 5 minutes (frontend)
- ✅ Tap notification to claim rewards instantly
- ✅ Cross-platform support (iOS & Android)

**Quick Start**: See [QUICK_START_NOTIFICATIONS.md](QUICK_START_NOTIFICATIONS.md) for setup instructions.

**Full Documentation**:
- [Notification Setup Guide](NOTIFICATION_SETUP.md)
- [Testing Guide](TESTING_NOTIFICATIONS.md)
- [Feature Summary](NOTIFICATION_FEATURE_SUMMARY.md)
- [Library Update Note](LIBRARY_UPDATE_NOTE.md) - Using Notifee for notifications

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Prerequisites

1. Node.js (v20 or higher)
2. MongoDB (running locally or remote connection)
3. React Native development environment set up

## Step 0: Start the Backend Server

The app requires a backend server for mining sessions and notifications.

```sh
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Create .env file (first time only)
cp .env.example .env
# Edit .env and add your MongoDB connection string

# Start the backend server
npm run dev
```

You should see:
```
✅ Notification service initialized - checking every minute
🔔 Notification service: Active
```

For more details, see [backend/README.md](backend/README.md)

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
