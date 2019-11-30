import React, { Component } from "react";
import { Platform, FlatList } from "react-native";
import { StyleSheet, Button, Text, View, Linking } from "react-native";
import { DeviceEventEmitter } from "react-native";
// @ts-ignore
import RNBlockstackSdk from "react-native-blockstack";
const textFileName = "message.txt";
// @ts-ignore
import { configure, User } from './../../radiks/src/index';
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import Message from './../../models/Message';
import { List, ListItem, Left, Right, Icon, Container, Content } from 'native-base';
import HeaderComponent from "../Header";
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
// @ts-ignore
import * as bitcoin from 'react-native-bitcoinjs-lib';
import * as blockstack from 'blockstack';
import { InstanceDataStore } from 'blockstack/lib/auth/sessionStore';
import { UserData } from 'blockstack/lib/auth/authApp';
import * as bip39 from 'bip39';
// @ts-ignore
import * as bip32utils from 'bip32-utils';
declare let window: any;


import {
  getBlockchainIdentities
  // @ts-ignore
} from '@utils'; // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
import { randomBytes } from 'crypto'




interface State {
  loaded: any,
  userData: any,
  fileContents: any,
  fileUrl: any,
  encryptionStatus: any,
  usession: any,
  radiksMessages: any[],
  nextId: number
}

interface Props {
  authResponse: any;
};
export default class Blockstack extends Component<Props, State> {

  signInText: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      loaded: false,
      userData: null,
      fileContents: null,
      fileUrl: null,
      encryptionStatus: "",
      usession: null,
      radiksMessages: [{ key: "one" }],
      nextId: 0
    };
  }

  componentDidMount() {
    this.createAccount();
    console.log("didMount");
    console.log("props" + JSON.stringify(this.props));
    this.createSession();
    this.setupWebSocket();
    var app = this;
    var pendingAuth = false;
    DeviceEventEmitter.addListener("url", (e: any) => {
      console.log("deep link " + pendingAuth);
      if (e.url && !pendingAuth) {
        pendingAuth = true;
        var query = e.url.split(":");
        if (query.length > 1) {
          var parts = query[1].split("=");
          if (parts.length > 1) {
            console.log("deep link " + parts[1]);
            RNBlockstackSdk.handlePendingSignIn(parts[1]).then(
              (result: any) => {
                console.log("handleAuthResponse " + JSON.stringify(result));
                app.setState({
                  userData: { decentralizedID: result["decentralizedID"] },
                  loaded: result["loaded"]
                });
                pendingAuth = false;

                // TODO maybe await here per docs - https://github.com/blockstack-radiks/radiks
                User.createWithCurrentUser();


              },
              (error: any) => {
                console.log("handleAuthResponse " + JSON.stringify(error));
                pendingAuth = false;
              }
            );
          }
        }
      }
    });




  }

  // https://github.com/bitcoinjs/bip32-utils
  // https://github.com/bitcoinjs/bitcoinjs-lib/issues/997
  // https://github.com/bitcoinjs/bitcoinjs-lib/issues/997
  // https://github.com/blockstack/blockstack-browser/blob/8103c82f5b4ae24c8b1f4e52385326c0a5a60ce8/app/js/profiles/store/registration/actions.js
  // https://github.com/blockstack/blockstack-browser/blob/5f7fa28672abfd53ee454ff96283072a499ab869/app/js/account/CreateAccountPage.js
  async createAccount(){
    window.bs = RNBlockstackSdk;
    window.bitcoin = bitcoin;
    window.blockstack = blockstack;
    window.bip39 = bip39;
    window.bip32utils = bip32utils;
    console.log('bitcoin', bitcoin);
    
    //1) init wallet
    let masterKeychain = null
    const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
    let backupPhrase = bip39.generateMnemonic(STRENGTH, randomBytes)
    console.log(backupPhrase);
    const seedBuffer = await bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = await bitcoin.HDNode.fromSeedBuffer(seedBuffer)
    // const ciphertextBuffer = await encrypt(new Buffer(backupPhrase), 'password');
    // const encryptedBackupPhrase = ciphertextBuffer.toString('hex')
   
    let identitiesToGenerate = 2;
    
    //2) create account
    const {
      identityPublicKeychain,
      bitcoinPublicKeychain,
      firstBitcoinAddress,
      identityAddresses,
      identityKeypairs
    } = getBlockchainIdentities(masterKeychain, identitiesToGenerate)

 

    //3) get jwt by creating user session
    console.log(backupPhrase);
    console.log(identityKeypairs);
    let appPublicKey = identityKeypairs[1].address;
    let appPrivateKey = identityKeypairs[1].key;
    const appConfig = new blockstack.AppConfig(
      ['store_write', 'publish_data'], 
      'goodtimesx.com' 
    )
    const userData: UserData = {
      username: '',
      decentralizedID: '',
      appPrivateKey: appPrivateKey,
      authResponseToken: '',
      hubUrl: 'https://hub.blockstack.org',
      identityAddress: appPublicKey,
      profile: null,
    }
    const dataStore = new InstanceDataStore({ 
        appPrivateKey: appPrivateKey, 
        hubUrl: 'https://hub.blockstack.org',
        userData: userData
    });
    const userSession = new blockstack.UserSession({
      appConfig: appConfig,
      sessionStore: dataStore
    });
    window.userSession = userSession;

    // 4) put file
    userSession.putFile('goodtimes.json', '{"blockstack":"rocks"}');
  
    //5) registerSubdomain - do this later on when the user chooses a name
    // this.registerSubdomain('good' + this.rando(), 0,  identityAddresses[0], null);
    // if sucess and 202
    // 
   

  }

  putFileTest(pubKey:string,jwt: string,fileName:string, content: any) {
    fetch(`https://hub.blockstack.org/store/${pubKey}/${fileName}`, {
        method: 'POST',
        "headers":{
          "authorization":`bearer ${jwt}`,
          "content-type":"application/json"
        },
        "body": JSON.stringify(content)
      })
  }


  async registerSubdomain(
    domainName:any,
    identityIndex:any,
    ownerAddress:any,
    zoneFile:any
  ) {
    let nameSuffix = null
  
    nameSuffix = '.id.blockstack'
  
    console.log(`registerName: ${domainName} is a subdomain of ${nameSuffix}`)
  
    const registerUrl = 'https://registrar.blockstack.org/register';
  
    const registrationRequestBody = JSON.stringify({
      "zonefile": `$ORIGIN ${domainName + nameSuffix}\n$TTL 3600\n_https._tcp URI 10 1 \"https://gaia.blockstack.org/hub/${ownerAddress}/profile.json\"\n`,
      "name": `${domainName}`,
      "owner_address": `${ownerAddress}`
    })
  
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `bearer PretendPasswordAPI`
    }
  
    console.log(`Submitting registration for ${domainName} to ${registerUrl}`)
  
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: registrationRequestBody
    })
  
    if (!response.ok) {
      console.log(
        `Subdomain registrar responded with status code ${response.status}`
      )
  
      return Promise.reject({
        error: 'Failed to register username',
        status: response.status
      })
    }
  
    const responseText = await response.text()
  
    return JSON.parse(responseText)
  }
  

  async createAccount2(){
    window.bitcoin = bitcoin;
    window.bs = RNBlockstackSdk;
    window.blockstack = blockstack;
    window.bip39 = bip39;
    window.bip32utils = bip32utils;
    console.log('bitcoin', bitcoin);

    // backup this mnemonic locally in secure storage so the user can recover his account
    let mnemonic = bip39.generateMnemonic();
    console.log(mnemonic);
    
    let seedHex = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
    console.log(seedHex);
    let masterNode = bitcoin.HDNode.fromSeedHex(seedHex)

    // use this pub/pri keypair for the goodtimes gaia bucket
    // skip for the 0/0 first keypair, since its reserved for the blockstack browser

    let key0 = masterNode.derivePath("0/0").keyPair.toWIF();
    let address0 = masterNode.derivePath("0/0").keyPair.getAddress();

    let key1 = masterNode.derivePath("0/1").keyPair.toWIF();
    let address1 = masterNode.derivePath("0/1").keyPair.getAddress();

    let username = 'good_' +  this.rando();


    // 1) check that name does not exist
    // https://registrar.blockstack.org/v1/names/good_23412.id.blockstack
    // fetch("https://registrar.blockstack.org/v1/names/good_23412.id.blockstack", {"credentials":"omit","headers":{"sec-fetch-mode":"cors"},"referrer":"https://browser.blockstack.org/sign-up?redirect=%2F","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});

    // 2) create profile
    // fetch("https://hub.blockstack.org/store/1HuzntVntyz2MKXbWXHQkwip66udNuvNaE/profile.json", {"credentials":"include","headers":{"authorization":"bearer v1:eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJnYWlhQ2hhbGxlbmdlIjoiW1wiZ2FpYWh1YlwiLFwiMFwiLFwic3RvcmFnZTIuYmxvY2tzdGFjay5vcmdcIixcImJsb2Nrc3RhY2tfc3RvcmFnZV9wbGVhc2Vfc2lnblwiXSIsImh1YlVybCI6Imh0dHBzOi8vaHViLmJsb2Nrc3RhY2sub3JnIiwiaXNzIjoiMDJjNjI2YmIxMjY1MTc3MDk0YmM3MzUyYjg2NTcxOGIzODU5NzkzZGUzNjZhMGJlOTQ4OGY3ZDNjMjJjMWJmNmUxIiwic2FsdCI6ImJkNDgyNTBmMWZiYzc0ZDAyZTNhZjA4ZTI2ZTEyZmFlIn0.BlPIcgs606TIwoWdJENAsFev9w1nRz7Hj1LhjW_P_tduVBIDFa-kRSZc5JmUmq9eBhVqOjuAj7PEaaPL9XXj3A","content-type":"application/json","sec-fetch-mode":"cors"},"referrer":"https://browser.blockstack.org/sign-up?redirect=%2F","referrerPolicy":"no-referrer-when-downgrade","body":"[\n  {\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiJiNWJlYTA1ZC0zNGNmLTQwMzQtOWI1ZC02YWFjNGQzNDMyMmMiLCJpYXQiOiIyMDE5LTA5LTAzVDE2OjA2OjE4LjQxMloiLCJleHAiOiIyMDIwLTA5LTAzVDE2OjA2OjE4LjQxMloiLCJzdWJqZWN0Ijp7InB1YmxpY0tleSI6IjAyYzYyNmJiMTI2NTE3NzA5NGJjNzM1MmI4NjU3MThiMzg1OTc5M2RlMzY2YTBiZTk0ODhmN2QzYzIyYzFiZjZlMSJ9LCJpc3N1ZXIiOnsicHVibGljS2V5IjoiMDJjNjI2YmIxMjY1MTc3MDk0YmM3MzUyYjg2NTcxOGIzODU5NzkzZGUzNjZhMGJlOTQ4OGY3ZDNjMjJjMWJmNmUxIn0sImNsYWltIjp7IkB0eXBlIjoiUGVyc29uIiwiQGNvbnRleHQiOiJodHRwOi8vc2NoZW1hLm9yZyIsImFwaSI6eyJnYWlhSHViQ29uZmlnIjp7InVybF9wcmVmaXgiOiJodHRwczovL2dhaWEuYmxvY2tzdGFjay5vcmcvaHViLyJ9LCJnYWlhSHViVXJsIjoiaHR0cHM6Ly9odWIuYmxvY2tzdGFjay5vcmcifX19.ZODsEEytugVO8RGJpf5Sb3viht2mBU_Ub2wg2CM4szVJZpT2sm2CTQW1CUEk0uN5-n7wxMnKrrYp_1DQkx2YHQ\",\n    \"decodedToken\": {\n      \"header\": {\n        \"typ\": \"JWT\",\n        \"alg\": \"ES256K\"\n      },\n      \"payload\": {\n        \"jti\": \"b5bea05d-34cf-4034-9b5d-6aac4d34322c\",\n        \"iat\": \"2019-09-03T16:06:18.412Z\",\n        \"exp\": \"2020-09-03T16:06:18.412Z\",\n        \"subject\": {\n          \"publicKey\": \"02c626bb1265177094bc7352b865718b3859793de366a0be9488f7d3c22c1bf6e1\"\n        },\n        \"issuer\": {\n          \"publicKey\": \"02c626bb1265177094bc7352b865718b3859793de366a0be9488f7d3c22c1bf6e1\"\n        },\n        \"claim\": {\n          \"@type\": \"Person\",\n          \"@context\": \"http://schema.org\",\n          \"api\": {\n            \"gaiaHubConfig\": {\n              \"url_prefix\": \"https://gaia.blockstack.org/hub/\"\n            },\n            \"gaiaHubUrl\": \"https://hub.blockstack.org\"\n          }\n        }\n      },\n      \"signature\": \"ZODsEEytugVO8RGJpf5Sb3viht2mBU_Ub2wg2CM4szVJZpT2sm2CTQW1CUEk0uN5-n7wxMnKrrYp_1DQkx2YHQ\"\n    }\n  }\n]","method":"POST","mode":"cors"});


    //3) now create a subdomain name registrations and get a gaia bucket
    try{
      let resp = await fetch('https://registrar.blockstack.org/register', {
        method: 'post',
        headers:{
          'Authorization': 'bearer PretendPasswordAPI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "zonefile": `$ORIGIN ${username}\n$TTL 3600\n_https._tcp URI 10 1 \"https://gaia.blockstack.org/hub/profile.json\"\n`,
          "name": `${username}`,
          "owner_address": `${address0}`
        })
      });
      console.log('success subdomina', resp);
    } catch (e){
      console.log('error creating subdomain', e)
    }
    

    // now create an auth token for the app


  }

  rando(){
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
  }

  render() {
    if (this.state.userData) {
      this.signInText = "Signed in as " + this.state.userData.decentralizedID;
    } else {
      this.signInText = "Not signed in";
    }

    return (

      <Container>
        <HeaderComponent />

        <Content>
          <Text style={styles.welcome}>Blockstack React Native Example</Text>

          <Button
            title="Create Session"
            onPress={() => this.createSession()}
          />
          <Text>jwt</Text>


          <Button
            title="Sign In with Blockstack"
            onPress={() => this.signIn()}
            disabled={!this.state.loaded || this.state.userData != null}
          />
          <Text>{this.signInText}</Text>

          <Button
            title="Sign out"
            onPress={() => this.signOut()}
            disabled={!this.state.loaded || this.state.userData == null}
          />
          <Text>------------</Text>

          <Button
            title="Put file"
            onPress={() => this.putFile()}
            disabled={!this.state.loaded || this.state.userData == null}
          />
          <Text>{this.state.fileUrl}</Text>

          <Button
            title="Get file"
            onPress={() => this.getFile()}
            disabled={!this.state.loaded || this.state.userData == null}
          />
          <Text>{this.state.fileContents}</Text>

          <Button
            title="Radiks Put file"
            onPress={() => this.radiksPutMessage()}
          />
          {/* <List
    dataArray={this.state.radiksMessages}
    renderRow={(item, index) => {                
        return (
            <ListItem key={item.key}>
                <Left>
                    <Text>{item.content}</Text>
                </Left>
                <Right>
                    <Icon name="arrow-forward" />
                </Right>
            </ListItem>
        )
    }}
>        </List>*/}
          <FlatList
            data={this.state.radiksMessages}
            renderItem={({ item }) => <Text>{item.key}</Text>}
          />

          {// Implementation of encryptContent, decryptContent available only in the android native module as of now.
            Platform.OS === "android" && (
              <View>
                <Button
                  title="Encrypt-Decrypt"
                  onPress={() => this.encryptDecrypt()}
                  disabled={!this.state.loaded || this.state.userData == null}
                />
                <Text>Encryption status: {this.state.encryptionStatus}</Text>
              </View>
            )}
        </Content>

      </Container>


    );
  }

  async createSession() {
    let result;
    let config = {
      appDomain: "https://flamboyant-darwin-d11c17.netlify.com",
      scopes: ["store_write", "publish_data"],
      redirectUrl: "/redirect.html"
    };
    console.log("blockstack:" + RNBlockstackSdk);
    let hasSession = await RNBlockstackSdk.hasSession();
    if (!hasSession["hasSession"]) {
      result = await RNBlockstackSdk.createSession(config);
      console.log("created " + result["loaded"]);
    } else {
      console.log("reusing session");
    }

    if (this.props.authResponse) {
      let result = await RNBlockstackSdk.handleAuthResponse(
        this.props.authResponse
      );
      console.log("userData " + JSON.stringify(result));
      this.setState({
        userData: { decentralizedID: result["decentralizedID"] },
        loaded: result["loaded"]
      });
    } else {
      let signedIn = await RNBlockstackSdk.isUserSignedIn();

      if (signedIn["signedIn"]) {
        console.log("user is signed in");
        let userData = await RNBlockstackSdk.loadUserData();
        console.log("userData " + JSON.stringify(userData));
        this.setState({
          userData: { decentralizedID: userData["decentralizedID"] },
          loaded: result["loaded"]
        });

        let d = await SecureStorage.getItem('GROUP_MEMBERSHIPS_STORAGE_KEY');
        console.log("GROUP_MEMBERSHIPS_STORAGE_KEY", d)

      
        this.configInitialAppSession(userData);
        this.configureRadiks();
        await User.createWithCurrentUser();
        console.log('after radiks createWithCurrentUser')



      } else {
        this.setState({ loaded: result["loaded"] });
      }
    }
  }

  async signIn() {
    console.log("signIn");
    console.log("current state: " + JSON.stringify(this.state));
    let result = await RNBlockstackSdk.signIn();

    console.log("result: " + JSON.stringify(result));
    this.setState({ userData: { decentralizedID: result["decentralizedID"] } });
  }

  async signOut() {
    let result = await RNBlockstackSdk.signUserOut();

    console.log(JSON.stringify(result));
    if (result["signedOut"]) {
      this.setState({ userData: null });
    }
  }

  async putFile() {
    this.setState({ fileUrl: "uploading..." });
    let content = "Hello React Native";
    let options = { encrypt: true };
    let result = await RNBlockstackSdk.putFile(textFileName, content, options);
    console.log(JSON.stringify(result));
    this.setState({ fileUrl: result["fileUrl"] });
  }

  async encryptDecrypt() {
    let content = "Blockstack is awesome!";

    // using app public, private keys
    let cipherText = await RNBlockstackSdk.encryptContent(content, {});
    console.log("ciphertext:", cipherText);
    let plainText = await RNBlockstackSdk.decryptContent(
      JSON.stringify(cipherText),
      false,
      {}
    );
    console.log("plaintext:", plainText);

    // using provided keys
    let ecPrivateKey =
      "a5c61c6ca7b3e7e55edee68566aeab22e4da26baa285c7bd10e8d2218aa3b229";
    let ecPublicKey =
      "027d28f9951ce46538951e3697c62588a87f1f1f295de4a14fdd4c780fc52cfe69";
    cipherText = await RNBlockstackSdk.encryptContent(content, {
      publicKey: ecPublicKey
    });
    console.log("ciphertext:", cipherText);
    plainText = await RNBlockstackSdk.decryptContent(
      JSON.stringify(cipherText),
      false,
      { privateKey: ecPrivateKey }
    );
    console.log("plaintext:", plainText);

    if (content == plainText) this.setState({ encryptionStatus: "SUCCESS" });
  }

  async getFile() {
    this.setState({ fileContents: "downloading..." });
    let options = { decrypt: true };
    let result = await RNBlockstackSdk.getFile(textFileName, options);
    console.log(JSON.stringify(result));
    this.setState({ fileContents: result["fileContents"] });
  }


  configureRadiks() {

    configure({
      apiServer: `${GOODTIMES_RADIKS_SERVER}`,  //'https://blockusign-radiks.azurewebsites.net', // 'http://localhost:1260'
      userSession: this.state.usession
    });
    console.log('configure radiks', RNBlockstackSdk);
  }

  configInitialAppSession(userData: any) {

    let sesh = {
      "appConfig": {
        "appDomain": "https://flamboyant-darwin-d11c17.netlify.com",
        "scopes": ["store_write", "publish_data"],
        "redirectPath": "",
        "manifestPath": "https://flamboyant-darwin-d11c17.netlify.com/manifest.json",
        "coreNode": "https://core.blockstack.org",
        "authenticatorURL": "https://browser.blockstack.org/auth"
      },
      "store": { "key": "blockstack-session" }
    }


    console.log('RNBlockstackSdk', RNBlockstackSdk);
    // @ts-ignore
    sesh.loadUserData = () => { return userData }
    // @ts-ignore
    sesh.createSession = RNBlockstackSdk.createSession;
    // @ts-ignore
    sesh.putFile = RNBlockstackSdk.putFile;
    // @ts-ignore
    sesh.decryptContent = RNBlockstackSdk.decryptContent;
    // @ts-ignore
    sesh.encryptContent = RNBlockstackSdk.encryptContent;
    // @ts-ignore
    sesh.getConstants = RNBlockstackSdk.getConstants;
    // @ts-ignore
    sesh.getFile = RNBlockstackSdk.getFile;
    // @ts-ignore
    sesh.handlePendingSignIn = RNBlockstackSdk.handlePendingSignIn;
    // @ts-ignore
    sesh.hasSession = RNBlockstackSdk.hasSession;
    // @ts-ignore
    sesh.isUserSignedIn = RNBlockstackSdk.isUserSignedIn;
    // @ts-ignore
    sesh.signIn = RNBlockstackSdk.signIn;
    // @ts-ignore
    sesh.signUserOut = RNBlockstackSdk.signUserOut;

    this.setState({
      usession: sesh
    });
  }


  async radiksPutMessage() {

    // @ts-ignore
    let message = new Message({
      content: 'onemsg',
      _id: this.uuid(),
      createdBy: 'nicktee.id',
      votes: []
    });
    let resp = await message.save();
    console.log('radiks resp', resp);
    // @ts-ignore
    let mz = await Message.findById(resp._id);
    console.log('msgzzz', mz);


    this.setState({
      radiksMessages: mz
    })
  }

  setupWebSocket() {


    console.log('setting up websocket....');

    // @ts-ignore
    var ws = new WebSocket(`${GOODTIMES_RADIKS_WEBSOCKET}/radiks/stream`);
    ws.onopen = () => {
      // connection opened
      ws.send('something'); // send a message
    };

    ws.onmessage = (e: any) => {
      // a message was received
      console.log(e.data);
      let msg = 'nada';
      try {
        let data = JSON.parse(e.data);
        let modelType = data.radiksType;
        switch (modelType) {
          case "Message":
            if (!data.content) return;
            msg = data.content;
            this.setState({
              nextId: (this.state.nextId + 1)
            })
            this.setState({
              radiksMessages: [...this.state.radiksMessages, { key: msg }]
            })
          case "Vote":
            if (!data.username) return;
            msg = "+1 " + data.username;
            this.setState({
              nextId: (this.state.nextId + 1)
            })
            this.setState({
              radiksMessages: [...this.state.radiksMessages, { key: msg }]
            })
          default:
            return;
        }


      } catch (e) { }

    };

    ws.onerror = (e: any) => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = (e: any) => {
      // connection closed
      console.log(e.code, e.reason);
    };

  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
