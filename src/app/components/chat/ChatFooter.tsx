import React from "react";
import { Text, Image, Alert, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail, Item, Input } from "native-base";
import { withNavigation } from 'react-navigation';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';
import AsyncStorage from "@react-native-community/async-storage";
import { human, iOSUIKit } from 'react-native-typography';



interface Props {
    navigation: any;
}
interface State {

}

export class ChatFooter extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
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
                <TouchableOpacity
                    onPress={() => { Alert.alert('hi') }}
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
                            <Input placeholder='Say something...' style={[human.body, { color: "#77849b", width: '100%', }]} />
                        </Item>
                    </Content>

                </View>
                <TouchableOpacity style={{
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

export default withNavigation(ChatFooter)