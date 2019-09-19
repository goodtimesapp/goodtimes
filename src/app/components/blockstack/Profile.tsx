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
// @ts-ignore
import { configure, User, UserGroup, GroupInvitation, Model } from './../../radiks/src/index';
import Message from './../../models/Message';
import EncryptedMessage from './../../models/EncryptedMessage';
import AsyncStorage from '@react-native-community/async-storage';
declare let window: any;
window.radiks = require('./../../radiks/src/index');


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
            userSession: {},
            username: '',
            text: '',
            value: ''
        }
    }

    async componentDidMount() {
        await this.silentLogin();
        // this.radiksGetMessage();
        // this.radiksPutMessage();
        // let group: any = await this.createRadiksGroup('Starbucks');
        // await AsyncStorage.setItem( group.attrs.name, group._id );
        // this.viewMyGroups();
        // setTimeout( () =>{
        //     this.radiksPutEncryptedMessage('one');
        // }, 2000 )
        //good66619.id.blockstack
        // https://hub.blockstack.org/store/1RRBjbgXSWAs8pW4mC8VfkGL3EdcDG3TK/GroupInvitation/769d006a85bc-4bee-aaa1-e78d3f726a70
        
    }

    async silentLogin() {

        let keychain = await this.initWallet();
        let id = await this.createBlockchainIdentity(keychain);
        let username = await SecureStorage.getItem('username');
        let userSession = this.makeUserSession(id.appPrivateKey, id.appPublicKey, username, id.profileJSON.decodedToken.payload.claim);
        window.userSession = userSession;
        this.configureRadiks(userSession);
        await User.createWithCurrentUser();
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
        let isNewAccount = false;
        const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
        // save seed phrase to SecureStorage on the device, allow the user to backup 
        let backupPhraseCache = await SecureStorage.getItem('backupPhrase');
        let backupPhrase;
        if (backupPhraseCache) {
            backupPhrase = backupPhraseCache
        } else {
            isNewAccount = true;
            backupPhrase = bip39.generateMnemonic(STRENGTH, randomBytes)
            await SecureStorage.setItem('backupPhrase', backupPhrase);
        }
        console.log(backupPhrase);
        const seedBuffer = await bip39.mnemonicToSeed(backupPhrase)
        masterKeychain = await bitcoin.HDNode.fromSeedBuffer(seedBuffer)
        let keychain = {
            backupPhrase: backupPhrase,
            masterKeychain: masterKeychain,
            isNewAccount: isNewAccount
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
   
        if (keychain.isNewAccount) { // make profileJSON
            let username = "good" + this.rando() + '.id.blockstack';
            await SecureStorage.setItem('username', username);
            let userSession = this.makeUserSession(browserPrivateKey, browserPublicKey, username, (JSON.parse(profileJSON))[0].decodedToken.payload.claim);
            let profileResp = this.saveProfileJSON(userSession, JSON.parse(profileJSON));
        }

        // use identity 1 for this first app keypair
        let appPublicKey = identityKeypairs[1].address;
        let appPrivateKey = identityKeypairs[1].key;

        return {
            appPublicKey: appPublicKey,
            appPrivateKey: appPrivateKey,
            identityKeypairs: identityKeypairs,
            profileJSON: JSON.parse(profileJSON)[0],
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
          apiServer: `https://${GOODTIMES_RADIKS_SERVER}`,  //'https://blockusign-radiks.azurewebsites.net', // 'http://localhost:1260'
          userSession: userSession
        });   
    }

    async radiksPutMessage(text: string) {
        // @ts-ignore
        let message = new Message({
          content: text || this.rando().toString(),
          _id: this.uuid(),
          createdBy: this.state.username,
          votes: []
        });
        let resp = await message.save();
        console.log('radiks resp', resp);
    }

    async radiksPutEncryptedMessage(text: string) {
        // @ts-ignore
        let m = new EncryptedMessage({
            content: 'from samsung',
            _id: this.uuid(),
            createdBy: this.state.username,
            votes: [], 
            category: 'phone',
            userGroupId: '769d006a85bc-4bee-aaa1-e78d3f726a70'
          });
        let resp = await m.save();
        console.log('radiks resp encrypted msg', resp);
        // other user on samsung good66619.id.blockstack
    }

    

    // https://github.com/ntheile/sheety-app/blob/1ff058fb602f2c62cf50dcd110160c7661b6ccdb/ClientApp/src/app/group/group.component.ts
    async radiksGetMessage() {
        // @ts-ignore
        let messages = await Message.fetchList({  });
        console.log('get messages ', messages);
    }

    async createRadiksGroup(groupName: string){
        const group: UserGroup = new UserGroup({ name: groupName });
        let groupResp = null;
        try{
            groupResp =  await group.create();
        } catch(e) {

        }
        console.log('groupResp', groupResp);
        await AsyncStorage.setItem('group', JSON.stringify(groupResp));
        return groupResp;
    }

    async inviteMember(groupId: string, userToInvite: string){
        let group: UserGroup = await UserGroup.findById(groupId) as UserGroup;
        const usernameToInvite = userToInvite;
        const invitation = await group.makeGroupMembership(usernameToInvite);
        console.log('invitation._id', invitation._id); // the ID used to later activate an invitation
    }

    async acceptInvitation(myInvitationID: string){
        const invitation: GroupInvitation  = await GroupInvitation.findById(myInvitationID) as GroupInvitation;
        await invitation.activate();
        console.log('Accepted Invitation');
    }

    async viewMyGroups(){
        const groups = await UserGroup.myGroups();
        console.log('My groups', groups);
    }



    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
    
    
    rando(){
        return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
    }

    onTextChange(text:any){
        this.setState({
            text: text
        })
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

                <Text>Put Message</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={ text => this.onTextChange(text) }
                    />
                <Button title="Submit" onPress={ ()=> this.radiksPutMessage(this.state.text) } ></Button>

            </ScrollView>
        )
    }
}
