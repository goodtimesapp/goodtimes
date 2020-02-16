import React, { Component } from 'react'
import { ScrollView, Text, TextInput, Button } from 'react-native'
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
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER } from 'react-native-dotenv';
import { configure, User, UserGroup, GroupInvitation, Model, Central } from 'radiks/src/index';
import Message from './../../models/Message';
import EncryptedMessage from './../../models/EncryptedMessage';
import AsyncStorage from '@react-native-community/async-storage';
import Radiks from './Radiks';
declare let window: any;
window.radiks = require('radiks/src/index');
window.EncryptedMessage = EncryptedMessage;


interface Props {

}
interface State {
    publicKey: string;
    privateKey: string;
    backupPhrase: string;
    userSession: any;
    username: string;
    text: string;
    value: string;
}

export default class Profile extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            privateKey: '',
            publicKey: '',
            backupPhrase: '',
            userSession: null,
            username: '',
            text: '',
            value: ''
        }
    }

    async componentDidMount() {
        await this.silentLogin();
        // this.radiksGetMessage();
        // this.radiksPutMessage('poo');
        // let group: any = await this.createRadiksGroup('Starbucks');
        // await AsyncStorage.setItem( group.attrs.name, group._id );
        // this.viewMyGroups();
        // this.radiksPutEncryptedGroupMessage('one');
        // good34973.id.blockstack - inviter
        // pizza (group) = 2a8498105aa8-499c-83af-439d4ed1089f
        // Invite = good17942.id.blockstack, effb50a03c3c-4b18-aca2-3b04aa8f5231

    }

    async silentLogin() {

        let keychain = await this.initWallet();
        let id = await this.createBlockchainIdentity(keychain);
        let username = await SecureStorage.getItem('username');
        let userSession = this.makeUserSession(id.appPrivateKey, id.appPublicKey, username, id.profileJSON.decodedToken.payload.claim);
       
        this.configureRadiks(userSession);
        let blockstackUser = await User.createWithCurrentUser();
        this.setState({
            backupPhrase: keychain.backupPhrase,
            publicKey: id.appPublicKey,
            privateKey: id.appPrivateKey,
            userSession: userSession,
            username: username
        })
    }

    async initWallet() {
       
        let masterKeychain = null
        let action = 'none';
        const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
        // save seed phrase to SecureStorage on the device, allow the user to backup 
        let backupPhraseCache = await SecureStorage.getItem('backupPhrase');
        let backupPhrase;
        if (backupPhraseCache) {
            backupPhrase = backupPhraseCache
        } else {
            action = 'create'; // 'updateAccount'
            backupPhrase = bip39.generateMnemonic(STRENGTH, randomBytes)
            await SecureStorage.setItem('backupPhrase', backupPhrase);
        }
        console.log(backupPhrase);
        const seedBuffer = await bip39.mnemonicToSeed(backupPhrase)
        masterKeychain = await bitcoin.HDNode.fromSeedBuffer(seedBuffer)
        let keychain = {
            backupPhrase: backupPhrase,
            masterKeychain: masterKeychain,
            action: action
        }
        return keychain;
    }

    async createBlockchainIdentity(keychain: any, identitiesToGenerate: number = 2) {

        const { identityKeypairs } = getBlockchainIdentities(keychain.masterKeychain, identitiesToGenerate)

        // use identity 0 for blockstack browser and profile
        let browserPublicKey = identityKeypairs[0].address;
        let browserPrivateKey = identityKeypairs[0].key;
        let browserKeyID = identityKeypairs[0].keyID;
        let api = {
            gaiaHubConfig: {
                url_prefix: 'https://gaia.blockstack.org/hub/'
            },
            gaiaHubUrl: 'https://hub.blockstack.org'
        }
        
        let profileJSON = this.makeProfileJSON(DEFAULT_PROFILE, { key: browserPrivateKey, keyID: browserKeyID }, api);
        let profile = (JSON.parse(profileJSON))[0];
        
        if (keychain.action !== 'none') { // make profileJSON
            let username = '';
            if (keychain.action == 'create'){
                username = "good" + this.rando() + '.id.blockstack';
                profile.decodedToken.payload.claim.image = [{
                   '@type': 'ImageObject',
                   'contentUrl': 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0',
                   'name': 'avatar'    
                }]
            }
            if (keychain.action == 'update'){
                username = this.state.username;
            }
            if (username !== '') {
                await SecureStorage.setItem('username', username);
                let userSession = this.makeUserSession(browserPrivateKey, browserPublicKey, username, profile.decodedToken.payload.claim);
                let profileResp = this.saveProfileJSON(userSession, [profile]);
            }
        }

        // use identity 1 for this first app keypair
        let appPublicKey = identityKeypairs[1].address;
        let appPrivateKey = identityKeypairs[1].key;

        return {
            appPublicKey: appPublicKey,
            appPrivateKey: appPrivateKey,
            identityKeypairs: identityKeypairs,
            profileJSON: profile,
        }
    }

    makeUserSession(appPrivateKey: string, appPublicKey: string, username: string, profileJSON: any = null, scopes: Array<string> = ['store_write', 'publish_data'], appUrl: string = 'goodtimesx.com', hubUrl: string = 'https://hub.blockstack.org') {
        // see https://forum.blockstack.org/t/creating-a-usersession-using-app-private-key/8096/4

        const appConfig = new blockstack.AppConfig(
            scopes,
            appUrl
        )


        const userData: UserData = {
            username: username,
            decentralizedID: 'did:btc-addr:' + appPublicKey,
            appPrivateKey: appPrivateKey,
            authResponseToken: '',
            hubUrl: hubUrl,
            identityAddress: appPublicKey,
            profile: profileJSON,
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

    makeProfileJSON(profile: any, keypair: any, api: any) {
        let profileJSON = signProfileForUpload(profile, keypair, api);
        return profileJSON;
    }

    async saveProfileJSON(userSession: any, profileJSON: any) {
        let resp = await userSession.putFile('profile.json', JSON.stringify(profileJSON), { encrypt: false, contentType: 'application/json' })
        return resp;
    }

    configureRadiks(userSession: any) {
        configure({
          apiServer: `${GOODTIMES_RADIKS_SERVER}`,  //'https://blockusign-radiks.azurewebsites.net', // 'http://localhost:1260'
          userSession: userSession
        });   
    }


    rando(){
        return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
    }

    
    render() {
        return (
            <ScrollView>
                <Text>Username</Text>
                <Text>{this.state.username}</Text>
                <Text />
                <Text />

                <Text>Public Key</Text>
                <Text>{this.state.publicKey}</Text>
                <Text />
                <Text />

                <Text>Private Key</Text>
                <Text>{this.state.privateKey}</Text>
                <Text />
                <Text />

                <Text>Backup Phrase</Text>
                <Text>{this.state.backupPhrase}</Text>
                <Text />
                <Text />

                <Text>User Session</Text>
                <Text>{JSON.stringify(this.state.userSession) || ''}</Text>
                <Text />
                <Text />

                {  this.state.userSession
                   ? <Radiks userSession={this.state.userSession}/>
                   : <Text/>
                }
                

            </ScrollView>
        )
    }
}
