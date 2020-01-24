import React, { Component } from 'react'
import { View, Text, ScrollView, Image, FlatList, AppState, RefreshControl, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './Header';
import CardComponent from './goodtimes/Card';
import { State as ReduxState } from './../reduxStore/index';
import {
    getUserSession,
    getProfileState,
    getUserName,
    createAccountSilently,
    logout,
    silentLogin,
} from './../reduxStore/profile/profile.store';
import { getPosts } from './../reduxStore/posts/posts.store';
import { getBase64, selectBase64 } from './../reduxStore/global/global.store';
import { setupWebsockets, websocketsState } from './../reduxStore/websockets/websockets.store';
import { store } from './../reduxStore/configureStore';
import { withNavigation } from 'react-navigation';
import { PostsPage } from './posts/Index';
declare let window: any;
import { Post } from './../models/Post';
import Comment from './../models/Comment';
import _ from 'underscore';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';


interface Props {
    navigation: any,
    silentLogin: (state: any) => Promise<any>;
    selectBase64: () => string;
    posts: Array<Post>;
    getPosts: (filter: any) => Promise<any>;
    websockets: any;
    setupWebsockets: (placeId: string) => void;
}

interface State {
    refreshing: boolean,
    isLoading: boolean
}

export class Goodtimes extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true
        }
    }

    componentDidMount() {

        let profileState = store.getState().profile;
        try {
            this.props.silentLogin(profileState).then((loggedin) => {
                this.props.getPosts({ sort: '-createdAt', placeId: store.getState().places.placeId })
                // listen for AppState background/foreground changes
                // AppState.addEventListener('change', this._handleAppStateChange);
            });
        } catch (e) {
            this.props.navigation.navigate('Profile');
        }
    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate() {
        console.log('goodtimes componentDidUpdate');
    }

    _handleAppStateChange = (nextAppState: any) => {

        switch (nextAppState) {
            case 'active': {
                console.log('activated');
                // check to make sure you have an active websocket if you are logged in
                break;
            }
            case 'inactive': {
                console.log('inactive');
                break;
            }
            case 'background': {
                console.log('background');
                break;
            }
            default:
                break;
        }

    };

    onRefresh = async () => {
        this.setState({
            refreshing: true
        });

        await this.props.getPosts({ sort: '-createdAt', placeId: store.getState().places.placeId })

        setTimeout(() => {

            this.setState({
                refreshing: false
            });
        }, 500)

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header />

                {this.props.posts
                    ? <FlatList
                        data={this.props.posts}
                        extraData={this.props}
                        initialNumToRender={2}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) =>
                            <CardComponent
                                likes={11}
                                avatar={`https://ui-avatars.com/api/?name=${item.attrs.createdBy}`}
                                image={item.attrs.image}
                                name={item.attrs.createdBy}
                                summary={item.attrs.description}
                                createdAt=''
                            />

                        }
                        refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                        }
                    />


                    : <Text>Fetching Posts...</Text>
                }



            </View>
        )
    }


}

// Global State
const mapStateToProps: any = (state: ReduxState) => ({
    userSession: getUserSession(state.profile),
    getProfileState: getProfileState(state.profile),
    getUserName: getUserName(state.profile),
    selectBase64: selectBase64(state.global),
    posts: posts(state.posts),
    websockets: websocketsState(state.websockets)
})
// Actions to dispatch
const mapDispatchToProps = {
    createAccountSilently: createAccountSilently,
    logout: logout,
    silentLogin: silentLogin,
    getPosts: getPosts,
    setupWebsockets: setupWebsockets
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)((withNavigation(Goodtimes)))
