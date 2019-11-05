import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { getLocations } from '../reduxStore/locations/actions/get.locations';
import {Platform} from 'react-native';
// @ts-ignore
import { GOOGLE_MAPS_ENDPOINT, GOOGLE_MAPS_APIKEY } from 'react-native-dotenv';

export const getCurrentLocation = async () =>{

    return new Promise( (resolve, reject)=> {
            if (Platform.OS == 'android') {

                check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                    .then(result => {
                        switch (result) {
                        case RESULTS.UNAVAILABLE:
                            let ee = 'This feature is not available (on this device / in this context)';
                            console.log(ee);
                            reject(ee);
                            break;
                        case RESULTS.DENIED:
                            console.log(
                            'The permission has not been requested / is denied but requestable',
                            );

                            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
                                Geolocation.getCurrentPosition(
                                    position => {     
                                    resolve({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    })
                                },
                                    (error) => {
                                        console.log('GeoLocation error', error);
                                        reject(error);
                                    },
                                    { 
                                        enableHighAccuracy: true, 
                                        timeout: 200000, 
                                        maximumAge: 1000 
                                    }
                                );
                            });

                            break;
                        case RESULTS.GRANTED:
                            Geolocation.getCurrentPosition(
                                position => {     
                                resolve({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                })
                            },
                                (error) => {
                                    console.log('GeoLocation error', error);
                                    reject(error);
                                },
                                { 
                                    enableHighAccuracy: true, 
                                    timeout: 200000, 
                                    maximumAge: 1000 
                                }
                            );
                        
                            break;
                        case RESULTS.BLOCKED:
                            let e = 'The permission is denied and not requestable anymore'
                            console.log(e);
                            reject(e);
                            break;
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });

            } else {
                check(PERMISSIONS.IOS.LOCATION_ALWAYS)
                    .then(result => {
                        switch (result) {
                        case RESULTS.UNAVAILABLE:
                            let ee = 'This feature is not available (on this device / in this context)';
                            console.log(ee);
                            reject(ee);
                            break;
                        case RESULTS.DENIED:
                            console.log(
                            'The permission has not been requested / is denied but requestable',
                            );

                            request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
                                Geolocation.getCurrentPosition(
                                    position => {     
                                    resolve({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    })
                                },
                                    (error) => {
                                        console.log('GeoLocation error', error);
                                        reject(error);
                                    },
                                    { 
                                        enableHighAccuracy: true, 
                                        timeout: 200000, 
                                        maximumAge: 1000 
                                    }
                                );
                            });

                            break;
                        case RESULTS.GRANTED:
                            Geolocation.getCurrentPosition(
                                position => {     
                                resolve({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                })
                            },
                                (error) => {
                                    console.log('GeoLocation error', error);
                                    reject(error);
                                },
                                { 
                                    enableHighAccuracy: true, 
                                    timeout: 200000, 
                                    maximumAge: 1000 
                                }
                            );
                        
                            break;
                        case RESULTS.BLOCKED:
                            let e = 'The permission is denied and not requestable anymore'
                            console.log(e);
                            reject(e);
                            break;
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        }
    );
}

export async function getAddressFromGps(coordinates: any): Promise<any> {
    
    let latlng = `${coordinates.latitude},${coordinates.longitude}`; //'40.714224,-73.961452';
    
    return fetch(
        `${GOOGLE_MAPS_ENDPOINT}/geocode/json?latlng=${latlng}&key=${GOOGLE_MAPS_APIKEY}`,
        {
            "method":"GET"
        }
    );

}

export async function getGpsFromAddress(address: any): Promise<any> {
    
    return fetch(
        `${GOOGLE_MAPS_ENDPOINT}/geocode/json?address=${address}&key=${GOOGLE_MAPS_APIKEY}`,
        {
            "method":"GET"
        }
    );

}

export async function whereami(location: any, radius?:50): Promise<any> {
    
    return fetch(
        `${GOOGLE_MAPS_ENDPOINT}/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&key=${GOOGLE_MAPS_APIKEY}`,
        {
            "method":"GET"
        }
    );

}

