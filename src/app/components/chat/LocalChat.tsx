import React from "react";
import { Text, Image, Alert, Animated, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail, Item } from "native-base";
import { withNavigation } from 'react-navigation';
import { human, iOSUIKit } from 'react-native-typography';
import ChatItem from "./ChatItem";
import HorizontalScroll from './HorizontalScroll';
import AllCaughtUp from "./AllCaughtUp";
import ShowBtn from './../chat/ShowBtn';
import { connect } from 'react-redux';
import { State as ReduxState } from './../../reduxStore/index';
import { postsState, getPosts, getChats, clearPosts } from './../../reduxStore/posts/posts.store';
import { placeState, State as PlaceStateModel } from './../../reduxStore/places/place.store';
import { store } from "reduxStore/configureStore";


interface Props {
  navigation: any;
  postsState: any;
  getChats: () => void;
  getPosts: (filter: any) => void;
  clearPosts: () => void;
  placeState: PlaceStateModel
}
interface State {
  posts: Array<any>;
  placeState: PlaceStateModel
}


export class LocalChat extends React.Component<Props, State> {

  state = {
    nextId: 0,
    lastMsg: 'hello',
    posts: [],
    placeState: {} as PlaceStateModel
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
   
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
    //console.log('updated localchat', prevState, prevProps);
    // posts state change subscriber
    if (prevProps.postsState !== this.props.postsState) {
      console.log('postsChangeHandler', this.props.postsState);
      this.postsChangeHandler();
    }
    // place state change subscriber
    if (prevProps.placeState !== this.props.placeState) {
      console.log('placeChangeHandler', this.props.placeState);
      this.placeChangeHandler();
    }
  }

  postsChangeHandler(){  
    this.setState({
      posts: this.props.postsState.posts
    });
  }

  placeChangeHandler(){
    this.props.clearPosts();
    this.props.getPosts({geohash: this.props.placeState.geohash});
    this.setState({
      placeState: this.props.placeState
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
              {
                // @ts-ignore
                <Text style={[human.title3, { color: "#b4c2db", paddingBottom: 2, paddingLeft: 6 }]}>Geohash - { this.state.placeState.geohash } </Text>
              }              
            </View>
            {
              // @ts-ignore
              <Text style={[human.title1, { color: "#ffffff", paddingTop: 2 }]}>Chicago, IL  </Text>
            }
            
          </View>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: 12,
              alignItems: 'center',
              width: '100%',
            }}>
            {/* <ShowBtn text={"Show Older"} navigation={null} onButtonPress={() => {
              let messages = [...this.props.posts, ...this.props.posts];
              this.setState({
                posts: messages
              })
            }} /> */}
          </TouchableOpacity>

          {
               <FlatList
                data={this.state.posts}
                renderItem={({ item }: any) => {
                  return <ChatItem
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
             
          }

        </View>

        <AllCaughtUp />


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


const mapStateToProps: any = (state: ReduxState) => ({
  postsState: postsState(state.posts),
  placeState: placeState(state.places)
})
const mapDispatchToProps = {
  getPosts: getPosts,
  getChats: getChats,
  clearPosts: clearPosts,
}
export default withNavigation( connect(mapStateToProps, mapDispatchToProps)( LocalChat ) );
