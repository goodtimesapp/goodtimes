import React, { Component } from "react";
import { Provider } from 'react-redux';
import { store, persistor } from './reduxStore/configureStore';
import { StyleProvider } from "native-base";
// @ts-ignore
import theme from './native-base-theme/variables/material.js';
// @ts-ignore
import getTheme from './native-base-theme/components';
import { PersistGate } from 'redux-persist/integration/react'
import Index from './components/Index';
import { View, TouchableOpacity, Text } from 'react-native'
declare let window: any;
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import AsyncStorage from '@react-native-community/async-storage';
import * as bitcoinjs from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
// @ts-ignore
import * as bitcoin from 'react-native-bitcoinjs-lib';
import { getBlockchainIdentities, signProfileForUpload, DEFAULT_PROFILE } from '@utils';

export interface Props { }
interface State { }
export const BLOCKSTACK_STATE_VERSION_KEY = 'BLOCKSTACK_STATE_VERSION'

export default class App extends Component<Props, State> {

  constructor(props: Props){
    super(props);
    window.SecureStorage = SecureStorage;
    window.AsyncStorage = AsyncStorage;
    window.blockstack = require('blockstack');
    window.blockstackRN = require('react-native-blockstack');
    window.bitcoinjs = bitcoinjs;
    window.bitcoin = bitcoin;
    window.getBlockchainIdentities = getBlockchainIdentities;
    window.bip39 = bip39;
    window.store = store;
  }
 

  render (){
    return (
      <StyleProvider style={getTheme(theme)}>
        <Provider store={store} >
          <PersistGate loading={null} persistor={persistor}>
            <Index/>
          </PersistGate>
        </Provider>
      </StyleProvider>
   )
  }
}