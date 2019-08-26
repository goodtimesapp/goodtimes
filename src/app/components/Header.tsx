
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

    openDrawer = () =>{
        this.props.navigation.openDrawer();
    }

    render() {
        return (
            <Header >
                <Left >
                    <Button transparent onPress={ () => this.push('Camera')  } >
                        <Icon name='camera' style={{color: 'grey'}} />
                    </Button>
                </Left>
                <Body>
                    <View>
                        <Image style={{width: 32, height: 32}} source={ require('./../assets/LOGO.png') } />
                    </View>
                </Body>
                
                <Right>
                    <Button transparent onPress={ () => this.openDrawer()  } style={{marginTop:10}}>
                        <Badge style={{ position: 'absolute' }}><Text>2</Text></Badge>
                        <Icon name='chatboxes' style={{color: 'grey'}} />
                    </Button>
                </Right>
            </Header>

        );
    }
}

export default withNavigation(HeaderComponent)