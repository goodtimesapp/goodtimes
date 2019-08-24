
import React, { Component } from 'react'
import { StyleSheet, Linking, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, View, Footer, Content, FooterTab, Badge, StyleProvider } from "native-base";
import Markers from "./test/Markers";
import Camera from './camera/Camera.Container';
import FooterComponent from './Footer';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import LocationsList from "./location/LocationsList.Container";
import Chat from './chat/Chat';
import Blockstack from './blockstack/Blockstack';
import Splash from './Splash';
import Bar from './../components/bottombar/bar';
import ExpandPage from './ExpandPage';


const MainNavigator = createStackNavigator(
    {
        Index: {
            screen: Markers,
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
        initialRouteName: "ExpandPage"
    }
);


const Tabs = createBottomTabNavigator({
    Home: { screen: MainNavigator },
    LocationsList: { screen: LocationsList },
    Chat: { screen: Chat },
    Blockstack: { screen: Blockstack },
    Markers: { screen: Markers },
},
    {
        tabBarComponent: props => {
            return (
               <View style={{backgroundColor: '#8BC34A'}}>
                   <FooterComponent />
               </View> 
               
            );
        }
    }
);

export default createAppContainer(Tabs);