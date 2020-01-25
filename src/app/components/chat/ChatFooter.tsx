import React from "react";
import { Text, Image, Alert, StyleSheet, Switch, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail, Item, Input } from "native-base";
import { withNavigation } from 'react-navigation';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';
import AsyncStorage from "@react-native-community/async-storage";
import { human, iOSUIKit } from 'react-native-typography';
// @ts-ignore
import nlp from 'compromise';
import { connect } from 'react-redux';
import { State as ReduxState } from './../../reduxStore/index';
import { putPost } from './../../reduxStore/posts/posts.store';
import { placeState, State as PlaceStateModel  } from './../../reduxStore/places/place.store';
import { profileState, State as ProfileStateModel  } from './../../reduxStore/profile/profile.store';
import { Post } from "./../../models/Post";
import * as moment from 'moment';


interface Props {
    navigation: any;
    putPost: (post: Post )=> void;
    placeState: PlaceStateModel;
    profileState: ProfileStateModel;
}
interface State {
    chatText: string;
    tags: Array<string>;
    placeState: PlaceStateModel
}

export class ChatFooter extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            chatText: '',
            tags: [],
            placeState: {} as PlaceStateModel
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
        
        // place state change subscriber
        if (this.props.placeState !== prevProps.placeState) {
            console.log('[componentDidUpdate] ChatFooter.tsx props.placeState' );
            this.setState({
              placeState: this.props.placeState
            });
        }
    }

    sentenceTagger(sentence: string) {
        let doc: any = nlp(sentence);
        let nouns = doc.nouns().data();
        let verbs = doc.verbs().data();
        if (nouns.length > 0){
            this.setState({
                tags: doc.nouns().data().map((t:any)=>t.text)
            })
        }   
    }

    submitPost(chatText: string){
        this.sentenceTagger(this.state.chatText);
        const post = new Post({
            avatar: 'https://banter-pub.imgix.net/users/nicktee.id',
            user: this.props.profileState.username,
            hashtag: this.state.tags,
            hashtagColor: "#4c9aff",
            // @ts-ignore
            time: Date().now,
            content: chatText,
            pullRight: false,
            geohash: this.state.placeState.geohash,
            latitude: this.props.placeState.currentLocation.latitude,
            longitude: this.props.placeState.currentLocation.longitude,
            image: this.props.profileState.settings.attrs.image, // @todo - this should not be base64...maybe a link...maybe base64 is ok
        })
        this.props.putPost(post);
        this.setState({
            chatText: '',
            tags: []
        })
        Keyboard.dismiss();
    }

    render() {
        return (
            <View style={{
                flexDirection: 'row',
                display: 'flex',

                width: '100%',
                paddingLeft: 12,
                paddingRight: 12,

                alignItems: 'center',
                alignContent: 'center',
                flex: 1
            }}>

                <View style={{
                    flexDirection: 'row',
                    display: 'flex',
                    flex: 1,
                    position: "absolute",
                    bottom: 80,
                }}>
                {
                    this.state.tags.map( (tag, i) => {
                        return <TouchableOpacity
                            onPress={() => { }}
                            key={i}
                            style={{
                                height: 32,
                                backgroundColor: "#ff5230",
                                borderRadius: 16,
                                borderColor: "white",
                                borderWidth: 1,
                                marginLeft: 4,
                                marginRight: 4,
                                paddingLeft: 20,
                                paddingRight: 20,
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                            }}>
                            <Text style={{ color: "white", fontSize: 18 }} >#{tag}</Text>
                        </TouchableOpacity>
                    })
                }
                </View>


                <TouchableOpacity
                    onPress={() => { }}
                    style={{
                        height: 42,
                        width: 42,
                        backgroundColor: "#283447",
                        borderRadius: 21,
                        borderColor: "#ff5230",
                        borderWidth: 1,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                    }}>
                    <Text style={{ color: "#ff5230", fontSize: 32, fontWeight: '800' }} >#</Text>
                </TouchableOpacity>
                <View style={{
                    height: 42,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                }} >
                    <Content>
                        <Item rounded style={{
                            marginLeft: 18,
                            marginRight: 18,
                            backgroundColor: "#283447",
                            height: 42,
                            borderRadius: 21,
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            borderColor: "#77849b",
                            borderWidth: 1
                        }}>
                            <Input
                                placeholder='Say something...'
                                value={this.state.chatText}
                                onChangeText={(chatText) => { 
                                    this.setState({ chatText });
                                    this.sentenceTagger(chatText);
                                }}
                                style={[human.body, { color: "#77849b", width: '100%', }]} />
                        </Item>
                    </Content>

                </View>
                <TouchableOpacity
                    onPress={() => { this.submitPost(this.state.chatText) }}
                    style={{
                        height: 42,
                        width: 42,
                        backgroundColor: "#ff5230",
                        borderRadius: 21,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                    }}>
                    <Icon style={{ color: "#ffffff", fontSize: 18 }} name="md-send" ></Icon>
                </TouchableOpacity>
            </View>

        )
    }
}

const hashTagRootStyles = {
    borderRadius: 18,
    padding: 6,
    marginBottom: 6,
};

const styles = StyleSheet.create({
    hashTag: {
        ...hashTagRootStyles,
        alignSelf: 'flex-start'
    },
    hashTagRight: {
        ...hashTagRootStyles,
        alignSelf: 'flex-end'
    },
});



const mapStateToProps: any = (state: ReduxState) => ({
    placeState: placeState(state.places),
    profileState: profileState(state.profile)
})
const mapDispatchToProps = {
    putPost: putPost
}
export default withNavigation( connect(mapStateToProps, mapDispatchToProps)( ChatFooter ) );
  