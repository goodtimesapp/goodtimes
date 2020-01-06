import React, { Component } from 'react';
import { StyleSheet, View, Button, ScrollView, PermissionsAndroid, Dimensions, Alert, Animated, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, List, Body, Thumbnail } from 'native-base';
// @ts-ignore
import { RADAR_KEY_API } from 'react-native-dotenv';
import { LocalChat } from './../chat/LocalChat';
import { getCurrentLocation, whereami } from './../../utils/location-utils';
import { ChatHeader } from './../chat/ChatHeader';
import { MapHeader } from './../chat/MapHeader';
import { ChatFooter } from './../chat/ChatFooter';
import { withNavigation } from 'react-navigation';
import { ShowBtn } from './../chat/ShowBtn';
import { connect } from 'react-redux';
import { State as ReduxState } from './../../reduxStore/index';
import {
  getUserSession,
  getProfileState,
  getUserName,
  putProfileSettings,
  getProfileSettings,
  profileSettingsSelector
} from './../../reduxStore/profile/profile.store';
import {
   getNearestPopulatedGeohash,
   startLocationWebSocket,
   placeState,
   State as PlaceStateModel
} from './../../reduxStore/places/place.store';
import { websocketsState, State as WebsocketsStateModel } from './../../reduxStore/websockets/websockets.store';
import { Profile } from './../../models/Profile';
import { mapStyle } from './Maps.Styles'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE = 41.958351;
const LONGITUDE = -87.668808;
const SPACE = 0.001;
const STICKY_HEADER_HEIGHT = 70;
const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 400;
const LocalChatScrollView = Animated.createAnimatedComponent(LocalChat);

interface State {
  latitude: any,
  longitude: any,
  location: any,
  test: any,
  error: any,
  paddingTop: any,
  markers: any,
  marginBottom: any;
  circle: any;
  isHeaderVisible: boolean;
  firstScroll: boolean;
  parallaxHeaderHeight: number;
  hasNewPost: boolean;
  isSettingUpWebsocket: boolean;
}

interface Props {
  navigation: any;
  profileSettingsSelector: Profile;
  placeState: PlaceStateModel;
  getNearestPopulatedGeohash: () => void;
  startLocationWebSocket: (geohash: string) => void;
  websocketsState: WebsocketsStateModel;
}

class Maps extends Component<Props, State> {

  static navigationOptions = {
    title: 'GeoFence Social',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      location: null,
      test: true,
      error: null,
      paddingTop: 0,
      markers: null,
      marginBottom: 0,
      circle: {
        center: {
          latitude: LATITUDE + SPACE,
          longitude: LONGITUDE + SPACE,
        },
        radius: 280,
      },
      isHeaderVisible: false,
      firstScroll: true,
      parallaxHeaderHeight: PARALLAX_HEADER_HEIGHT,
      hasNewPost: false,
      isSettingUpWebsocket: false
    };
    
  }


  componentWillMount() {
    this.setCurrentLocationOnLoad();
  }

  componentDidUpdate(nextState: any){
    // console.log(' The Maps componentDidUpdate =>', nextState);
    
    if (!this.props.websocketsState.websocket && this.props.placeState.geohash && !this.state.isSettingUpWebsocket){
      this.setState({
        isSettingUpWebsocket: true
      })
      console.log('null websocket...set one up here', this.props.placeState.geohash);
      this.props.startLocationWebSocket(nextState.placeState.geohash);
    }

    // clear setting up web socket flag
    if ( this.props.websocketsState.websocket !== nextState.websocketsState.websocket  && this.state.isSettingUpWebsocket){
      this.setState({
        isSettingUpWebsocket: false
      })
      console.log('done setting up websocket');
     
    }
   
  }


  setCurrentLocationOnLoad(){
    getCurrentLocation().then(async (location: any) => {
      // const geohash = Geohash.encode(location.latitude, location.longitude, 4); 
      this.setState({
        latitude: location.latitude,
        longitude: location.longitude,
        error: null,
        circle: {
          center: {
            latitude: location.latitude + SPACE,
            longitude: location.longitude + SPACE,
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

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ParallaxScrollView
          ref="parallaxScrollView"
          style={{ flex: 1, backgroundColor: 'transparent', overflow: 'hidden' }}
          backgroundColor="transparent"
          contentBackgroundColor="#283447"
          parallaxHeaderHeight={this.state.parallaxHeaderHeight}
          headerBackgroundColor="#283447"
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          backgroundSpeed={10}


          onChangeHeaderVisibility={(isHeaderVisible: boolean) => {
            if (isHeaderVisible) {
              this.setState({
                isHeaderVisible: false
              })
            } else {
              this.setState({
                isHeaderVisible: true,
                firstScroll: false
              })
            }
          }}

          renderForeground={() => {
            return (
              <View key="parallax-header" style={[styles.parallaxHeader, {
                height: this.state.parallaxHeaderHeight,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: this.state.paddingTop
              }]}>

                <MapView
                  showsUserLocation
                  showsMyLocationButton
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={this.getMapRegion()}
                  onMapReady={this._onMapReady}
                  customMapStyle={mapStyle}>
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
                    coordinate={this.getMapRegion()}>
                    <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                      <Thumbnail source={{ uri: 'https://banter-pub.imgix.net/users/nicktee.id' }} style={{ height: 52, width: 52 }} />
                    </View>
                  </Marker>

                  <Marker
                    title={"Helen"}
                    key={2}
                    coordinate={this.getMapRegion(0.002, 0.002)}>
                    <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                      <Thumbnail source={{ uri: 'https://avatars1.githubusercontent.com/u/1273575?s=40&v=4' }} style={{ height: 52, width: 52 }} />
                    </View>
                  </Marker>
                </MapView>
              </View>
            )
          }
          }

          renderFixedHeader={() => {

            if (!this.state.isHeaderVisible && this.props.profileSettingsSelector ) {
              return (
                <View key="fixed-header" style={styles.fixedSection}>                  
                  <MapHeader navigation={this.props.navigation} avatar={this.props.profileSettingsSelector.attrs.image}></MapHeader>
                </View>
              )
            } else {

              // this.props.navigation.navigate('LocalChat');
              return (
                  <View key="fixed-header" style={[styles.fixedSection, { backgroundColor: "rgba(15.7,20.4,27.8,0.7)" }]}>
                    <ChatHeader
                      navigation={this.props.navigation}
                      onScrollToTop={() => {
                        // @ts-ignore
                        this.refs.parallaxScrollView.scrollTo({ x: 0, y: 0 })
                      }}
                    ></ChatHeader>
                  </View>
              );
            }

          }}
        >
            <LocalChatScrollView navigation={this.props.navigation} getChats={null}  />
        </ParallaxScrollView>




        {
          this.state.hasNewPost
          ?   
            <TouchableOpacity style={{
              position: 'absolute',
              bottom: 80,
              alignSelf: 'center',
              marginBottom: 0,
              alignItems: 'center',
              width: '100%'
            }}>
              // @ts-ignore
              <ShowBtn text={"Show New"} navigation={null} />
            </TouchableOpacity>
          : 
            null
        } 

      
        <View style={{
          backgroundColor: "rgba(15.7,20.4,27.8,0.7)",
          height: 70,
          width: "100%",
          position: 'absolute',
          bottom: 0,
          left: 0,
          alignSelf: 'center',
          marginBottom: 0,
          borderTopEndRadius: 16,
          borderTopLeftRadius: 16
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


// Global State
const mapStateToProps: any = (state: ReduxState) => ({
  profileSettingsSelector: profileSettingsSelector(state.profile),
  placeState: placeState(state.places),
  websocketsState: websocketsState(state.websockets)
})
// Actions to dispatch
const mapDispatchToProps = {
  putProfileSettings: putProfileSettings,
  getProfileSettings: getProfileSettings,
  getNearestPopulatedGeohash: getNearestPopulatedGeohash,
  startLocationWebSocket: startLocationWebSocket
}
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)((withNavigation(Maps)))







