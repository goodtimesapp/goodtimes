import React, { Component } from 'react';
import {  View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {Text} from 'native-base';
import { material } from 'react-native-typography';

export default class Amount extends Component {
    render() {
        return (
            
                 <TouchableOpacity
                    onPress={() => {
                        
                    }}
                    style={{width: 120,
                     height: 60,
                     position:'absolute',
                     top: 16,
                     left:0,
                     backgroundColor: "#03A9F4",
                     borderBottomRightRadius: 40,
                     borderTopRightRadius: 40,
                     zIndex: 2
                     }}>
                    <View style={styles.content}>
                        
                        <Text style={[material.display1, { 
                            color: 'white',
                            paddingRight:5
                        } ]}>31</Text>
                         <Image style={{width: 32, height: 32}} source={ require('./../../assets/logowhite.png') } />
                    </View>
                    
                </TouchableOpacity>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    content: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row'
    },
    form: {
      width: '100%'
    },
    item: {}
  });
