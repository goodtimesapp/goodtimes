import React, { Component } from 'react'
import { ScrollView } from 'react-native';
import { Button, Text, Input, Content, Item, Container } from 'native-base';
import { rando, makeUserSession, makeProfileJSON , getPublicKeyFromPrivate, makeNewProfile} from '../../utils/profile';
// @ts-ignore
import RNBlockstackSdk from "react-native-blockstack";
import { DeviceEventEmitter } from "react-native";
import { UserSession } from 'blockstack';
// @ts-ignore
import { getBlockchainIdentities, signProfileForUpload, DEFAULT_PROFILE } from '@utils'; 
import {RadiksPage} from './Index';


interface Props {
    userSession: any;
    getProfileState: any;
    getUserName: any;
    createAccountSilently: (userChosenName: string, avatar: string) => void;
    logout: () => void;
    silentLogin: () => void;
}

interface State {
    username: string,
    avatar: string
}


export default class Profile extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            username: 'good' + rando() + '.id.blockstack',
            avatar: 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0'
        }
    }
    
  

    async loginWithBlockstack(){
        var app = this;
        var pendingAuth = false;
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
        DeviceEventEmitter.addListener("url", (e: any) => {
            if (e.url && !pendingAuth) {
                pendingAuth = true;
                var query = e.url.split(":");
                if (query.length > 1) {
                    var parts = query[1].split("=");
                    if (parts.length > 1) {
                        console.log("deep link " + parts[1]);
                        RNBlockstackSdk.handlePendingSignIn(parts[1]).then(
                            (profileResp: any) => {
                               
                                let publicKey = getPublicKeyFromPrivate(profileResp.appPrivateKey);
                                let privateKey = profileResp.appPrivateKey;
                                let username = profileResp.username;
                                
                                let profile = makeNewProfile(privateKey, publicKey, profileResp.profile.image[0].contentUrl, username)
                                let userSession = makeUserSession(privateKey, publicKey, username, profile.decodedToken.payload.claim);

                                let profileState =  {
                                    userSession: userSession,
                                    error: '',
                                    publicKey: publicKey,
                                    privateKey: privateKey,
                                    backupPhrase: '',
                                    username: username,
                                    profileJSON: profile
                                } 
                                // @ts-ignore
                                this.props.silentLogin(profileState);
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
        // now sign in
        let signInResult = await RNBlockstackSdk.signIn();
    }


    render() {
        return (
            <ScrollView style={{ padding: 10 }}>
                <Button bordered rounded success onPress={() => this.loginWithBlockstack() }>
                    <Text>Login with Blockstack</Text>
                </Button>


                <Text />
                <Text>
                {
                    this.props.getUserName || 'not logged in'
                }
                 </Text>
                <Text />

                <Content style={{ backgroundColor: '#78909C', height: 1 }} />

                <Text />
                <Text />
                <Text>Or Continue as guest</Text>
                <Text />
                <Text />

                <Content>
                    <Item rounded>
                        <Input placeholder='Choose username' value={this.props.getUserName || this.state.username} />
                    </Item>
                </Content>
                <Text />

                <Content>
                    <Item rounded>
                        <Input placeholder='Choose Profile picture' value={this.state.avatar} />
                    </Item>
                </Content>
                <Text />
                <Button bordered rounded success onPress={() => this.props.createAccountSilently(this.state.username, this.state.avatar)}>
                    <Text>Next =></Text>
                </Button>


                <Text />
                <Text />
                <Content style={{ backgroundColor: '#78909C', height: 1 }} />
                <Text />
                <Text />

                <Button bordered rounded onPress={() => this.props.logout()}>
                    <Text>Logout</Text>
                </Button>

                <Text />
                <Text />
                <Content style={{ backgroundColor: '#78909C', height: 1 }} />
                <Text />
                <Text />

                <Text>Profile</Text>
                <Text />
                <Text>User Session</Text>
                <Text>{JSON.stringify(this.props.userSession)}</Text>
                <Text />
                <Text>Profile State</Text>
                <Text>{JSON.stringify(this.props.getProfileState)}</Text>

                <Text />
                <Text />

                <Text>Radiks Test</Text>
                <Text/>
                <Text/>
                <RadiksPage />
                <Text/>
                <Text/> 
            </ScrollView>
        )
    }
}

