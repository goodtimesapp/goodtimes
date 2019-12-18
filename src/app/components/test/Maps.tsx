import React, { Component } from 'react';
import { StyleSheet, View, Button, ScrollView, PermissionsAndroid, Dimensions } from 'react-native';
// @ts-ignore
import Radar from 'react-native-radar';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, List, Body, Thumbnail } from 'native-base';
// @ts-ignore
import { RADAR_KEY_API } from 'react-native-dotenv';
import { LocalChat } from './../chat/LocalChat';
import { getCurrentLocation, whereami } from './../../utils/location-utils';
import { ChatHeader } from './../chat/ChatHeader';
import { ChatFooter } from './../chat/ChatFooter';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 41.958351;
const LONGITUDE = -87.668808;
const SPACE = 0.001;
const STICKY_HEADER_HEIGHT = 70;
const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 400;

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
  circle: any;
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
      marginBottom: 0,
      circle: {
        center: {
          latitude: LATITUDE + SPACE,
          longitude:  LONGITUDE + SPACE,
        },
        radius: 280,
      }
    };
  }


  componentWillMount() {

    getCurrentLocation().then( async (location: any) =>{
      // const geohash = Geohash.encode(location.latitude, location.longitude, 4); 
      this.setState({
        latitude: location.latitude,
        longitude: location.longitude,
        error: null,
        circle: {
          center: {
            latitude: location.latitude + SPACE,
            longitude:  location.longitude + SPACE,
          },
          radius: 325,
        }
      });
    });
  }


  getMapRegion = (scewLat?: number, scewLong?: number) => {
    if (scewLat) {
      return {
        latitude: this.state.latitude + scewLat,
        longitude: this.state.longitude + scewLong,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
    }
    return {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }
  };

 
  _onMapReady = () => {
    this.setState({ marginBottom: 0 });
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(granted => {
        this.setState({ paddingTop: 0 });
      });
  }



  render() {

    return (
      
      <View style={{flex:1,  flexDirection: 'row'}}>
      <ParallaxScrollView
       style={{ flex: 1, backgroundColor: 'transparent', overflow: 'hidden' }}
        backgroundColor="transparent"
        contentBackgroundColor="#283447"
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        headerBackgroundColor="#283447"
        stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
        backgroundSpeed={10}
      
        renderForeground={() => (
          <View key="parallax-header"  style={[styles.parallaxHeader, { height: PARALLAX_HEADER_HEIGHT, flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: this.state.paddingTop }]}>

            <MapView
              showsUserLocation
              showsMyLocationButton
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={this.getMapRegion()}
              onMapReady={this._onMapReady}
              customMapStyle={mapStyle}
            >
              <Circle
                  center={this.state.circle.center}
                  radius={this.state.circle.radius}
                  fillColor="rgba(98, 31.8, 19.2, 0.3)"
                  strokeColor="#fa5131"
                  zIndex={2}
                  strokeWidth={2}
                />
              <Marker
                title={"Julia"}
                key={1}
                coordinate={this.getMapRegion()}
              >
                <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                  <Thumbnail source={{ uri: 'https://primalinformation.com/wp-content/uploads/2019/10/Julia-Rose.jpg' }} style={{ height: 52, width: 52 }} />
                </View>
              </Marker>

              <Marker
                title={"Helen"}
                key={2}
                coordinate={this.getMapRegion(0.002, 0.002)}
              >
                <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                  <Thumbnail source={{ uri: 'https://i.pinimg.com/originals/25/d6/5d/25d65d189c753c2efc2795fc75a83b7a.jpg' }} style={{ height: 52, width: 52 }} />
                </View>
              </Marker>
            </MapView>
          </View>
        )}


        
          
        renderFixedHeader={() => (
            <View key="fixed-header" style={styles.fixedSection}>
              <ChatHeader navigation={null}></ChatHeader>
            </View> 
        )}
        
        >

        <View style={{
          
        }}>


          <LocalChat navigation={null}></LocalChat>

          {/* <Container style={{
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
                            /> 


                        </Container>*/}



        </View>


      </ParallaxScrollView>    




      <View style={{
          backgroundColor: "rgba(15.7,20.4,27.8,0.7)",
          height: 70,
          width: "100%",
          position: 'absolute',
          bottom: 0,
          left: 0,
          alignSelf: 'center',
          marginBottom: 0
        }}>
            <ChatFooter navigation={null} ></ChatFooter>
        </View>

      </View>  
    );

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
  card: {
    width: 100,
    height: 100
  },
  radioScrollView: {

  },
  text: {

  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100,
  },
  stickySection: {
    height: 70,
    width: '100%',
    justifyContent: 'flex-end',
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0
  },
  fixedSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: '100%',
    height: STICKY_HEADER_HEIGHT,
    backgroundColor: "transparent"
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 2,
    width: '100%',
    height: STICKY_HEADER_HEIGHT,
    backgroundColor: "transparent"
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
});


const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#2c333d',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

