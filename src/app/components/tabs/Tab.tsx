import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, UIManager, findNodeHandle, LayoutRectangle } from 'react-native';
import { Icon } from 'native-base';
import { makeUUID4 } from 'blockstack';
import { render } from 'node-sass';


interface Props{
    slide: any;
    icon: string;
    active?: boolean;
    slideTab?: any;
    color: string;
    x: number;
    activeTabBarColor?: string
}
interface State{
    measurements: LayoutRectangle;
}

export default class Tab extends Component<Props, State> {

    constructor(props: Props){
        super(props);
    }


    render(){
        return (
        
            <TouchableOpacity style={this.styles.tab} onPress={(e) => this.props.slide(( this.props.x ))}  >
                <View >
                    <Icon style={this.styles.text} name={this.props.icon} />
                    {
                        this.props.active &&
                        <Animated.View style={[this.props.slideTab.getLayout(), this.styles.activeTabBar]} >
                        </Animated.View>
                    }
                </View>
                
            </TouchableOpacity>
        )
    }

    styles = StyleSheet.create({
        tab: {
            height: 60,
            backgroundColor: this.props.color,
            flexGrow: 20,
            padding: 10,
            paddingBottom: 0,
            flexDirection: 'column',
        },
        text: {
            fontSize: 28,
            color: "white",
            textAlign: "center"
        },
        activeTabBar: {
            backgroundColor: this.props.activeTabBarColor || 'green',
            height: 10,
            borderRadius: 20,
            marginTop: 25,
            width: '100%'
        },
        button: {
            paddingTop: 24,
            paddingBottom: 24,
        },
        buttonText: {
            fontSize: 24,
            color: '#333',
        }
    })
    
}


