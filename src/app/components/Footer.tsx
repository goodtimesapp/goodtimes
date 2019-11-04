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
            <Badge danger><Text>51</Text></Badge>
            <Icon name='happy' />
            <Text>Here</Text>
          </Button>
          <Button 
            onPress={() => this.props.navigation.navigate('DiscoverFeed')}>
            <Icon active name='md-boat' />
            <Text>Discover</Text>
          </Button>
          <Button onPress={() => this.props.navigation.navigate('Markers')}>
            <Icon name='md-people' />
            <Text>Friends</Text>
          </Button>
          <Button onPress={() => this.props.navigation.navigate('Profile')}>
            <Icon name='person' />
            <Text>Me!</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}

export default withNavigation(FooterComponent);