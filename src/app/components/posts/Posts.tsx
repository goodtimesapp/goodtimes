import React, { Component } from "react";
import { View, Button, Text, TextInput } from 'react-native';
import { Post } from './../../models/Post';
import Comment from './../../models/Comment';
import AsyncStorage from "@react-native-community/async-storage";

interface Props {
    posts: Array<Post>,
    putPost: (post: Post) => void,
    getPosts: (filter: any) => void,
    base64Photo: any,
    navigation: any;
}

interface State {
    desc: string
}

export default class PostComponent extends Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state= {
            desc: ''
        }
    }

    componentDidMount(){
        
    }

    async putPost() {


        let uid = await AsyncStorage.getItem('tempId')  || 'nicktee.id';

        let p: Post = new Post({
            description: this.state.desc,
            image: this.props.navigation.getParam('base64Photo'),
            createdBy: uid,
            likes: 2
        });
      
        this.props.putPost(p);
        this.props.navigation.navigate('Goodtimes');
    }

    getPosts() {
        this.props.getPosts({});
    }

    render() {
        return (
            <View>
                <Text />
                <Text />
                <TextInput placeholder="[Comment]" onChangeText={(desc) => this.setState({desc})}>
                </TextInput>
                <Text />
                <Text />
                <Button title="Submit" onPress={() => this.putPost()} />
            </View>
        )
    }

}