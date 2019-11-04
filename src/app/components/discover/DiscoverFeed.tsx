import React, { Component } from 'react'
import { View, Text, ScrollView, Image, FlatList, AppState,  RefreshControl, ActivityIndicator , StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './../Header';
import CardComponent from './../goodtimes/Card';
import { State as ReduxState } from './../../reduxStore/index';

import { store } from './../../reduxStore/configureStore';
import { withNavigation } from 'react-navigation';
declare let window: any;
import { Post } from './../../models/Post';
import Comment from './../../models/Comment';
import _ from 'underscore';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER } from 'react-native-dotenv';

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import FitImage from 'react-native-fit-image';



interface Props {
    navigation: any
}

interface State {
    refreshing: boolean,
    isLoading: boolean,
    posts: any
}

export class DiscoverFeed extends Component<Props, State> {

    

    constructor(props: Props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoading: true,
            posts: [
                {
                    _id: 1,
                    attrs: {
                        createdBy: 'nicktee.id',
                        image: '',
                        description: 'desc'
                    }
                },
                {
                    _id: 1,
                    attrs: {
                        createdBy: 'nicktee.id',
                        image: '',
                        description: 'desc'
                    }
                }
            ]
        }
    }

    componentDidMount() {


    }



    onRefresh  = async () =>{
        this.setState({
            refreshing: true
        });
    
        // await this.props.getPosts({ sort: '-createdAt' })

        setTimeout( ()=>{

            this.setState({
                refreshing: false
            });
        }, 500 )  

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header />

                { this.state.posts
                    ? <FlatList
                        data={this.state.posts}
                        keyExtractor={ (item: any) => item._id}
                        renderItem={({ item }) =>
                           
                       

                        <Card style={{ width: '100%', marginLeft: 0 }}>
                        <CardItem style={{ width: '100%' }}>
                          <Left>
                            <Thumbnail source={{ uri: 'https://ui-avatars.com/api/?name=Nick%20Theile'}} />
                            <Body>
                              <Text>Starbucks - 3 mins ago</Text>
                            </Body>
                          </Left>
                          <Right>
                          <Thumbnail source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=1601%20W%20Irving%20Park%20Rd,%20Chicago,%20IL%2060613&zoom=16&size=120x120&key=AIzaSyB36iGojlUc1mflgt1_wUzVupy4yTTtfOE'}} />
                          </Right>
                        </CardItem>
                        <CardItem cardBody>
                            <FitImage source={{ uri: 'https://images.unsplash.com/photo-1520552626357-c2f0f963d4bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80' }} style={{  borderRadius: 20 }} />
                        </CardItem>
                        <CardItem style={{ padding: 8 }}>
                          <Left>
                            <TouchableOpacity style={{margin: 8}} onPress={ ()=>{
                             
                              
                            }} >
                              <Icon type='FontAwesome' name='heart-o' style={{ fontSize: 30}} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{margin: 8}}>
                              <Icon type='FontAwesome' name="comment-o" style={{ fontSize: 30, color: 'black' }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{margin: 8}}>
                              <Icon type='FontAwesome' name="paper-plane-o" style={{ fontSize: 30, color: 'black' }} />
                            </TouchableOpacity>
                          </Left>
                        </CardItem>
                
                        <CardItem style={{ height: 20 }}>
                          <Text>12 likes</Text>
                        </CardItem>
                        <CardItem>
                          <Body>
                            <Text>
                              <Text style={{ fontWeight: "900" }}>
                                  Nick 
                                </Text>
                              Textefsdlkvmfkls  nefklmfe
                            </Text>
                          </Body>
                        </CardItem>
                      </Card>
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
  
})
// Actions to dispatch
const mapDispatchToProps = {

}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)((withNavigation(DiscoverFeed)))