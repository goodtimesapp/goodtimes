import * as React from 'react'
import { Location } from '../../models/Location'
import {  StyleSheet } from 'react-native';
import { View, ListItem, Left, List, Icon, Right, Container, Button, Text } from 'native-base';
import * as radiks from 'radiks/src/index';
import * as blockstack from 'blockstack';
import HeaderComponent from '../Header';
import { material } from 'react-native-typography';



interface Props {
    locations: Location[],
    getLocations: () => void,
    createLocation: () => void
}
interface State { }

export default class LocationList extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props)
    }

    componentDidMount() {
        console.log('radiks', radiks);
        console.log('blockstack', blockstack);
    }

    listLocations = () => {
        fetch(
            'https://api.radar.io/v1/geofences', {
              method: 'GET',
              headers: {                
                'Authorization': 'prj_live_sk_8b17e9061544ac06ffe8160e230c3ce5c58e58ce',
                'Cache-Control': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
              }
            }
          ).then(response => response.json()).then(result => {
            console.log('get geofences', result);
          });
    }

    getReddit = () =>{
        fetch('https://reddit.com/.json', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                
            }
        }).then(response => response.json()).then(result => {
            console.log('reddit', result)
        });
    }

    render() {
        return (
            <Container>

                <HeaderComponent/>

                <Text style={material.display1}>Location List</Text>

                <List
                    dataArray={this.props.locations}
                    renderRow={(item, index) => {                
                        return (
                            <ListItem key={index}>
                                <Left>
                                    <Text>{item.description || item.tag || item.externalId}</Text>
                                </Left>
                                <Right>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </ListItem>
                        )
                    }}
                >
                </List>
                <List style={styles.stickyBottom}>
                    <ListItem>
                        <Button rounded bordered success onPress={() => this.listLocations() }><Text>List locations</Text></Button> 
                    </ListItem>
                    <ListItem>
                        <Button rounded bordered success  onPress={() => this.props.getLocations() }><Text>Show Locations!</Text></Button>
                    </ListItem>
                    <ListItem>
                        <Button rounded bordered success  onPress={() => this.props.createLocation() }><Text>Create location</Text></Button>
                    </ListItem>
                </List>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {

    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 22
    },
    heading: {
        padding: 10,
        fontSize: 44,
        height: 44,
        alignContent: "center"
    },
    stickyBottom:{
        
    }
})
