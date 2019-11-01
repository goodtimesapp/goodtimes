import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Image,
    Dimensions,
    PermissionsAndroid,
    Alert,
    TouchableHighlight,
    TouchableOpacity
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Fab, Icon, Button, Container, Content, Item } from 'native-base';
import MapViewDirections from 'react-native-maps-directions';
// @ts-ignore
import { GOOGLE_MAPS_APIKEY } from 'react-native-dotenv';
import { connect } from 'react-redux';
import { Location } from './../../models/Location';
import HeaderComponent from './../Header';
import Amount from '../plasticoin/Amount';
import { rando } from './../../utils/profile'

const Images = [
    { uri: "https://www.aviewoncities.com/img/chicago/kveus8442b.jpg" },
    { uri: "https://urbanmatter.com/chicago/wp-content/uploads/2018/09/City-Winery-Domes-at-night-2017.04.27-01-Paul-Crisanti.jpg" },
    { uri: "https://media-cdn.tripadvisor.com/media/photo-s/01/1f/de/c5/the-merchandise-mart.jpg" },
    { uri: "https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw//avatar-0" }
]

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const origin = { latitude: 41.958582, longitude: -87.668744 };
const destination = { latitude: 41.958582, longitude: -87.66874467 };

interface Props {
    locations: Location[]
}

interface State {
    markers: any;
    activeFab: any;
    marginBottom: any;
    paddingTop: any;
    region: any;
}


export default class Markers extends Component<Props, State> {

    index = 0;
    animation: any;
    regionTimeout: any;
    map: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            activeFab: false,
            marginBottom: 0,
            paddingTop: 0,
            markers: [
                {
                    coordinate: {
                        latitude: 16.857127,
                        longitude: 96.160500,
                    },
                    title: "Night Club",
                    description: "20 lbs",
                    image: Images[0],
                    selected: false
                },
                {
                    coordinate: {
                        latitude: 16.855484,
                        longitude: 96.158322,
                    },
                    title: "Sun Cafe",
                    description: "2 lbs",
                    image: Images[1],
                    selected: false
                }
            ],
            region: {
                latitude: 16.857127,
                longitude: 96.160500,
                latitudeDelta: 0.00345,
                longitudeDelta: 0.00345,
            },
        };


    }


    // animation = null;

    componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0);
    }
    componentDidMount() {
        // We should detect when scrolling has stopped then animate
        // We should just debounce the event listener here
        this.animation.addListener(({ value }: any) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= this.state.markers.length) {
                index = this.state.markers.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(this.regionTimeout);
            this.regionTimeout = setTimeout(() => {
                if (this.index !== index) {
                    this.index = index;
                    const { coordinate } = this.state.markers[index];
                    this.map.animateToRegion(
                        {
                            ...coordinate,
                            latitudeDelta: this.state.region.latitudeDelta,
                            longitudeDelta: this.state.region.longitudeDelta,
                        },
                        350
                    );
                }
            }, 10);
        });
    }

    _onMapReady = () => {
        this.setState({ marginBottom: 0 });
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
                this.setState({ paddingTop: 0 });
            });
    }

    _keyExtractor = (item: any, index: any) => item.title + rando().toString();

    toggleSelected = (item: any) => {
        let items = this.state.markers;
        let index = items.indexOf(item);
        if (item.selected == true) {
            items[index].selected = false;
        } else {
            items[index].selected = true;
        }

        this.setState({ markers: items });
    };

    navigate = () => {

        if (this.state.activeFab == false) {
            this.setState({ activeFab: true })
            this.map.fitToElements(true);
        } else {
            this.setState({ activeFab: false })
        }


    }


    render() {
        const interpolations = this.state.markers.map((marker: any, index: any) => {
            const inputRange = [
                (index - 1) * CARD_WIDTH,
                index * CARD_WIDTH,
                ((index + 1) * CARD_WIDTH),
            ];
            const scale = this.animation.interpolate({
                inputRange,
                outputRange: [1, 2.5, 1],
                extrapolate: "clamp",
            });
            const opacity = this.animation.interpolate({
                inputRange,
                outputRange: [0.35, 1, 0.35],
                extrapolate: "clamp",
            });
            return { scale, opacity };
        });

        return (
            <Container>
                <HeaderComponent />
                <View>
                    <Amount />
                </View>


                <View style={styles.container}  >

                    <MapView
                        ref={map => this.map = map}
                        initialRegion={this.state.region}
                        style={styles.container}
                        onMapReady={this._onMapReady}
                    >
                        {this.state.markers.map((marker: any, index: any) => {
                            const scaleStyle = {
                                transform: [
                                    {
                                        scale: interpolations[index].scale,
                                    },
                                ],
                            };
                            const opacityStyle = {
                                opacity: interpolations[index].opacity,
                            };
                            return (
                                <Marker
                                    // key={index}
                                    coordinate={marker.coordinate}
                                    key={`${marker.title}-${marker.selected ? 'active' : 'inactive'}`}
                                    pinColor={(marker.selected ? 'green' : 'red')}>
                                    <Animated.View>
                                        <Animated.View />
                                        <View />
                                    </Animated.View>
                                </Marker>
                            );
                        })}


                        {/* <MapViewDirections
                            origin={origin}
                            // waypoints={null}
                            destination={destination}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={3}
                            strokeColor="hotpink"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                console.log('Distance: ${result.distance} km')
                                console.log('Duration: ${result.duration} min.')

                                this.map.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        right: (width / 20),
                                        bottom: (height / 20),
                                        left: (width / 20),
                                        top: (height / 20),
                                    }
                                });
                            }}
                            onError={(errorMessage) => {
                                // console.log('GOT AN ERROR');
                            }}
                        /> */}


                    </MapView>

                    <Animated.ScrollView
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: this.animation,
                                        },
                                    },
                                },
                            ],
                            { useNativeDriver: true }
                        )}
                        style={styles.scrollView}
                        contentContainerStyle={styles.endPadding}
                        keyExtractor={this._keyExtractor}
                    >
                        {this.state.markers.map((marker: any, index: any) => (
                            <TouchableHighlight
                                underlayColor='white'
                                key={index}
                                onPress={() => {
                                    Alert.alert(
                                        'Plastic Pickup',
                                        'Do you accept pickup?',
                                        [
                                            {
                                                text: 'NO',
                                                onPress: () => {
                                                    this.toggleSelected(marker);
                                                },
                                                style: 'cancel'
                                            },
                                            {
                                                text: 'YES',
                                                onPress: () => {
                                                    this.toggleSelected(marker);
                                                }
                                            },
                                        ],
                                        { cancelable: false });
                                }}>
                                <View style={[styles.card, (marker.selected) ? styles.selectedItem : null]} key={index} >


                                    <Image
                                        source={marker.image}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.textContent}>
                                        <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                                        <Text numberOfLines={1} style={styles.cardDescription}>
                                            {marker.description}
                                        </Text>
                                    </View>

                                </View>
                            </TouchableHighlight>
                        ))}
                    </Animated.ScrollView>



                    <Fab
                        active={this.state.activeFab}
                        direction="down"
                        style={{ backgroundColor: 'green' }}
                        position="topRight"
                        onPress={() => {
                            this.navigate();
                        }}
                    >
                        <Icon name="navigate" ></Icon>
                        <Button style={{ backgroundColor: '#DD5144' }}
                            onPress={() => {
                                Alert.alert('Calculating bike route...');
                            }}>
                            <Icon name="md-bicycle" />
                        </Button>
                        <Button style={{ backgroundColor: '#DD5144' }}
                            onPress={() => {
                                Alert.alert('Calculating car route...');
                            }}>
                            <Icon name="md-car" />
                        </Button>
                    </Fab>
                </View>



            </Container>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        padding: 16,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        // @ts-ignore
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius: 6
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
        borderRadius: 6
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 0,
        height: 0,
        borderRadius: 0,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
    selectedItem: {
        borderColor: "green",
        borderWidth: 4
    }
});