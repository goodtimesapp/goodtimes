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
import { postsState, getPosts, getChats, clearPosts, State as PostsStateModel } from './../../reduxStore/posts/posts.store';
import { placeState, State as PlaceStateModel } from './../../reduxStore/places/place.store';
import { store } from "reduxStore/configureStore";
import { HorzScrollTrending } from "./HorzScrollTrending";
import moment from 'moment';
import { Post, IPost } from './../../models/Post';


interface Props {
  navigation: any;
  postsState: PostsStateModel;
  getChats: () => void;
  getPosts: (filter: any) => void;
  clearPosts: () => void;
  placeState: PlaceStateModel
}
interface State {
  posts: Array<Post>;
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
    if (this.props.placeState.userGroupId !== ''){
      // this.placeChangeHandler();
    }
    this.showInitialState();
  }

  showInitialState(){
    this.setState({
      posts: (this.props.postsState.posts.length > 0 ? this.props.postsState.posts : [])
    })
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
    
    // posts state change subscriber
    if (this.props.postsState !== prevProps.postsState ) {
      console.log('[componentDidUpdate] LocalChat.tsx props.postsState' );
      // console.log('postsChangeHandler', this.props.postsState);
      if (prevProps.postsState.posts !== this.props.postsState.posts){
        this.postsChangeHandler();
      }
    }

    // place state change subscriber
    if (this.props.placeState.geohash !==  prevProps.placeState.geohash ) {
      // console.log('placeChangeHandler', this.props.placeState);
      console.log('[componentDidUpdate] LocalChat.tsx place.postsState' );
      this.placeChangeHandler();
    }

  }

  postsChangeHandler() {
    this.setState({
      posts: this.props.postsState.posts
    });
  }

  placeChangeHandler() {
    this.props.clearPosts();
    this.props.getPosts({ geohash: this.props.placeState.geohash });
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

          <View style={{ paddingBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity>
                <Image style={{ width: 32, height: 32 }} source={require('./../../assets/goodtimes.png')} />
              </TouchableOpacity>
              <Text style={[human.title1, { color: "#ffffff", paddingTop: 2, alignSelf: 'flex-end' }]}>Chicago, IL  </Text>
              <Text style={[human.title3, { color: "#b4c2db", paddingBottom: 2, paddingLeft: 6 }]}>{this.state.placeState.geohash} </Text>
              <TouchableOpacity style={{
                    height: 32, 
                    width: 32, 
                    backgroundColor:  "#283447", 
                    borderRadius: 16,
                    borderColor: "#77849b",
                    borderWidth: 1,
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}>
                    <Icon style={{color: "#77849b", fontSize: 18}} name="ios-search" ></Icon>
                </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: 0,
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

          <View style={{marginRight: -20}}>
            <HorzScrollTrending navigation />
          </View>
          

          {
            <FlatList
              data={this.state.posts as Array<Post>}
              renderItem={ ( { item } ) => {
                let i = item.attrs as IPost;
                return <ChatItem
                  avatar={i.avatar  ? i.avatar : "https://banter-pub.imgix.net/users"}
                  hashtag={i.tags ? i.tags[0] : 'msg' }
                  hashtagColor={i.hashtagColor}
                  user={i.user}
                  time={i.time}
                  content={(typeof i.content == "string") ? i.content : `locked with key ${i.signingKeyId}` }
                  pullRight={i.pullRight}
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
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(LocalChat));
