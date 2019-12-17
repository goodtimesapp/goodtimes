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

        <View style={{ backgroundColor: "#3b475c", height: 6, width: 75, borderRadius: 3, alignSelf: 'center', marginBottom: 12 }}></View>

        <View style={{ paddingBottom: 36 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              <Image style={{ width: 32, height: 32 }} source={require('./../../assets/goodtimes.png')} />
            </TouchableOpacity>
            <Text style={[human.title3, { color: "#b4c2db", paddingBottom: 2, paddingLeft: 6 }]}>The Local - Chat</Text>
          </View>


          <Text style={[human.title1, { color: "#ffffff", paddingTop: 2 }]}>Chicago, IL</Text>
        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', display: 'flex', marginBottom: 16 }}>

          <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
            <Thumbnail source={{ uri: 'https://primalinformation.com/wp-content/uploads/2019/10/Julia-Rose.jpg' }} style={{ height: 52, width: 52 }} />
          </View>

          <View style={{ flexGrow: 1, marginRight: 6  }}>
            <TouchableOpacity onPress={() => { Alert.alert('pressed') }} style={{ backgroundColor: "#ff991f", borderRadius: 18, padding: 6, marginBottom: 6, alignSelf: 'flex-start' }}>
              <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>#coffee</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#344155", borderRadius: 12, paddingTop: 12, paddingBottom: 12, paddingRight: 8, paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <Text style={[iOSUIKit.bodyEmphasized, { color: "#4787db", paddingBottom: 2, paddingLeft: 6 }]}>Julia</Text>
                <View>
                  <Text style={[iOSUIKit.bodyEmphasized, { color: "#7e8ba2", paddingBottom: 2, paddingLeft: 6, alignSelf: 'flex-end' }]}>5 mins</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', paddingBottom: 2, paddingLeft: 6 }}>
                <Text style={[iOSUIKit.body, { color: "#7e8ba2", flex: 1, flexWrap: 'wrap' }]}>
                  Who wants to go get coffee at Dollop?
                  </Text>
              </View>
            </View>
          </View>

        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', display: 'flex', marginBottom: 16 }}>


          <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
            <Thumbnail source={{ uri: 'https://i.pinimg.com/originals/25/d6/5d/25d65d189c753c2efc2795fc75a83b7a.jpg' }} style={{ height: 52, width: 52 }} />
          </View>

          <View style={{ flexGrow: 1, marginRight: 6 }}>
            <TouchableOpacity onPress={() => { Alert.alert('pressed') }} style={{ backgroundColor: "#4c9aff", borderRadius: 18, padding: 6, marginBottom: 6, alignSelf: 'flex-start' }}>
              <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>#guitar</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#344155", borderRadius: 12, paddingTop: 12, paddingBottom: 12, paddingRight: 8, paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <Text style={[iOSUIKit.bodyEmphasized, { color: "#4787db", paddingBottom: 2, paddingLeft: 6 }]}>Helen</Text>
                <View>
                  <Text style={[iOSUIKit.bodyEmphasized, { color: "#7e8ba2", paddingBottom: 2, paddingLeft: 6, alignSelf: 'flex-end' }]}>10 mins</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', paddingBottom: 2, paddingLeft: 6 }}>
                <Text style={[iOSUIKit.body, { color: "#7e8ba2", flex: 1, flexWrap: 'wrap' }]}>
                  I doooooo!
                  </Text>
              </View>
            </View>
          </View>

        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', display: 'flex', marginBottom: 24 }}>



          <View style={{ flexGrow: 1, marginEnd: 16, marginLeft: 6 }}>
            <TouchableOpacity onPress={() => { Alert.alert('pressed') }} style={{ backgroundColor: "#ff5230", borderRadius: 18, padding: 6, marginBottom: 6, alignSelf: 'flex-end' }}>
              <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>#me</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#344155", height: 94, borderRadius: 12 }}>
            </View>
          </View>


          <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, alignSelf: 'flex-end' }}>
            <Thumbnail source={{ uri: 'https://banter-pub.imgix.net/users/nicktee.id' }} style={{ height: 52, width: 52 }} />
          </View>

        </View>


        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', display: 'flex', marginBottom: 24 }}>



          <View style={{ flexGrow: 1, marginEnd: 16, marginLeft: 6 }}>
            <TouchableOpacity onPress={() => { Alert.alert('pressed') }} style={{ backgroundColor: "#ff5230", borderRadius: 18, padding: 6, marginBottom: 6, alignSelf: 'flex-end' }}>
              <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>#me</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#344155", height: 94, borderRadius: 12 }}>
            </View>
          </View>


          <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, alignSelf: 'flex-end' }}>
            <Thumbnail source={{ uri: 'https://banter-pub.imgix.net/users/nicktee.id' }} style={{ height: 52, width: 52 }} />
          </View>

        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', display: 'flex', marginBottom: 24 }}>



          <View style={{ flexGrow: 1, marginEnd: 16, marginLeft: 6 }}>
            <TouchableOpacity onPress={() => { Alert.alert('pressed') }} style={{ backgroundColor: "#ff5230", borderRadius: 18, padding: 6, marginBottom: 6, alignSelf: 'flex-end' }}>
              <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>#me</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#344155", height: 94, borderRadius: 12 }}>
            </View>
          </View>


          <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, alignSelf: 'flex-end' }}>
            <Thumbnail source={{ uri: 'https://banter-pub.imgix.net/users/nicktee.id' }} style={{ height: 52, width: 52 }} />
          </View>

        </View>




      </ScrollView>
    )
  }


}

export default withNavigation(LocalChat)