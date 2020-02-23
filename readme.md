Goodtimes
---------------------

The healthy social network for where you at! Foster local communities. Live your best real life with the people closest to you! :dark_sunglasses:  [privacy included] :lock::lock::lock: 

- Make new friends in your neighborhood
- Discovery cool places and people based on photos and chat
- Connect with local businesses
- Help your local community thrive
- Share media at meetups
- Make Goodtimes

Today social networks prevent us from living our best real life and can cause some serious mental health issue! We stay at home constantly checking status updates, likes and compring ourselves to other people's perfect, fake version of themselves.

Goodtimes is the inverse of that! It fosters healthy real life relationships. The social feeds are deleted each day and you are only allowed to join a social feed if you are physically in the location. 

When I joined MySpace and Facebook back in the mid 2000s the social network was second to real life. I met everone on my doom room floor from Facebook, then set the app down and did not use it. We interfaceed socailly in real life, no app needed. It was simply used to break the ice and find friends with similar interests. 

Promotes healthy connections. Join now, connect in real life and get your headspace back! 

Make Goodtimes 🤙


Problem with social networks today
----------------------------------
- Dunbars law states that a person can only maintain 150 social relationships. 
- Why do people have thousands of followers on social media, most of whom they have never met?
- Why do people constantly compare themselves to others? (like counts, how many vactions a "friend" goes on etc...)
- This can lead to depression, isolation, anxiety, and fear of missing out.
- Many people live in the past on social media...maybe that is becuase the past is never deleted.


Solution
---------
Go out and live real life for today!

Problem
--------
- Maybe you are shy
- Maybe you are new to town
- Maybe you simply need change
- Maybe you need an ice breaker
- Maybe you don't know where to go
- Maybe you have a hobby but can't find anybody that shares your interest

Goodtimes Features
------------------
 - 🎗 Build healthy social relationships at the places you visit the most
 - 🏡 Built around local communities
- Make friends, old and new
- Discover local people and places with similar interests
- Go to a place, engage socailly with a digital ice breaker
- Everything is deleted at the end of each day (don't worry your media and pictures are safe in your own storage bucket, only for your eyes 👀to see)
- We don't track you. In fact, it's end to end encrypted and you are the only one with the key.

Use Cases
---------
- Particiate in a local group chat --> then chat in real life
- Like a photo at the coffee shop your are at --> then discuss it in real life with the photographer
- Share a file with everybody ar a meetup

Easy, Low Friction
-----------
- You don't to search and add people, if you are near them you can communicate...just like in real life 👌



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

Redux Sagas pattern
-------------------
We orignally used redux thunk for fetching data async, but it did not scale. For example to Get posts we had to (1) get a access token 
(2) get a geohash from the server (3) get a room key via a websocket (4) then finally get the posts from the api.

This led to alot dispatches and for the compontDidUpdate to have to manage state updates to kick off the next step. 

A better, more scalable, organized approach is to use Redux Sagas.

Read here:
- https://shift.infinite.red/using-redux-saga-to-simplify-your-growing-react-native-codebase-2b8036f650de#.7wl4wr1tk
- https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
- https://hackernoon.com/moving-form-redux-thunk-to-redux-saga-5c19d0011ca0
- https://medium.com/@deeepakampolu/from-redux-thunk-to-sagas-2896c0abc676
- https://www.youtube.com/watch?v=Q1_RfF_qRMc&t=1349s
- https://levelup.gitconnected.com/react-native-redux-implementing-redux-saga-for-an-asynchronous-flow-90a0e9d7d8e8
 
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


## ios , xocde and cocopods

Read these two articles on dependency manamgent in xcode with react-native....it can be tricky

- https://engineering.brigad.co/demystifying-react-native-modules-linking-ae6c017a6b4a
- https://sandstorm.de/de/blog/post/react-native-managing-native-dependencies-using-xcode-and-cocoapods.html

The key takeaway is that you should be careful with the command `react-native link`. If you run this command it could put files in the Library directory
of your xcode project instead of the PODS project. 

Be careful with the react-native-maps package, i had to specifiucally download the verion `0.24.2` in npm to avoid xcode build errors with RCTImage