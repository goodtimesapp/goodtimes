import React, { Component } from 'react'
import { ScrollView } from 'react-native';
import { Button, Text, Input, Content, Item, Container, Accordion } from 'native-base';
import { rando, makeUserSession, makeProfileJSON , getPublicKeyFromPrivate, makeNewProfile} from '../../utils/profile';
// @ts-ignore
import RNBlockstackSdk from "react-native-blockstack";
import { DeviceEventEmitter } from "react-native";
import { UserSession } from 'blockstack';
// @ts-ignore
import { getBlockchainIdentities, signProfileForUpload, DEFAULT_PROFILE } from '@utils'; 
import {RadiksPage} from './Index';
import { withNavigation } from 'react-navigation';
import {Splash} from './../Splash';


interface Props {
    userSession: any;
    getProfileState: any;
    getUserName: any;
    createAccountSilently: (userChosenName: string, avatar: string) => void;
    logout: () => void;
    silentLogin: () => void;
    navigation: any,
    checkIfUserHasSeenIntro: () => Promise<any>;
}

interface State {
    username: string,
    avatar: string,
    profileData: any
}


class LoginSplash extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
 
        this.state = {
            username: 'good' + rando() + '.id.blockstack',
            avatar: 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0',
            profileData: [{
                title: "UserData",
                content: JSON.stringify(this.props.userSession)
            }],
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

    componentDidUpdate(data: any){
        console.log('componentDidUpdate =>', data);
        if (this.props.userSession !== data.userSession){
            this.setState({
                profileData: [{title: 'UserData', content: JSON.stringify(data.userSession)}]
            });
           
            this.props.navigation.navigate('Index');
        }
    }


    render() {
        return (
            <ScrollView style={{ padding: 16, width: '100%', marginTop: 20}}>
                <Button bordered rounded danger onPress={() => this.loginWithBlockstack() }>
                    <Text style={{ width: '100%', alignContent: 'center'}}>Login / Signup</Text>
                </Button>

                <Text />
                <Text style={{color: 'white'}}>Or</Text>
                <Text />
                <Button transparent bordered rounded danger onPress={() => this.props.createAccountSilently(this.state.username, this.state.avatar)}>
                    <Text>Continue as guest</Text>
                </Button>
            </ScrollView>
        )
    }
}



// @ts-ignore
export default withNavigation(LoginSplash);
