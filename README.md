This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Install the app dependencies

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

Setup iOS dependencies

```bash
npx pod-install
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Note:

- It's advisable to use the real device to try it out so that you can try the biometrics login easily
- If using iOS simulator, you can simulate FaceID by going to Features tab (Simulator App) > click on Enrolled > select Matching Face ID/Non-matching Face ID.
- If using real Apple device, you will need to allow the development cert in your iPhone settings (Settings App > General > VPN & Device Management > Allow the cert).
- If using real Android device, you will need to enable developer mode and USB debugging.

## Additional feature:

- The app will blur the screen after 15s of inactivity and auto log out after another 15s (total 30s).
