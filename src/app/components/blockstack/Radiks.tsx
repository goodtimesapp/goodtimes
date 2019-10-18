import React, { Component } from 'react'
import { ScrollView, Text, TextInput, Button } from 'react-native'
import { UserGroup, GroupInvitation, Central } from './../../radiks/src/index';
import Message from './../../models/Message';
import EncryptedMessage from './../../models/EncryptedMessage';
import AsyncStorage from '@react-native-community/async-storage';
declare let window: any;
window.radiks = require('./../../radiks/src/index');
window.EncryptedMessage = EncryptedMessage;

interface Props {
    getUserName: any
}
interface State {
    text: string
}

export default class Radiks extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
           text: ''
        }
    }

    componentDidMount() {
       
    }

    async radiksPutMessage(text: string) {
        // @ts-ignore
        let message = new Message({
          content: text || this.rando().toString(),
          createdBy: this.props.getUserName,
          votes: []
        });
        let resp = await message.save();
        console.log('radiks resp', resp);
    }

    async radiksPutEncryptedGroupMessage(text: string) {
        // @ts-ignore
        let m = new EncryptedMessage({
            content: 'from samsung',
            createdBy: this.props.getUserName,
            votes: [], 
            category: 'phone',
            userGroupId: ''
          });
        let resp = await m.save();
        console.log('radiks resp encrypted msg', resp);
    }

    async radiksPutCentral(){
        const key = 'UserSettings';
        const value = { email: 'myemail@example.com' };
        await Central.save(key, value);
        const result = await Central.get(key);
        console.log(result); // { email: 'myemail@example.com' }
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
                
                <Text>Put Message</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={ text => this.onTextChange(text) }
                    placeholder={this.props.getUserName}
                    />
                <Button title="Submit" onPress={ ()=> this.radiksPutMessage(this.state.text) } ></Button>

            </ScrollView>
        )
    }
}
