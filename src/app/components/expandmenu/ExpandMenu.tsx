import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity
} from 'react-native';
import { Icon, Button, Text } from 'native-base';
import ScalingButton from './ScalingButton';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface Props{
    frictionOpen?: number,
    frictionClose?: number,
    menuHeight?: number,
    menuWidth?: string,
    panelHeight?: number,
    borderRadius?: number,
    backgroundColor?: string,
    bodyColor?: string,  
    menuView: any,
    panelView: any
}
interface State{
    menu_expanded: boolean
}

export default class ExpandMenu extends Component<Props, State> {

  y_translate: any;   

  constructor(props: Props) {
    super(props);
    this.y_translate = new Animated.Value(0);
    this.state = {
      menu_expanded: false
    };
  }

  openMenu() {
    this.setState({
      menu_expanded: true
    }, () => {
      this.y_translate.setValue(0);
      Animated.spring(
        this.y_translate,
        {
          toValue: 1,
          friction: this.props.frictionOpen || 9
        }
      ).start();
    });
  }

  hideMenu() {
    this.setState({
      menu_expanded: false
    }, () => {
      this.y_translate.setValue(1);
      Animated.spring(
        this.y_translate,
        {
          toValue: 0,
          friction: this.props.frictionClose || 6
        }
      ).start();
    });
  }

  render() {
    
    const menu_moveY = this.y_translate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.calculatePanelHeightUnderground() ]
    });
    
    return (
      <View style={this.styles.container} >
        <View style={this.styles.body}></View>
        <Animated.View 
          style={[ 
            this.styles.footer_menu,
            {
              transform: [
                {
                  translateY: menu_moveY
                }
              ],
              zIndex: 3
            },
          ]}
        >
          {
            !this.state.menu_expanded &&
            <View style={[this.styles.tip_menu ]}>
                <TouchableOpacity onPress={ ()=> this.openMenu.bind(this)} style={{flex: 1}}>
                  <View>
                    {this.props.menuView}
                  </View>
                </TouchableOpacity>
            </View>
          } 
          
          {
            this.state.menu_expanded &&
            <View style={{flexDirection: 'column'}}>
              <ScalingButton onPress={ ()=> this.hideMenu.bind(this)} noDefaultStyles={true}>
                <Icon style={{ paddingTop: 16, fontSize: 44, color: 'white', marginBottom: 0 }}  name="close-circle-outline" />
              </ScalingButton>
              <View>
                    {this.props.panelView || null}
              </View>
            </View>
          }
        </Animated.View>
      </View>
    );
  }

  calculatePanelHeightUnderground(){
    if (!this.props.menuHeight || ! this.props.panelHeight){
        return -500
    }
    return -(this.props.panelHeight - this.props.menuHeight)
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    body: {
      flex: 1,
      backgroundColor: this.props.bodyColor || '#ccc',
    },
    footer_menu: {
      position: 'absolute',
      width: '100%',
      height: this.props.panelHeight || 550, 
      bottom: this.calculatePanelHeightUnderground(), 
      backgroundColor: this.props.backgroundColor ||'#1fa67a',
      alignItems: 'center',
      borderTopLeftRadius: this.props.borderRadius || 20,
      borderTopRightRadius: this.props.borderRadius || 20,
    },
    tip_menu: {
      flexDirection: 'row',
      padding: 10
    },
    button: {
      backgroundColor: '#fff'
    },
    button_label: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  });

}

