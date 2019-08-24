
import React, { Component } from 'react'
import  { Image } from 'react-native'
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text, View, Footer, Content, FooterTab, Badge, StyleProvider } from "native-base";
import { withNavigation } from 'react-navigation';
import { StackActions } from 'react-navigation';

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

    render() {
        return (
            <Header style={{ marginTop: -5, height: 64 }}>
                <Left style={{ marginTop: -10 }}>
                    <Button transparent onPress={ () => this.push('Camera')  } >
                        <Icon name='trash' style={{color: 'grey'}} />
                        <Icon name='add' style={{color: 'grey'}} />
                    </Button>
                </Left>
                <Body style={{ marginTop: -10 }}>
                    <View>
                        <Image style={{width: 32, height: 32}} source={ require('./../assets/LOGO.png') } />
                    </View>
                </Body>
                
                <Right>
                    <Button transparent>
                        <Badge style={{ position: 'absolute' }}><Text>2</Text></Badge>
                        <Icon name='notifications' style={{color: 'grey'}} />
                    </Button>
                </Right>
            </Header>

        );
    }
}

export default withNavigation(HeaderComponent)