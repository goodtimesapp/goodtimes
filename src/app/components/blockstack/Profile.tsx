import React, { Component } from 'react'
import { ScrollView } from 'react-native';
import {Button, Text, Input, Content, Item, Container} from 'native-base';
import { blockstackLogin } from '../../reduxStore/profile/profile.store';
import { rando } from '../../utils/profile';


interface Props{
    userSession: any;
    getProfileState: any;
    getUserName: any;
    createAccountSilently: (userChosenName: string, avatar: string)=> void;
    blockstackLogin:  ()=> void;
    logout: ()=> void;
    silentLogin:  ()=> void;
}

interface State{
   username: string,
   avatar: string
}


export default class Profile extends Component<Props, State> {

    constructor(props: Props){
        super(props);
        this.state = {
            username: 'good' + rando() + '.id.blockstack',
            avatar: 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0'
        }
    }

    render() {
        return (
            <ScrollView style={{padding: 10}}>
                 <Button bordered rounded success onPress={ ()=> this.props.blockstackLogin() }>
                    <Text>Login with Blockstack</Text>
                </Button>
                
                <Text/>
                <Text/>
              
                <Content style={{backgroundColor: 'grey', height: 1}} />

                <Text/>
                <Text/>
                <Text>Or Continue as guest</Text>
                <Text/>
                <Text/>

                <Content>
                <Item rounded>
                    <Input placeholder='Choose username' value={this.props.getUserName ||this.state.username}/>
                </Item>
                </Content>
                <Text/>

                <Content>
                <Item rounded>
                    <Input placeholder='Choose Profile picture' value={this.state.avatar}  />
                </Item>
                </Content>
                <Text/>
                <Button bordered rounded success onPress={ ()=> this.props.createAccountSilently(this.state.username, this.state. avatar) }>
                    <Text>Next =></Text>
                </Button>


                <Text/>
                <Text/>
                <Content style={{backgroundColor: 'grey', height: 1}} />
                <Text/>
                <Text/>
               
                <Button bordered rounded onPress={ ()=> this.props.logout() }>
                    <Text>Logout</Text>
                </Button>

                <Text/>
                <Text/>
                <Content style={{backgroundColor: 'grey', height: 1}} />
                <Text/>
                <Text/>

                <Text>Profile</Text>
                <Text/>
                <Text>User Session</Text>
                <Text>{JSON.stringify(this.props.userSession)}</Text>
                <Text/>
                <Text>Profile State</Text>
                <Text>{JSON.stringify(this.props.getProfileState)}</Text>

                <Text/>
                <Text/>
            </ScrollView>
        )
    }
}

