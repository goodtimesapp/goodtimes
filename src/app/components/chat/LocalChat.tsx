import React from "react";
import { Text, Image, Alert, Animated, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail, Item } from "native-base";
import { withNavigation } from 'react-navigation';
import { human, iOSUIKit } from 'react-native-typography';
import { ChatItem } from "./ChatItem";
import HorizontalScroll from './HorizontalScroll';
import { AllCaughtUp } from "./AllCaughtUp";
import { ShowBtn } from './../chat/ShowBtn';
import { connect } from 'react-redux';
import { State as ReduxState } from './../../reduxStore/index';
import { posts, getPosts, getChats, initialState } from './../../reduxStore/posts/posts.store';

interface Props {
  navigation: any;
  postsSelector: any;
  getChats: () => void;
}
interface State {

}


export class LocalChat extends React.Component<Props, State> {
  
  state = {
    nextId: 0,
    lastMsg: 'hello'
  };

  constructor(props: Props) {
    super(props);
  }

  

  componentWillMount() {
    
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

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: 12,
              alignItems: 'center',
              width: '100%',
            }}>
            <ShowBtn text={"Show Older"} navigation={null} onButtonPress={() => {
              let messages = [...this.props.postsSelector, ...this.props.postsSelector];
              this.setState({
                messages
              })
            }} />
          </TouchableOpacity>

          {
            initialState.posts
              ? <FlatList
                data={initialState.posts}
                renderItem={({ item }: any) => {
                  return <ChatItem
                    navigation={null}
                    avatar={item.attrs.avatar}
                    hashtag={item.attrs.hashtag}
                    hashtagColor={item.attrs.hashtagColor}
                    user={item.attrs.user}
                    time={item.attrs.time}
                    content={item.attrs.content}
                    pullRight={item.attrs.pullRight}
                  />
                }
                }
                keyExtractor={(item: any) => (item._id + (Math.random()).toString())}
              />
              : null
          }

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



// Global State
const mapStateToProps: any = (state: ReduxState) => ({
  postsSelector: posts(state.posts)
})
// Actions to dispatch
const mapDispatchToProps = {
  getChats: getChats
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)((withNavigation(LocalChat)))
