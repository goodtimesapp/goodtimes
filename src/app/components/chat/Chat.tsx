import React from "react";
import {Text} from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content } from "native-base";
import HeaderComponent from "../Header";


export default class Chat extends React.Component {
  state = {
    messages: [],
    nextId: 0
  };

  componentDidMount() {
    this.setState({
      messages:  [
        {
          _id: 1,
          text: "I think we passed the first step of the tutorial. We will now need a Pusher account!",
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
  }

  onSend(messages = []) {
    this.setState( (previousState: any) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <Container>
         <HeaderComponent />
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
    var ws = new WebSocket('ws://localhost:5000/radiks/stream');
    ws.onopen = () => {
      // connection opened
      // ws.send('something'); // send a message
    };

    ws.onmessage = (e: any) => {
      // a message was received
      console.log(e.data);
      let msg = 'nada'  ;
      try {
        let data = JSON.parse(e.data);
        let modelType = data.radiksType;
        switch(modelType){
          case "Message":
            if (!data.content) return;
            msg = data.content;
            this.setState({
              nextId: (this.state.nextId + 1)
            })
            this.setState({
              messages: GiftedChat.append(this.state.messages, [{
                  _id: this.state.nextId,
                  text: msg,
                  createdAt: new Date(),
                  user: {
                    _id: 3,
                    name: "j.fitty",
                    avatar: "https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png"
                  }
              }])
            })
          case"Vote": 
            if (!data.username) return;
            msg = "+1 " + data.username;
            this.setState({
              nextId: (this.state.nextId + 1)
            })
            this.setState({
              messages: GiftedChat.append(this.state.messages, [{
                  _id: this.state.nextId,
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


}