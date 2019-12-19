import React from "react";
import { Text, Image, Alert, StyleSheet } from 'react-native'
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
    avatar: string;
    hashtag: string;
    user: string;
    time: string;
    content: string;
    pullRight?: boolean;
    hashtagColor: string;
}
interface State {

}

export class ChatItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);        
    }

    render() {
        return (
               <View style={{ flexDirection: 'row', alignSelf: 'flex-start', display: 'flex', marginBottom: 16 }}>
                    {
                        !this.props.pullRight
                        ? <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                            <Thumbnail source={{ uri: this.props.avatar }} style={{ height: 52, width: 52 }} />
                        </View>
                        : null
                    }
                    
                    <View style={{ flexGrow: 1, marginRight: 6 }}>
                        <TouchableOpacity  onPress={() => { Alert.alert('pressed') }} 
                            style={[ (this.props.pullRight ? styles.hashTagRight : styles.hashTag ) , {backgroundColor: this.props.hashtagColor } ]}>
                            <Text style={[human.body, { color: "#ffffff", paddingBottom: 2 }]}>
                                {this.props.hashtag}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: "#344155", borderRadius: 12, paddingTop: 12, paddingBottom: 12, paddingRight: 8, paddingLeft: 8 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={[iOSUIKit.bodyEmphasized, 
                                    { color: "#4787db", paddingBottom: 2, paddingLeft: 6, alignSelf: 'flex-start', flexGrow: 1 }]}>
                                        {this.props.user}
                                </Text>
                                <View>
                                    <Text style={[iOSUIKit.bodyEmphasized, { color: "#7e8ba2", paddingBottom: 2, paddingLeft: 6, alignSelf: 'flex-end' }]}>
                                        {this.props.time}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 2, paddingLeft: 6 }}>
                                <Text style={[iOSUIKit.body, { color: "#7e8ba2", flex: 1, flexWrap: 'wrap' }]}>
                                    {this.props.content}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {
                        this.props.pullRight
                        ? <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginLeft: 16, alignSelf: 'flex-end' }}>
                            <Thumbnail source={{ uri: this.props.image }} style={{ height: 52, width: 52 }} />
                        </View>
                        : null
                    }
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

export default withNavigation(ChatItem)