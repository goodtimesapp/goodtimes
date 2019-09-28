
import React, { Component } from 'react'
import { StyleSheet, Linking, ScrollView, Platform, TouchableOpacity, Dimensions } from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, View, Footer, Content, FooterTab, Badge, StyleProvider } from "native-base";
import Markers from "./test/Markers";
import Camera from './camera/Camera.Container';
import FooterComponent from './Footer';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createDrawerNavigator, SafeAreaView, DrawerItems } from 'react-navigation';
import LocationsList from "./location/LocationsList.Container";
import Chat from './chat/Chat';
import Blockstack from './blockstack/Blockstack';
import { ProfilePage } from './blockstack/Index';
import Splash from './Splash';
import Bar from './../components/bottombar/bar';
import ExpandPage from './ExpandPage';
import Goodtimes from './Goodtimes';
import ImageEditor from './image/ImageEditor';
const { width, height } = Dimensions.get('screen');


const MainNavigator = createStackNavigator(
    {
        Index: {
            screen: Goodtimes,
            navigationOptions: {
                header: null
            },
        },
        Splash: { 
            screen: Splash,
            navigationOptions: {
                header: null
            },
        },
        Camera: { 
            screen: Camera,
            navigationOptions: {
                header: null,
            },
        },
        ImageEditor: { 
            screen: ImageEditor,
            navigationOptions: {
                header: null,
            },
        },
        Chat: { 
            screen: Chat,
            navigationOptions: {
                header: null,
            },
        },
        Bar: { 
            screen: Bar,
            navigationOptions: {
                header: null
            },
        },
        ExpandPage: { 
            screen: ExpandPage,
            navigationOptions: {
                header: null
            },
        },
    },
    {
        initialRouteName: "Index"
    }
);


const Tabs = createBottomTabNavigator({
    Home: { screen: MainNavigator },
    LocationsList: { screen: LocationsList },
    Blockstack: { screen: Blockstack },
    Markers: { screen: Markers },
    Goodtimes: {screen: Goodtimes},
    Profile: { screen: ProfilePage },
},
    {
        tabBarComponent: props => {
            return (
               <View style={{backgroundColor: 'transparent'}}>
                   <FooterComponent />
               </View> 
               
            );
        }
    }
);



const DrawerRight = createDrawerNavigator({
    Home: { screen: Tabs },
}, {
    drawerBackgroundColor: 'white',
    overlayColor: 'white',
    contentOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: 'white',
    },
    drawerWidth: width,
    drawerPosition: 'right',
    drawerType: "slide",
    contentComponent: (props:any) => (
        <ScrollView>
          <SafeAreaView style={{flex: 1}} forceInset={{ top: 'always', horizontal: 'never' }}>
            <Chat />
          </SafeAreaView>
        </ScrollView>
    )
})

export default createAppContainer(DrawerRight);


