import React, { Component } from "react";
import { Button, Text, Icon, Footer, FooterTab, Badge } from "native-base";
import { withNavigation } from 'react-navigation';
import { TouchableOpacity } from "react-native";


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
            <Button active badge vertical>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Goodtimes')} style={{alignItems: 'center'}}>
                  <Badge danger><Text>51</Text></Badge>
                  <Icon name='happy' />
                  <Text>Here</Text>
                </TouchableOpacity>
            </Button>
            <Button>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('DiscoverFeed')} style={{alignItems: 'center'}}>
                <Icon active name='md-boat' />
                <Text>Discover</Text>
              </TouchableOpacity>
            </Button>
          <Button>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Markers')} style={{alignItems: 'center'}}>
              <Icon name='md-people' />
              <Text>Friends</Text>
            </TouchableOpacity>
          </Button>
          <Button>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')} style={{alignItems: 'center'}}>
              <Icon name='person' />
              <Text>Me!</Text>
            </TouchableOpacity>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}

export default withNavigation(FooterComponent);