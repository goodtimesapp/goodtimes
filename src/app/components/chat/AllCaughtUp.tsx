import React from "react";
import { Text, Image, Alert, StyleSheet, Switch, TouchableOpacity, ScrollView  } from 'react-native'
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail } from "native-base";
import { withNavigation } from 'react-navigation';
import { human, iOSUIKit } from 'react-native-typography';


interface Props {
    navigation: any;
}
interface State {

}

export class AllCaughtUp extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);        
    }

    render() {
        return (
            <View style={{ 
                display: 'flex', 
                width: '100%', 
                paddingLeft: 12, 
                paddingRight: 12, 
                paddingTop: 12,
                paddingBottom: 12,
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'space-between',
                flex: 1,
                backgroundColor: '#2c333d'
            }}>
                <View>
                    <Icon name="md-checkmark-circle-outline" style={{fontSize: 52, color: "#ff5230", fontWeight: 'bold'}}></Icon>
                </View>
                <View>
                    <Text  style={{fontSize: 24, color: "#ffffff", fontWeight: '600', marginBottom: 8, marginTop: 6}}>You're All Caught Up</Text>
                </View>
                <View>
                    <Text  style={{fontSize: 14, color: "#ffffff", fontWeight: '400'}}>You've seen all the new chats for this area.</Text>
                </View>
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

export default withNavigation(AllCaughtUp)