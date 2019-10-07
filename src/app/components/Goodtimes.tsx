import React, { Component } from 'react'
import { View, Text, ScrollView , Image, FlatList} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './Header';
import CardComponent from './goodtimes/Card';
import { State } from './../reduxStore/index';
import { 
  getUserSession,
  getProfileState,
  getUserName,
  createAccountSilently,
  logout,
  silentLogin,
} from './../reduxStore/profile/profile.store';
import { posts, getPosts } from './../reduxStore/posts/posts.store';
import { getBase64, selectBase64 } from './../reduxStore/global/global.store';
import { store } from './../reduxStore/configureStore';
import { withNavigation } from 'react-navigation';
import { PostsPage } from './posts/Index';
declare let window: any;
import { Post } from './../models/Post';
import Comment from './../models/Comment';


interface Props{
    navigation: any,
    silentLogin: (state: any)=> void;
    selectBase64: () => string;
    posts: Array<Post>;
    getPosts: (filter: any)=> void;
}

export class Goodtimes extends Component<Props, State> {

    constructor(props: Props){
        super(props);
    }

    async componentDidMount(){
    
        let profileState = store.getState().profile;
       
        if (profileState.userSession !== undefined){
            // try silent login
            let loggedin = await this.props.silentLogin(profileState);
        } else{
            // or redirect to profile page
            this.props.navigation.navigate('Profile');
        }

       
        this.props.getPosts({sort: '-createdAt'});
        
        
  
    }   

    render() {
        return (
            <View style={{flex: 1}}>
                <Header />
                { 
                    this.props.posts 
                        ? <FlatList 
                            data={this.props.posts}
                            extraData={this.props}
                            keyExtractor={item  => item._id}
                            renderItem={({ item }) => 
                                <CardComponent 
                                    likes={11} 
                                    avatar={`https://goodtimes-server.herokuapp.com/api/avatar/${item.attrs.createdBy}`} 
                                    image={ item.attrs.image   }
                                    name={item.attrs.createdBy} 
                                    summary={item.attrs.description}
                                    createdAt=''
                                />               
                            }
                        />  
                        : <Text>Fetching Posts...</Text> 
                }
            </View>
        )
    }
}

// Global State
const mapStateToProps: any = (state: State) => ({
    userSession: getUserSession(state.profile),
    getProfileState: getProfileState(state.profile),
    getUserName: getUserName(state.profile),
    selectBase64: selectBase64(state.global),
    posts: posts(state.posts),
})
// Actions to dispatch
const mapDispatchToProps = {
    createAccountSilently:  createAccountSilently,
    logout: logout,
    silentLogin: silentLogin,
    getPosts: getPosts
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)( (withNavigation(Goodtimes)) )
