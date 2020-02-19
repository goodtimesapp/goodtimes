
import React, { Component } from 'react'
import  { Image, TouchableOpacity } from 'react-native'
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, View, Footer, Content, FooterTab, Badge, StyleProvider } from "native-base";
import { withNavigation } from 'react-navigation';
import { StackActions } from 'react-navigation';
// @ts-ignore
import theme from '@theme/variables/commonColor.js';

interface Props {
    navigation: any, 
}
interface State {
    showIntro: boolean
}


class HeaderComponent extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showIntro: true
        }
    }

    
    componentDidMount() {
       
       if (this.state.showIntro === true){
           // show intro modal
           this.setState({
               showIntro: false
           })
           // this.push('Intro');
       }

    }

    push = (route: string) =>{
        const pushAction = StackActions.push({
            routeName: route,
              params: {
                myUserId: 9,
              },
        });
        this.props.navigation.dispatch(pushAction);
    }

    openDrawer = () =>{
        this.props.navigation.openDrawer();
    }

    render() {
        return (
            <Header >
                <Left >
                    <Button transparent >
                        <TouchableOpacity onPress={ () => this.push('Camera')  } >
                            <Icon primary name='camera' style={{color: '#4FC3F7'}} />
                        </TouchableOpacity>
                    </Button>
                </Left>
                <Body>
                    <TouchableOpacity>
                        <Image style={{width: 32, height: 32}} source={ require('./../assets/goodtimes.png') } />
                    </TouchableOpacity>
                </Body>
                
                <Right>
                    <TouchableOpacity onPress={ () => this.openDrawer()  } style={{marginRight: 12}} >
                        <Icon name='chatboxes' style={{color: '#78909C', fontSize: 32}} />
                        <View style={{position: 'absolute',  zIndex: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: theme.brandDanger, top: -4, left: 16, alignItems: 'center' }}>
                            <Text style={{color: 'white'}}>2</Text>
                        </View>
                    </TouchableOpacity>
                </Right>
            </Header>

        );
    }
}

export default withNavigation(HeaderComponent)