import React, { Component } from "react";
import { Platform, FlatList } from "react-native";
import { StyleSheet, Button, Text, View, Linking } from "react-native";
import { DeviceEventEmitter } from "react-native";
// @ts-ignore
import RNBlockstackSdk from "react-native-blockstack";
const textFileName = "message.txt";
// @ts-ignore
import { configure, User } from './../../radiks/lib/index.js';
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import Message from './../../models/Message';
import { List, ListItem, Left, Right, Icon, Container, Content } from 'native-base';
import HeaderComponent from "../Header";


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
      apiServer: 'http://localhost:5000',  //'https://blockusign-radiks.azurewebsites.net', // 'http://localhost:1260'
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
    var ws = new WebSocket('ws://localhost:5000/radiks/stream');
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
