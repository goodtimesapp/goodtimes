import React from "react";
import { Text, Image, Alert, StyleSheet, Switch, TouchableOpacity, ScrollView  } from 'react-native'
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail } from "native-base";
import { withNavigation } from 'react-navigation';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';
import AsyncStorage from "@react-native-community/async-storage";
import { human, iOSUIKit } from 'react-native-typography';



interface Props {
    navigation: any;
    avatar: any;
}
interface State {

}

export class MapHeader extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);        
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', 
                display: 'flex', 
                marginBottom: 16, 
                width: '100%', 
                paddingLeft: 12, 
                paddingRight: 12, 
                paddingTop: 12,
                alignItems: 'center',
                alignContent: 'center',
                flex: 1
            }}>
                <TouchableOpacity 
                    onPress={ ()=> { this.props.navigation.navigate("ProfilePage"); } }
                    style={{
                        height: 32, 
                        width: 32, 
                        backgroundColor:  "#283447", 
                        borderRadius: 16,
                        borderColor: "#77849b",
                        borderWidth: 1,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                }}>
                    <Thumbnail small source={this.props.avatar} />
                </TouchableOpacity>
                <View  style={{
                    marginLeft: 40, 
                    marginRight: 40, 
                    width: 75, 
                    backgroundColor:  "#283447", 
                    height: 32, 
                    borderRadius: 16,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    borderColor: "#77849b",
                    borderWidth: 1,
                    paddingTop: 4,
                    paddingBottom: 4
                }}>
                   <TouchableOpacity>
                           <Icon style={[{ color: "#ff5230" }]}
                           name="settings"></Icon>
                   </TouchableOpacity>
                   <Text style={[human.body, { color: "#77849b" }]}>
                        Go Online
                    </Text>
                    <Switch
                     onTintColor="#93423b"
                     thumbColor="#ff5230"
                     value={true} />
                </View>
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
                    <Icon style={{color: "#77849b", fontSize: 18}} name="md-chatboxes" ></Icon>
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

export default withNavigation(MapHeader)