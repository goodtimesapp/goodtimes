import React, { Component } from 'react';
import { StyleSheet, View, Button, ScrollView, PermissionsAndroid } from 'react-native';
// @ts-ignore
import Radar from 'react-native-radar';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, List, Body, Thumbnail } from 'native-base';
// @ts-ignore
import { RADAR_KEY_API } from 'react-native-dotenv';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 41.958351;
const LONGITUDE = -87.668808;

interface State {
    latitude: any,
    longitude: any,
    location: any,
    datas: any,
    test: any,
    error: any,
    paddingTop: any,
    markers: any,
    marginBottom: any;
}

interface Props {

}

export default class Maps extends Component<Props, State> {

    static navigationOptions = {
        title: 'GeoFence Social',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            location: null,
            datas: [
                { tag: 'Starbucks' },
                { tag: 'Meetup' },
                { tag: 'Tiny Tap' },
                { tag: 'Merch Mart' },
                { tag: 'Work' }
            ],
            test: true,
            error: null,
            paddingTop: 0,
            markers: null,
            marginBottom: 0
        };
    }


    async componentWillMount() {
        this.startRadar();
        this.getCurrentLocation();
        let geos = await this.getGeoFences();
        this.setState({
            datas: geos.geofences
        });
    }

    getCurrentLocation = () =>{
        navigator.geolocation.getCurrentPosition(
            position => {
              console.warn(position);
              this.setState({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
              error: null
             });
           },
        (error) => {
            this.setState({ error: error.message });
            console.log('GeoLocation error', error);
        },
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
        );
    }

    startRadar = () => {

        Radar.getPermissionsStatus().then((status: any) => {
            if (status === "DENIED") {
                Radar.requestPermissions(true);
            } else {

                //Radar.setPlacesProvider('facebook');
                Radar.trackOnce().then((result: any) => {
                    console.log(result);
                    // do something with result.location, result.events, result.user.geofences
                    //alert(result.user.geofences[0].tag);
                }).catch((err: any) => {
                    // optionally, do something with err
                    console.log(err);
                });
                // alert('started geo fence');
                Radar.startTracking();
            }
        });
    }


    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });


    start = () => {
        Radar.startTracking();
        console.log('started geo fencing');
    };

    stop = () => {
        Radar.stopTracking();
        console.log('stopped geo fencing');
    };

    trackOnce = () => {
        Radar.trackOnce().then((result: any) => {
            // do something with result.location, result.events, result.user.geofences
            console.warn(result.user.geofences);
            this.setState({
                datas: result.user.geofences
            }) ;

        }).catch((err: any) => {
            // optionally, do something with err
        });
    }

    gotoGeoFence = (id: any) => {

    }

    getGeoFences = async () => {


        // curl https://api.radar.io/v1/geofences   -H "Authorization: prj_live_sk_8b17e9061544ac06ffe8160e230c3ce5c58e58ce"
        try {
            let response = await fetch(
                'https://api.radar.io/v1/geofences ', {
                    method: 'GET',
                    headers: {
                        Authorization: RADAR_KEY_API,
                    }
                }
            );
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }

    _onMapReady = () => {
        this.setState({marginBottom: 0});
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          this.setState({ paddingTop: 0 });
        });
    }



    render() {
        //const { navigate } = this.props.navigation;
   
            return (

                <ParallaxScrollView
                    backgroundColor="transparent"
                    contentBackgroundColor="transparent"
                    parallaxHeaderHeight={550}
                    renderForeground={() => (
                        <View style={{ height: 550, flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: this.state.paddingTop }}>
                            <MapView
                                showsUserLocation
                                showsMyLocationButton
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={styles.map}
                                region={this.getMapRegion()}
                                onMapReady={this._onMapReady}>
                                    <Marker coordinate={this.getMapRegion()} />
                            </MapView>
                        </View>
                    )}>

                    <View style={{
                        backgroundColor: '#ECEFF1',
                        borderRadius: 25
                    }}>



                        <Container style={{
                            marginTop: 16,
                            marginBottom: 16,
                            backgroundColor: '#ECEFF1',
                        }}>
                            <Text></Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.radioScrollView}>
                                <List horizontal={true}
                                    keyExtractor={( item: any, index: any) => 'key' + index}
                                    dataArray={ this.state.datas } 
                                    renderRow={data =>
                                        
                                        <View style={styles.card}>
                                            <Thumbnail large source={{uri: 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw//avatar-0'}} />

                                            <Text uppercase style={styles.text}>
                                                {data.externalId || data.description}
                                            </Text>
                                        </View>
                                    }
                                >
                                </List>
                            </ScrollView>

                            <Text>lat: {this.state.latitude}</Text>
                            <Text>long: {this.state.longitude}</Text>
                            <Text></Text>
                            <Button
                                onPress={this.start}
                                title="Start"
                                color="#841584"
                                accessibilityLabel="Learn more about this purple button"
                            />
                            <Text></Text>
                            <Button
                                onPress={this.stop}
                                title="Stop"
                                color="#841584"
                                accessibilityLabel="Learn more about this purple button"
                            />
                            <Text></Text>
                            <Button
                                onPress={this.trackOnce}
                                title="Track Once"
                                color="#841584"
                                accessibilityLabel=""
                            />

                            {/* <Button
                                title="Go to Social"
                                onPress={() => navigate('Social', { name: 'Jane' })}
                            /> */}


                        </Container>



                    </View>
                </ParallaxScrollView>
            );

        // } else {

        //     return (
        //         <View>
        //             <Text>Loading..</Text>
        //             <Text>Location: {this.state.loca}</Text>
        //         </View>

        //     )
        // }
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignContent: 'stretch'
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    card:{
        width: 100,
        height: 100
    }, 
    radioScrollView:{

    },
    text: {

    }
});

