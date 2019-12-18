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
}
interface State {

}

export class ChatHeader extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);        
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', display: 'flex', marginBottom: 16, width: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 12 }}>
                 <Button rounded light style={{alignSelf: 'flex-start'}}>
                    <Icon name='arrow-back' />
                </Button>
                <View  style={{flexGrow: 1, marginLeft: 18, marginRight: 18, backgroundColor:  "#283447", height: 52, borderRadius: 26}}>
                    
                </View>
                <Button rounded light style={{alignSelf: 'flex-end'}}>
                    <Icon name='arrow-back' />
                </Button>
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

export default withNavigation(ChatHeader)