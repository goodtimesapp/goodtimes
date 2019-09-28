// @ts-ignore
import { RNPhotoEditor } from 'react-native-photo-editor'
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { withNavigation } from 'react-navigation';
declare let window: any;

interface Props{
    navigation: any;
    colors?: Array<string>;
    hiddenControls?: Array<string>;
    onCancel?:  () => void;
    onDone?:  () => void;
    path: string;
    stickers?: Array<string>;
}
interface State{
    imageUrl: any;
}

export class ImageEditor extends Component<Props, State> {

    constructor(props: Props){
        super(props);

    }

    
  
    componentDidUpdate(){
        let imageUrl = this.props.navigation.getParam('imageUrl');
        let blob = this.props.navigation.getParam('blob');
        RNPhotoEditor.Edit({
            path: imageUrl,
            onDone: (d:any) => {
                console.log('on done', imageUrl);
                window.imageUrl = imageUrl;
                this.props.navigation.navigate('Goodtimes', {
                    imageUrl: 'file://' + imageUrl
                });
            },
            onCancel: () => {
                console.log('on cancel')
            }
        });

    }


    render() {
        return (
            <View style={styles.container}>
               
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    }
})

// @ts-ignore
export default withNavigation(ImageEditor);