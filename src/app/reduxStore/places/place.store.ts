import { createSelector } from 'reselect';
// @ts-ignore
const API_ENDPOINT = '';
import { UserGroup, GroupInvitation, Central } from './../../radiks/src/index';
import { setupWebsockets } from './../websockets/websockets.store';
import { getCurrentLocation } from './../../utils/location-utils';
// @ts-ignore
import Geohash from 'latlon-geohash';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import { LatLng } from 'react-native-maps';


//#region state
export interface State {
    place: string,
    placeId: string,
    key: string,
    geohash: string,
    headcount: number,
    currentLocation: LatLng
}
export const initialState: State = {
    place: '',
    placeId: '',
    key: '',
    geohash: 'a',
    headcount: 0,
    currentLocation: {
        latitude:1,
        longitude: 2
    }
}
//#endregion state

//#region actions
export enum ActionTypes {
    SET_PLACE_ID = "[PLACE] Set place id", // legacy
    SET_GEOHASH_AT_CURRENT_LOCATION = "[PLACE] SET_GEOHASH_AT_CURRENT_LOCATION",
    SET_GEOHASH = "[PLACE] SET_GEOHASH",
    GET_NEAREST_POPULATED_GEOHASH = "[PLACE] GET_NEAREST_POPULATED_GEOHASH",
    GET_HEADCOUNT_AT_CURRENT_LOCATION = "[PLACE] GET_HEADCOUNT_AT_CURRENT_LOCATION ",
    GET_HEADCOUNT = "[PLACE] GET_HEADCOUNT",
    START_LOCATION_AT_CURRENT_LOCATION = "[PLACE]  START_LOCATION_WEBSOCKET_AT_CURRENT_LOCATION",
    START_LOCATION_WEBSOCKET = "[PLACE]  START_LOCATION_WEBSOCKET",
    PLACE_ACTION_STARTED = "[PLACE] PLACE Action STARTED",
    PLACE_ACTION_SUCCEEDED = "[PLACE] PLACE Action SUCEEDED",
    PLACE_ACTION_FAILED = "[PLACE] PLACE Action FAILED",
    GET_MY_CURRENT_LOCATION = "[PLACE] GET_MY_CURRENT_LOCATION"
}

// legacy
export function setPlaceId(placeId: string) {
    return async (dispatch: any) => {
        try {
            //dispatch(setupWebsockets(placeId));
            //dispatch(succeeded(placeId, ActionTypes.SET_PLACE_ID));
            
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }    
    }
}

export function getMyCurrentLocation() {
    return async (dispatch: any) => {
        try {
            getCurrentLocation().then((location: any) => {
                console.log('current loc', location);
                dispatch(succeeded(location, ActionTypes.GET_MY_CURRENT_LOCATION));
                // dispatch(getNearestPopulatedGeohash(location));
            });
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }    
    }
}

// query the server to determine the best populated geohash region with more than people present
// 1) start at the local location with 9 precision points, if there are more than 5 people then that is your geohash
// 2) zoom the map out to 8 and so forth until you are at 1 (the whole wide world)
export function getNearestPopulatedGeohash(location: LatLng){

    return async (dispatch: any) => {
            let geoResp = await fetch(`${GOODTIMES_RADIKS_SERVER}/placeinfo/nearest/populated/${location.latitude}/${location.longitude}`, {
                "method": "GET",
            });
            let geoJson: any = await geoResp.json();
            let geohash = geoJson.geohash;
            let headcount = geoJson.count;
            console.log('Created geohash', geohash, headcount);
            dispatch(startLocationWebSocket(geohash));
            dispatch(succeeded({geohash,headcount}, ActionTypes.GET_NEAREST_POPULATED_GEOHASH));
    }      
}

export function getHeadCountAtCurrentLocation(){

}

export function getHeadCount(geohash: string){
    
}

export function setGeohashStateAtCurrentLocation(){

}

export function setGeohashState(geohash: string){

}




export function startLocationWebSocketAtCurrentLocation(){
    return async (dispatch: any) => {
        // 1) Create geohash for your location
        getCurrentLocation().then( async (location: any) =>{
            dispatch(startLocationWebSocket(location));
        });
    }
}


export function startLocationWebSocket(geohash: string) {
    return async (dispatch: any) => {
        try {
            // 2) open up a websocker for the place
            dispatch(setupWebsockets(geohash));
            dispatch(succeeded(geohash, ActionTypes.START_LOCATION_WEBSOCKET));
            //dispatch(getPosts({ sort: '-createdAt', placeId: placeId }) );
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}



export function started() {
    return {
        type: ActionTypes.PLACE_ACTION_STARTED,
        payload: {},
        status: ActionTypes.PLACE_ACTION_STARTED
    };
}

export function succeeded(payload: any, action: ActionTypes) {
    // console.log(payload);
    return {
        type: action,
        payload: payload,
        status: action
    }
}

export function failed(error: any) {
    console.log('[PLACE_ACTION_FAILED]', error);
    return {
        type: ActionTypes.PLACE_ACTION_FAILED,
        payload: error,
        status: ActionTypes.PLACE_ACTION_FAILED,
    };
}
//#endregion actions

//#region reducers
export function reducers(state: State = initialState, action: any) {

    switch (action.type) {

        case ActionTypes.GET_MY_CURRENT_LOCATION: {
            return {
                ...state,
               currentLocation: action.payload
            }
        }
        
        case ActionTypes.SET_PLACE_ID: {
            return {
                ...state,
                placeId: action.payload,
                geohash: action.payload
            }
        }

        case ActionTypes.GET_NEAREST_POPULATED_GEOHASH: {
            return {
                ...state,
                geohash: action.payload.geohash,
                headcount: action.payload.headcount
            }
        }

        case ActionTypes.START_LOCATION_WEBSOCKET: {
            return {
                ...state,
                placeId: action.payload
            }
        }
        
        default:
            return state
    }
}
//#endregion reducers

//#region selectors
export const placeState = createSelector((state: State) => state, state => state);
//#endregion selectors