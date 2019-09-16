import React, { Component } from 'react'
import { View, Text, InteractionManager } from 'react-native'
import { InstanceDataStore } from 'blockstack/lib/auth/sessionStore';
import { UserData } from 'blockstack/lib/auth/authApp';
import * as bip39 from 'bip39';
// @ts-ignore
import * as bip32utils from 'bip32-utils';
// @ts-ignore
import * as bitcoin from 'react-native-bitcoinjs-lib';
// @ts-ignore
import { getBlockchainIdentities, signProfileForUpload, DEFAULT_PROFILE } from '@utils'; // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import { randomBytes } from 'crypto'
import * as blockstack from 'blockstack';

interface Props{

}
interface State {
    publicKey: string;
    privateKey: string;
    backupPhrase: string;
    userSession: any;
}

export default class Profile extends Component<Props, State> {

    constructor(props: Props){
        super(props);
        this.state = {
            privateKey: '',
            publicKey: '',
            backupPhrase: '',
            userSession: {}
        }
    }

    componentDidMount(){
        this.silentLogin()
    }

    async silentLogin(){
        
        let keychain = await this.initWallet();
        let id = this.createBlockchainIdentity(keychain.masterKeychain);
        let userSession = this.makeUserSession(id.appPrivateKey, id.appPublicKey);
        let api = {
            gaiaHubConfig: {
                url_prefix: 'https://gaia.blockstack.org/hub/'
            },
            gaiaHubUrl: 'https://hub.blockstack.org'
        }
        let profileJSON = this.makeProfileJSON(DEFAULT_PROFILE, {key: id.appPrivateKey, keyID: id.appPublicKey}, api);
        
        this.setState({
            backupPhrase: keychain.backupPhrase,
            publicKey: id.appPublicKey,
            privateKey: id.appPrivateKey,
            userSession: userSession
        })
    }

    async initWallet(){

        let masterKeychain = null
        const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
        // save seed phrase to SecureStorage on the device, allow the user to backup 
        let backupPhraseCache = await SecureStorage.getItem('backupPhrase');
        let backupPhrase;
        if (backupPhraseCache) {
            backupPhrase = backupPhraseCache
        } else {
            backupPhrase = bip39.generateMnemonic(STRENGTH, randomBytes)
            await SecureStorage.setItem('backupPhrase', backupPhrase);
        }
        console.log(backupPhrase);
        const seedBuffer = await bip39.mnemonicToSeed(backupPhrase)
        masterKeychain = await bitcoin.HDNode.fromSeedBuffer(seedBuffer)
        let keychain = {
            backupPhrase: backupPhrase,
            masterKeychain: masterKeychain
        }   
        return keychain;
    }

    createBlockchainIdentity(masterKeychain: any, identitiesToGenerate: number = 2){
        
        // skip identity 0 for blockstack browser use
        const {
        identityPublicKeychain,
        bitcoinPublicKeychain,
        firstBitcoinAddress,
        identityAddresses,
        identityKeypairs
        } = getBlockchainIdentities(masterKeychain, identitiesToGenerate)
        let appPublicKey = identityKeypairs[1].address;
        let appPrivateKey = identityKeypairs[1].key;

        return {
            appPublicKey: appPublicKey,
            appPrivateKey: appPrivateKey,
            identityKeypairs: identityKeypairs
        }
    }

    makeUserSession(appPrivateKey: string, appPublicKey: string, scopes: Array<string> =  ['store_write', 'publish_data'], appUrl: string = 'goodtimesx.com', hubUrl: string =  'https://hub.blockstack.org'){
        // see https://forum.blockstack.org/t/creating-a-usersession-using-app-private-key/8096/4
        
        const appConfig = new blockstack.AppConfig(
            scopes, 
            appUrl
        )
        
        const userData: UserData = {
            username: '',
            decentralizedID: '',
            appPrivateKey: appPrivateKey,
            authResponseToken: '',
            hubUrl: hubUrl,
            identityAddress: appPublicKey,
            profile: null,
        }

        const dataStore = new InstanceDataStore({ 
            appPrivateKey: appPrivateKey, 
            hubUrl: hubUrl,
            userData: userData
        });

        const userSession = new blockstack.UserSession({
            appConfig: appConfig,
            sessionStore: dataStore
        });

        return userSession;
    }

    makeProfileJSON(profile: any, keypair: any, api: any){
        debugger;
        let profileJSON = signProfileForUpload(profile, keypair, api);
        return profileJSON;
    }

    render() {
        return (
            <View>
                <Text>Public Key</Text>
                <Text>{this.state.publicKey}</Text>
                <Text/>
                <Text/>

                <Text>Private Key</Text>
                <Text>{this.state.privateKey}</Text>
                <Text/>
                <Text/>

                <Text>Backup Phrase</Text>
                <Text>{this.state.backupPhrase}</Text>
                <Text/>
                <Text/>

                <Text>User Session</Text>
                <Text>{ JSON.stringify(this.state.userSession) || '' }</Text>
            </View>
        )
    }
}
