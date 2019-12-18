import React, { Component } from "react";
import { Provider } from 'react-redux';
import { store, persistor } from './reduxStore/configureStore';
import { PersistGate } from 'redux-persist/integration/react'
import Index from './components/Index';
import { SafeAreaView } from 'react-native'
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

export interface Props { }
interface State { 
  
}
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
      
      <StyleProvider style={getTheme(platform)}>
        <Provider store={store} >
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaView style={{flex:1}}>
              <Index/>
            </SafeAreaView>    
          </PersistGate>
        </Provider>
      </StyleProvider>
   )
  }
}