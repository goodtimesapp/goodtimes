Goodtimes
---------------------

The social app for where you're at! :dark_sunglasses:  [privacy included] :lock::lock::lock: 


Setup and Install (Android)
-----------------------------
- install react native nodeify globally `npm i rn-nodeify -g` since we are using crypto libs https://github.com/novalabio/react-native-bitcoinjs-lib
- install node packages in the main app `cd src/app` then `npm i`
- install node packages in the radiks app `cd radiks` then `npm i`
- plug in an andoid phone and `npm run android`


Dependencies
--------------------------
- note you need to run `npm run jetifier` https://www.npmjs.com/package/jetifier after you add a new package (to android) due to new AndroidX components not supported in old packages. If not, you will get an error that looks like this: 

```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':react-native-maps:compileDebugJavaWithJavac'.
> Compilation failed; see the compiler error output for details.
```

You need to get api keys and create a .env file. Read about it here: https://dev.to/calintamas/how-to-manage-staging-and-production-environments-in-a-react-native-app-4naa

```
GOOGLE_MAPS_APIKEY=YOURKEY
RADAR_KEY=YOURKEY
RADAR_KEY_API=YOURKEY
GOOGLE_MAPS_KEY2=YOURKEY
```

A. Modify react-native-blockstack to use v0.59.0.10 and debug profile on android
----------------------

I ended up ditching expo and just used the react native cli as documented here: https://facebook.github.io/react-native/docs/getting-started (switch tabs to ‘React Native CLI quickstart’)

Then I had to tweak a few things after cloning the git repo.

First you have to create a debug.keystore as documented here - https://gist.github.com/henriquemenezes/70feb8fff20a19a65346e48786bedb8f:

```
cd example/android/keystores
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "C=US, O=Android, CN=Android Debug"
Next you need to create a debug android manifest
```

```
cd app/android/app/src
mkdir debug
cd debug
create a file called AndroidManifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
    <application android:usesCleartextTraffic="true" tools:targetApi="28" tools:ignore="GoogleAppIndexingWarning" />
</manifest>
```

Make sure you install dependencies npm install

To run the app on an android device or emulator make sure you run two terminal windows. One for the metro server and one for your app:

In terminal 1
react-native start
In terminal 2
react-native run-android


B. Use the master branch version of react-native-maps
----------------------
On github (the npm version is not up to date): see https://github.com/react-native-community/react-native-maps/issues/2954


```
npm install --save https://github.com/react-native-community/react-native-maps.git
npm run jetify
react-native run-android
```


Redux Structure
----------------
```
redux
  |_ component
    |_ actions
    |_ reducers
    |_ selectors
    index.ts
  |_ component2
    |_ actions
    |_ reducers
    |_ selectors
    index.ts
configureStore.ts
index.ts
```

Generate Code
------------
Using plopjs to generate the redux strux above with CRUD operations, a model, a component, and a container. View plopfile.js for the config and templates

`npm run g YOURMODEL reduxStore`

Debugging
-----------------
1. Install react-native-debugger https://github.com/jhen0409/react-native-debugger
2. Run the app on Windows (.exe) or Mac (.app). You can change the path in packages.json scripts `"android:debug": "C: && cd Users/USERNAME/Downloads/rn-debugger-windows-x64 && start react-native-debugger.exe"`
3. In the android or ios app, shake it, and enable Remote JS Debugging

Run on Android
----------------
`npm run android`


Troubleshooting
-----------------
- On windows you might need to run the `adb reverse tcp:8081 tcp:8081` if you recieve a `script failed to load...metro server ` error
- You also might need to recreate debug signing certificates or uninstall a previous version of the app if the code signing certs do not match. 

Federated Network Design Proposals and Ideas
--------------------------------------------
[See Radiverse] https://forum.blockstack.org/t/radiks-decentralization-proposal/8400

*Data Flow*

User data, (like a photo) gets written to the users chosen bucket (gaia), then it gets indexed to a central server (federated in the future...like mastadon) and encrypted with a group key only users in the physical location have access to. Physical location is proven by a combination of reputation, gps location, and pinging nearby users via bluetooth/audio/wifi via the google nearby messaging protocol. User encrypted Indexed data gets deleted after a day or so. The users generated data (like a photo) remains in full ownership forever in their chosen storage bucket

*Network Design, Monetization, Smart Contracts and Governance*

The network does not ever need to run as peer to peer. It shall run as a federated network. The federated network will stay honest because each node will enter a smart contract and share in the profit from the AD revenue. The network will stay fast and have a high uptime because federated opertors will be voted in regionally. Eventually as the network grows you will not need a central authority to approve regional nodes. It can be done by some sort of a Goodtimes Cosortium or voting goverence process.

*Governance*

If a government or local police department wants access to the encryted data they will have to contact the regional operator. They can be given encrypted data that they will never be able to decrypt. Or like in real life they need to be present where the incident happens to see the feed, or talk to eye witnesses

*Code Signing*

All client side code will be signed and checksum'd to the peer reviewed code (via google play and apple app stores) . If a regional operator decides to fork and create their own client (maybe with a backdoor) they will be kicked off the network as the client code hash (or signed code) will not be in consensus with the majority of regional node operators


