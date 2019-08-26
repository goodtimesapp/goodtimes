import React, { Component } from "react";
import { Button, Text, Icon, Footer, FooterTab, Badge } from "native-base";
import { withNavigation } from 'react-navigation';


interface Props {
  navigation: any
}
interface State {

}

class FooterComponent extends Component<Props, State> {


  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Footer >
        <FooterTab>
          <Button active badge vertical
            onPress={() => this.props.navigation.navigate('Goodtimes')}>
            <Badge><Text>51</Text></Badge>
            <Icon name='happy' />
            <Text>Goodtimes</Text>
          </Button>
          <Button 
            onPress={() => this.props.navigation.navigate('Markers')}>
            <Icon active name='navigate' />
            <Text>Discover</Text>
          </Button>
          <Button onPress={() => this.props.navigation.navigate('LocationsList')}>
            <Icon name='person' />
            <Text>Me!</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}

export default withNavigation(FooterComponent);