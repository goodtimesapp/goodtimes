import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import ExpandMenu from './expandmenu/ExpandMenu';
import { StyleProvider } from 'native-base';
import { Icon, Button, Text, Thumbnail } from 'native-base';
import Markers from './maps/Markers';
import { material } from 'react-native-typography';
import Tabs from './tabs/Tabs.Container';

export default class ExpandPage extends Component {
    render() {
        return (
            <View style={this.styles.container}>

                <View style={{
                    height: '78%'
                }}>
                    <Markers locations={[]} />
                </View>

                <ExpandMenu
                    frictionOpen={7}
                    frictionClose={6}
                    menuHeight={70}
                    menuWidth={'100%'}
                    panelHeight={550}
                    borderRadius={40}
                    bodyColor={'transparent'}
                    backgroundColor={'#2E7D32'}
                    menuView={
                        <View style={{flexDirection: 'row', justifyContent:'space-around', alignItems: 'center'}} >
                            <Button bordered light rounded >
                                <Thumbnail small source={{uri: 'https://banter-pub.imgix.net/users/nicktee.id'}} />
                                <Text>Nick</Text>
                            </Button>
                            <Text  style={[material.title, { color: 'white'}]}>SCHEDULE PICKUP</Text>
                        </View>
                    }
                    panelView={
                        <View>
                            <Tabs activeTabBarColor='white' />
                        </View> 
                    }
                />

                <ExpandMenu
                    frictionOpen={7}
                    frictionClose={6}
                    menuHeight={70}
                    menuWidth={'100%'}
                    panelHeight={550}
                    borderRadius={40}
                    bodyColor={'#2E7D32'}
                    backgroundColor={'#8BC34A'}
                    menuView={
                        <View style={{flexDirection: 'row', justifyContent:'space-around', alignItems: 'center'}} >
                            <Text  style={[material.title, { color: 'white'}]}>LOCATE DROP-OFF</Text>
                            <Button bordered light rounded >
                                <Text>J Fitty</Text>
                                <Thumbnail small source={{uri: 'https://media.bizj.us/view/img/10820856/jimfitterling*750xx771-1028-11-0.png'}} />
                            </Button>
                        </View>
                    }
                    panelView={
                        <View>
                            <Tabs activeTabBarColor='green' />
                        </View> 
                    }
                />

            </View>
        )
    }

    styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            
        },
        content: {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row'
          },
    });
}
