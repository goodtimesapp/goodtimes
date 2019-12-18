import React from "react";
import { Text, Image, Alert } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail } from "native-base";
import { withNavigation } from 'react-navigation';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';
import AsyncStorage from "@react-native-community/async-storage";
import { human, iOSUIKit } from 'react-native-typography';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { ChatItem } from "./ChatItem";


interface Props {
  navigation: any;
}
interface State {

}

export class LocalChat extends React.Component<Props, State> {

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

  }


  closeDrawer = () => {
    this.props.navigation.closeDrawer();
  }

  render() {
    return (
 
        <ScrollView style={{
          backgroundColor: "#283447", padding: 18, borderTopRightRadius: 25, borderTopLeftRadius: 25, marginTop: -50,

          borderWidth: 1,
          borderRadius: 2,
          borderColor: '#3b4758',
          borderBottomWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 1,

        }} >

          <View style={{ backgroundColor: "#ffffff", height: 7, width: 75, borderRadius: 3, alignSelf: 'center', marginBottom: 16 }}></View>

          <View style={{ paddingBottom: 36 }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <Image style={{ width: 32, height: 32 }} source={require('./../../assets/goodtimes.png')} />
              </TouchableOpacity>
              <Text style={[human.title3, { color: "#b4c2db", paddingBottom: 2, paddingLeft: 6 }]}>The Local - Chat</Text>
            </View>
            <Text style={[human.title1, { color: "#ffffff", paddingTop: 2 }]}>Chicago, IL</Text>
          </View>


          <ChatItem
            navigation={null}
            image={"https://primalinformation.com/wp-content/uploads/2019/10/Julia-Rose.jpg"}
            hashtag={"#coffee"}
            hashtagColor={"#ff991f"}
            user={"Dude"}
            time={"2 mins"}
            content={"Lets do pull ups"}
          />

          <ChatItem
            navigation={null}
            image={"https://banter-pub.imgix.net/users/nicktee.id"}
            hashtag={"#me"}
            hashtagColor={"#4c9aff"}
            user={"Nick"}
            time={"4 mins"}
            content={"that be me"}
            pullRight={true}
          />
          <ChatItem
            navigation={null}
            image={"https://banter-pub.imgix.net/users/nicktee.id"}
            hashtag={"#me"}
            hashtagColor={"#4c9aff"}
            user={"Nick"}
            time={"4 mins"}
            content={"that be me"}
            pullRight={true}
          />

          <ChatItem
            navigation={null}
            image={"https://banter-pub.imgix.net/users/nicktee.id"}
            hashtag={"#me"}
            hashtagColor={"#4c9aff"}
            user={"Nick"}
            time={"4 mins"}
            content={"that be me"}
            pullRight={true}
          />


        </ScrollView>

    
    )
  }


}

export default withNavigation(LocalChat)