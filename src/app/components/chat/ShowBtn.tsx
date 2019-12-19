import React from "react";
import { Text, Image, Alert, StyleSheet, Switch, TouchableOpacity, ScrollView  } from 'react-native'
import { Container, View, Content, Header, Icon, Left, Button, Body, Right, Badge, Title, Thumbnail } from "native-base";
import { withNavigation } from 'react-navigation';
import { human, iOSUIKit } from 'react-native-typography';


interface Props {
    navigation: any;
    text: string;
    onButtonPress: ()=> void;
}
interface State {

}

export class ShowBtn extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);        
    }

    render() {
        return (
            <TouchableOpacity
                onPress={()=>{this.props.onButtonPress()}} 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    backgroundColor: '#ffffff',
                    paddingLeft: 8,
                    paddingRight: 8,
                    borderRadius: 26
            }}>
                <Text style={{fontSize: 14, color: "#283447", fontWeight: '600', marginBottom: 8, marginTop: 6}}>{this.props.text}</Text>
            </TouchableOpacity>
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

export default withNavigation(ShowBtn)