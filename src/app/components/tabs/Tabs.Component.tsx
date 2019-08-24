import * as React from 'react'
import { Tabs } from '../../models/Tabs'
import { StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback, TextBase, findNodeHandle } from 'react-native';
import { View, ListItem, Left, List, Icon, Right, Container, Button, Text } from 'native-base';
import Tab  from './Tab';


interface Props {
    tabs: Tabs[],
    getTabs: () => void,
    createTabs: () => void,
    activeTabBarColor: string;
}
interface State {
    x: number,
    y: number,
    width: number,
    height: number,
    touchedTab : any
 }

export default class TabsComponent extends React.Component<Props, State> {

    slideTab: any;
    tab1: any;
    tab2: any;
    tab3: any;
    tab4: any;
    
    constructor(props: Props) {
        super(props)
        this.slideTab = new Animated.ValueXY({x: 0, y: 0})
    }

    componentDidMount() {

    }

    _slide = (x? :any) => {
        Animated.spring(this.slideTab, {
          toValue: {x: x , y: 0},
        }).start();
    }

    calculateChildX = (e: any) => {
        
    }

    render() {
        return (
            <View style={{ width: '100%', borderColor: 'white' }}>
                <Text/>
                <View style={styles.container}  >
                    <Tab slide={this._slide} icon="person" active={true} slideTab={this.slideTab} color="transparent" x={0} activeTabBarColor={this.props.activeTabBarColor} />
                    <Tab slide={this._slide} icon="clock" color="transparent" slideTab={this.slideTab} x={90} activeTabBarColor={this.props.activeTabBarColor}/>
                    <Tab slide={this._slide} icon="wallet"  color="transparent" slideTab={this.slideTab} x={185} activeTabBarColor={this.props.activeTabBarColor}  />
                    <Tab slide={this._slide} icon="cog" color="transparent" slideTab={this.slideTab} x={280} activeTabBarColor={this.props.activeTabBarColor} /> 
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'flex-end',
        backgroundColor: "transparent",
        alignItems: 'flex-start',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10
    },
    tab: {
        height: 60,
        backgroundColor: 'transparent',
        flexGrow: 20,
        padding: 10,
        paddingBottom: 0,
        flexDirection: 'column',
        borderColor: 'white'
    },
    text: {
        fontSize: 28,
        color: "white",
        textAlign: "center"
    },
    activeTab: {
        backgroundColor: 'green',
        height: 10,
        borderRadius: 20,
        marginTop: 12
    },
    button: {
        paddingTop: 24,
        paddingBottom: 24,
      },
    buttonText: {
        fontSize: 24,
        color: '#333',
      }
})
