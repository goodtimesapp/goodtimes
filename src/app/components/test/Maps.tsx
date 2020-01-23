import React, { Component } from 'react';
import { StyleSheet, View, Button, ScrollView, PermissionsAndroid, Dimensions, Alert, Animated, TouchableOpacity, AppState } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle, Polygon } from 'react-native-maps';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, List, Body, Thumbnail } from 'native-base';
// @ts-ignore
import { RADAR_KEY_API } from 'react-native-dotenv';
import LocalChat from './../chat/LocalChat';
import { getCurrentLocation, whereami } from './../../utils/location-utils';
import ChatHeader from './../chat/ChatHeader';
import MapHeader from './../chat/MapHeader';
import ChatFooter from './../chat/ChatFooter';
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
  getMyCurrentLocation,
  placeState,
  State as PlaceStateModel
} from './../../reduxStore/places/place.store';
import { websocketsState, State as WebsocketsStateModel } from './../../reduxStore/websockets/websockets.store';
import { Profile } from './../../models/Profile';
import { mapStyle } from './Maps.Styles';
import _ from 'lodash';
import { workerData } from 'worker_threads';
import * as turf from '@turf/turf';
import { postsState, State as PostsStateModel, initialState } from './../../reduxStore/posts/posts.store';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE = 41.958351;
const LONGITUDE = -87.668808;
const SPACE = 0.000001;
const STICKY_HEADER_HEIGHT = 70;
const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 400;
const LocalChatScrollView = Animated.createAnimatedComponent(LocalChat);
const RADIUS_ZOOMER_DELTA = (width / LATITUDE_DELTA)

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
  region: any;
  polygon: any;
  currentLocation: any;
}

interface Props {
  navigation: any;
  profileSettingsSelector: Profile;
  placeState: PlaceStateModel;
  getNearestPopulatedGeohash: () => void;
  startLocationWebSocket: (geohash: string) => void;
  getMyCurrentLocation: () => void;
  websocketsState: WebsocketsStateModel;
  postsState: PostsStateModel
}

class Maps extends Component<Props, State> {

  map: any;

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
      isSettingUpWebsocket: false,
      region: null,
      polygon: null,
      currentLocation: null
    };
  }

  componentDidMount() {
    this.zoomToMyCurrentLocation();
    this.props.getMyCurrentLocation();
    AppState.addEventListener('change', this._handleAppStateChange);
  }


  componentWillMount() {
    this.setCurrentLocationOnLoad();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps: Props, nextState: State) {
    // console.log(' The Maps componentDidUpdate =>', nextState);

    if (!this.props.websocketsState.websocket && this.props.placeState.geohash && !this.state.isSettingUpWebsocket) {
      this.openWebSocket(prevProps.placeState.geohash);
    }

    // clear setting up web socket flag
    if (this.props.websocketsState.websocket !== prevProps.websocketsState.websocket && this.state.isSettingUpWebsocket) {
      this.setState({
        isSettingUpWebsocket: false
      })
      console.log('done setting up websocket');
    }

    if (this.props.postsState !== prevProps.postsState) {
      debugger;
      this.setState({
        markers: this.props.postsState.markers
      })
    }

  }

  zoomToMyCurrentLocation() {
    getCurrentLocation().then((location: any) => {
      console.log('current loc', location);
      let markers = [{
        name: 'Nick',
        coordinate: {
            latitude:location.latitude,
            longitude: location.longitude
        },
        image: 'https://banter-pub.imgix.net/users/nicktee.id'
    } ];
      // if (this.state.markers){
      //   markers = [...this.state.markers, location]
      // }
      this.setState({
        region: null,
        markers: markers
      });
      let r = {
        ...location,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
      this.map.animateToRegion(r);

      setTimeout((r) => {
        this.setState({
          currentLocation: location,
          region: r
        });
      }, 2000);
    });
  }

  _handleAppStateChange = (nextAppState: any) => {

    switch (nextAppState) {
      case 'active': {
        console.log('activated');
        // check to make sure you have an active websocket if you are logged in
        debugger;
        this.openWebSocket(this.props.placeState.geohash);
        break;
      }
      case 'inactive': {
        console.log('inactive');
        break;
      }
      case 'background': {
        console.log('background');
        break;
      }
      default:
        break;
    }

  };


  openWebSocket(geohash: string) {
    this.setState({
      isSettingUpWebsocket: true
    })
    console.log('null websocket...set one up here', this.props.placeState.geohash);
    this.props.startLocationWebSocket(geohash);
  }

  setCurrentLocationOnLoad() {
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
          radius: width,
        }
      });

      this.calcPoints();

    });
  }

  calcPoints() {
    let center = [this.state.circle.center.latitude, this.state.circle.center.longitude];
    let options: any = {

    };
    let radius = this.state.circle.radius;
    let region: any = turf.circle(center, radius, options);

    let inBounds = this.isPointInRegion(center, region);

    // this.setState({
    //   polygon: region.geometry.coordinates[0].map( ( coord:any )=>{ return {latitude: coord[0], longitude: coord[1] } } )
    // })
  }




  getMapRegion = (scewLat?: number, scewLong?: number) => {
    // if (scewLat) {
    //   return {
    //     latitude: 47.122036 + scewLat,
    //     longitude: -88.564358 + scewLong,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA
    //   }
    // }
    return {
      latitude: 47.122036,
      longitude: -88.564358,
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


  onRegionChangeComplete(region: any) {

    setTimeout(() => {
      let radius = this.calculateRadiusForMapsAspectRatio(region.latitudeDelta, region.longitudeDelta);
      this.setState({
        region: {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
        },
        circle: {
          center: {
            latitude: region.latitude,
            longitude: region.longitude,
          },
          radius: radius
        }
      });
      // console.log('onRegionChangeComplete', data, this.state.region, this.state.circle);
    }, 2)

  }

  calculateRadiusForMapsAspectRatio(latitudeDelta: number, longitudeDelta: number) {
    let windowWidthPaddedInMapUnits = (width - 100) * 100;
    let circleAspectRatio = (latitudeDelta + longitudeDelta) / 2;
    let radius = _.round(circleAspectRatio * windowWidthPaddedInMapUnits);
    return radius;
  }

  isPointInRegion(point: any, region: any) {
    let isInBounds = turf.booleanPointInPolygon(point, region);
    return isInBounds;
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
                  ref={map => this.map = map}
                  showsUserLocation
                  showsMyLocationButton
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={this.state.region}
                  onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
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
                  {/* {
                    this.state.polygon
                    ? <Polygon
                        coordinates={this.state.polygon}
                        fillColor="rgba(98, 31.8, 19.2, 0.3)"
                        strokeColor="#fa5131"
                        zIndex={2}
                        strokeWidth={2}
                    />
                    : null
                  }
                    */}
                  {/* <Marker
                    title={"Julia"}
                    key={1}
                    coordinate={this.getMapRegion()}>
                    <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                      <Thumbnail source={{ uri: 'https://banter-pub.imgix.net/users/nicktee.id' }} style={{ height: 52, width: 52 }} />
                    </View>
                  </Marker> */}


                  {/* <Marker
                    title={"Julia"}
                    key={1}
                    coordinate={this.getMapRegion()}>
                    <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                      <Thumbnail source={{ uri: 'https://banter-pub.imgix.net/users/nicktee.id' }} style={{ height: 52, width: 52 }} />
                    </View>
                  </Marker> */}

                  {
                    this.state.markers
                    ?
                      this.state.markers.map((item: any, i: number) => {
                        return <Marker
                          title={item.name}
                          key={i}
                          coordinate={item.coordinate}>
                          <View style={{ backgroundColor: "#344155", height: 52, width: 52, borderRadius: 26, marginEnd: 16, alignSelf: 'flex-end' }}>
                            <Thumbnail source={{ uri: item.image }} style={{ height: 52, width: 52 }} />
                          </View>
                        </Marker>

                      })
                    : null
                  }



                </MapView>
              </View>
            )
          }
          }

          renderFixedHeader={() => {

            if (!this.state.isHeaderVisible && this.props.profileSettingsSelector) {
              return (
                <View key="fixed-header" style={styles.fixedSection}>
                  <MapHeader avatar={this.props.profileSettingsSelector.attrs.image}></MapHeader>
                </View>
              )
            } else {

              // this.props.navigation.navigate('LocalChat');
              return (
                <View key="fixed-header" style={[styles.fixedSection, { backgroundColor: "rgba(15.7,20.4,27.8,0.7)" }]}>
                  <ChatHeader
                    onScrollToTop={() => {
                      // @ts-ignore
                      this.refs.parallaxScrollView.scrollTo({ x: 0, y: 0 })
                    }}
                  ></ChatHeader>
                </View>
              );
            }
          }}>

          <LocalChatScrollView postsState />
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

          <ChatFooter placeState={this.props.placeState} ></ChatFooter>

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
  websocketsState: websocketsState(state.websockets),
  postsState: postsState
})
// Actions to dispatch
const mapDispatchToProps = {
  putProfileSettings: putProfileSettings,
  getProfileSettings: getProfileSettings,
  getNearestPopulatedGeohash: getNearestPopulatedGeohash,
  startLocationWebSocket: startLocationWebSocket,
  getMyCurrentLocation: getMyCurrentLocation
}
// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)((withNavigation(Maps)))







