import React from "react";
import { Text, Image } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail } from "native-base";
import { withNavigation } from 'react-navigation';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER } from 'react-native-dotenv';
import Message from './../../models/Message';
import AsyncStorage from "@react-native-community/async-storage";


interface Props {
  navigation: any;
}
interface State {

}

export class Chat extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  state = {
    messages: [],
    nextId: 0,
    lastMsg: 'hello'
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "hello",
          createdAt: new Date(),
          user: {
            _id: 1,
            name: "nicktee",
            avatar: "https://banter-pub.imgix.net/users/nicktee.id"
          }
        }
      ]
    });
    this.setupWebSocket();

    AsyncStorage.getItem('tempId').then( (id)=>{
      this.setState({
        messages: [
          {
            _id: 1,
            text: "welcome to the chatroom",
            createdAt: new Date(),
            user: {
              _id: 1,
              name: id,
              avatar: `https://ui-avatars.com/api/?name=${id}`
            }
          }
        ]
      })
    } )

  }

  onSend(messages = []) {
    this.setState((previousState: any) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    console.log('mms',messages);
    // @ts-ignore
    let m = messages[0].text;
    this.setState({
      lastMsg: m
    })
    this.radiksPutMessage(m);
  }

  closeDrawer = () => {
    this.props.navigation.closeDrawer();
  }

  render() {
    return (
      <Container>
        <Header>
          <Left >
            <Button transparent onPress={() => this.closeDrawer()} >
              <Icon name='arrow-back' style={{ color: '#78909C' }} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#78909C'}}>Chat Room</Title>
          </Body>
          <Right>
            {/* <Thumbnail small source={{uri: 'https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png'}} /> */}
          </Right>
          {/* <Body style={{ marginTop: -10 }}>
                    <View>
                        <Image style={{width: 32, height: 32}} source={ require('./../assets/LOGO.png') } />
                    </View>
                </Body>
                
                <Right>
                    <Button transparent onPress={ () => this.closeDrawer()  }>
                        <Badge style={{ position: 'absolute' }}><Text>2</Text></Badge>
                        <Icon name='chatboxes' style={{color: 'grey'}} />
                    </Button>
                </Right> */}
        </Header>
        <GiftedChat
          messages={this.state.messages}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          user={{
            _id: 1
          }}
          onSend={messages => this.onSend(messages)}></GiftedChat>
      </Container>
    )
  }

  setupWebSocket() {


    console.log('setting up websocket....');

    // @ts-ignore
    var ws = new WebSocket(`wss://${GOODTIMES_RADIKS_SERVER}/radiks/stream`);
    ws.onopen = () => {
      // connection opened
      // ws.send('something'); // send a message
    };

    ws.onmessage = (e: any) => {
      // a message was received
      console.log('[MSG_RECIEVED]', e.data);
      let msg = 'nada';



      try {
        let data = JSON.parse(e.data);
        let modelType = data.radiksType;
        switch (modelType) {
          case "Message":
            if (!data.content || (data.content == this.state.lastMsg) ) return;
            msg = data.content;
            this.setState({
              nextId: (this.state.nextId + 1)
            })
            this.setState({
              messages: GiftedChat.append(this.state.messages, [{
                _id: this.uuid(),
                text: msg,
                createdAt: new Date(),
                user: {
                  _id: 3,
                  name: "j.fitty",
                  avatar: "https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png"
                }
              }])
            })
          case "Vote":
            if (!data.username) return;
            msg = "+1 " + data.username;
            this.setState({
              nextId: (this.state.nextId + 1)
            })
            this.setState({
              messages: GiftedChat.append(this.state.messages, [{
                _id: this.uuid(),
                text: msg,
                createdAt: Date.now(),
                user: {
                  _id: 3,
                  name: "j.fitty",
                  avatar: "https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png"
                }
              }])
            })
          default:
            return;
        }


      } catch (e) { }

    };

  }

  async radiksPutMessage(msg: any) {

    // @ts-ignore
    let message = new Message({
      content: msg,
      _id: this.uuid(),
      createdBy: 'nicktee.id',
      votes: []
    });
    let resp = await message.save();
    console.log('radiks resp', resp);
    // @ts-ignore
    let mz = await Message.findById(resp._id);
    console.log('msgzzz', mz);


  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}

export default withNavigation(Chat)