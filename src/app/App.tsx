import React, { Component } from "react";
import { Provider } from 'react-redux';
import { store, persistor, sagaMiddleware } from './reduxStore/configureStore';
import * as websocketsStore from './reduxStore/websockets/websockets.store';
import * as placeStore from './reduxStore/places/place.store';
import * as postsStore from './reduxStore/posts/posts.store';
import * as profileStore from './reduxStore/profile/profile.store';
import { PersistGate } from 'redux-persist/integration/react'
import Index from './components/Index';
import { SafeAreaView, AppState } from 'react-native';
declare let window: any;
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import AsyncStorage from '@react-native-community/async-storage';
import * as bitcoinjs from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
// @ts-ignore
import * as bitcoin from 'react-native-bitcoinjs-lib';
// @ts-ignore
import { getBlockchainIdentities, signProfileForUpload, DEFAULT_PROFILE } from '@utils';
import { StyleProvider } from "native-base";
// @ts-ignore
import getTheme from './native-base-theme/components';
// @ts-ignore
import platform from './native-base-theme/variables/platform';
// @ts-ignore
import Geohash from 'latlon-geohash';
// @ts-ignore
import localStorage from 'react-native-sync-localstorage';
import { call, put, takeEvery, takeLatest, take } from 'redux-saga/effects'

export interface Props { }
interface State {

}
export const BLOCKSTACK_STATE_VERSION_KEY = 'BLOCKSTACK_STATE_VERSION'


export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    window.secureStorage = SecureStorage;
    window.asyncStorage = AsyncStorage;
    window.blockstack = require('blockstack');
    // window.blockstackRN = require('react-native-blockstack');
    // window.bitcoinjs = bitcoinjs;
    // window.bitcoin = bitcoin;
    // window.getBlockchainIdentities = getBlockchainIdentities;
    // window.bip39 = bip39;
    window.store = store;
    // window.websocketsStore = websocketsStore;
    // window.placeStore = placeStore;
    // window.postsStore = postsStore;
    window.profileStore = profileStore;
    // window.Geohash = Geohash;
    window.localStorage = localStorage;
    window.saga = {};
    window.saga.put = put;
    window.saga.call = call;
    window.saga.take = take;
  }



  render() {
    return (

      // @ts-ignore
      <StyleProvider style={getTheme(platform)} >
        <Provider store={store} >
          <PersistGate loading={null} persistor={persistor}>
            {/* <SafeAreaView style={{ flex: 1 }}> */}
              <Index accessibilityLabel='indexPage' testId="indexPage" />
            {/* </SafeAreaView> */}
          </PersistGate>
        </Provider>
      </StyleProvider>

    )
  }
}