import React from "react";
import { Text, Image, Alert, Animated, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail } from "native-base";
import { withNavigation } from 'react-navigation';
import { human, iOSUIKit } from 'react-native-typography';
import { ChatItem } from "./ChatItem";
import HorizontalScroll from './HorizontalScroll';
import { AllCaughtUp } from "./AllCaughtUp";
import { NewPost } from './../chat/NewPost';

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

      <Animated.ScrollView
        scrollEventThrottle={1}
        style={{
          backgroundColor: "#283447",
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          marginTop: -50,
          borderWidth: 1,
          borderRadius: 2,
          borderColor: '#3b4758',
          borderBottomWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 1,
          paddingBottom: 76

        }} >

        <View style={styles.dragBar}></View>

        {/* <HorizontalScroll /> */}

        <View style={{ padding: 18 }}>



          <View style={{ paddingBottom: 36 }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <Image style={{ width: 32, height: 32 }} source={require('./../../assets/goodtimes.png')} />
              </TouchableOpacity>
              <Text style={[human.title3, { color: "#b4c2db", paddingBottom: 2, paddingLeft: 6 }]}>The Local - Chat</Text>
            </View>
            <Text style={[human.title1, { color: "#ffffff", paddingTop: 2 }]}>Chicago, IL</Text>
          </View>

          <TouchableOpacity style={{
            alignSelf: 'center',
            marginBottom: 12,
            alignItems: 'center',
            width: '100%'
            }}>
            <NewPost text={"Show Older"} navigation={null} />
          </TouchableOpacity>


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
            content={"this is very useful if you have an animation that must follow the scroll position because without the native driver it will always run a frame behind of the gesture because of the async nature of React Native"}
            pullRight={true}
          />


        </View>

        <AllCaughtUp navigation={null} />


      </Animated.ScrollView>


    )
  }


}


const styles = StyleSheet.create({
  dragBar: {
    backgroundColor: "#ffffff",
    height: 7,
    width: 75,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16
  }
});




export default withNavigation(LocalChat)