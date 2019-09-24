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
// @ts-ignore
import { configure } from './../radiks/src/index';
import * as bitcoinjs from 'bitcoinjs-lib';

export const initWallet = async () => {

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

export function makeUserSession(appPrivateKey: string, appPublicKey: string, username: string, profileJSON: any = null, scopes: Array<string> = ['store_write', 'publish_data'], appUrl: string = 'goodtimesx.com', hubUrl: string = 'https://hub.blockstack.org') {
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

export function makeProfileJSON(profile: any, keypair: any, api: any) {
    let profileJSON = signProfileForUpload(profile, keypair, api);
    return profileJSON;
}

export const saveProfileJSON = async (userSession: any, profileJSON: any) => {
    let resp = await userSession.putFile('profile.json', JSON.stringify(profileJSON), { encrypt: false, contentType: 'application/json' })
    return resp;
}

export function configureRadiks(userSession: any) {
    configure({
        apiServer: `https://${GOODTIMES_RADIKS_SERVER}`,  //'https://blockusign-radiks.azurewebsites.net', // 'http://localhost:1260'
        userSession: userSession
    });
}


export function rando() {
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}

export const createBlockchainIdentity = async (
    keychain: any, 
    username:string =  "good" + rando() + '.id.blockstack',  
    avatarUrl: string = 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0',  
    identitiesToGenerate: number = 2
) => {

    const { identityKeypairs } = getBlockchainIdentities(keychain.masterKeychain, identitiesToGenerate)
    // use identity 0 for blockstack browser and profile
    let browserPublicKey = identityKeypairs[0].address;
    let browserPrivateKey = identityKeypairs[0].key;
    let browserKeyID = identityKeypairs[0].keyID;
    let profile = makeNewProfile(browserPrivateKey, browserPublicKey, avatarUrl, username);
    let userSession = makeUserSession(browserPrivateKey, browserPublicKey, username, profile.decodedToken.payload.claim);
    let profileResp = saveProfileJSON(userSession, [profile]);
    // use identity 1 for this first app keypair
    let appPublicKey = identityKeypairs[1].address;
    let appPrivateKey = identityKeypairs[1].key;

    return {
        appPublicKey: appPublicKey,
        appPrivateKey: appPrivateKey,
        identityKeypairs: identityKeypairs,
        profileJSON: profile,
        username: username,
        profileResp: profileResp
    }
}


export function getPublicKeyFromPrivate(privateKey: string) {
    const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
    return keyPair.publicKey.toString('hex')
}

export function makeNewProfile(privateKey: string, publicKey: string, avatarUrl: string, username: string){
    let api = {
        gaiaHubConfig: {
            url_prefix: 'https://gaia.blockstack.org/hub/'
        },
        gaiaHubUrl: 'https://hub.blockstack.org'
    }
    let profileJSON = makeProfileJSON(DEFAULT_PROFILE, { key: privateKey, keyID: publicKey}, api);
    let profile = (JSON.parse(profileJSON))[0];
    profile.decodedToken.payload.claim.image = [{
        '@type': 'ImageObject',
        'contentUrl': avatarUrl,
        'name': 'avatar'    
    }]
    return profile;                              
}