import { Location } from '../../models/Location';
// @ts-ignore
import { RADAR_KEY_API } from 'react-native-dotenv';


/*
 * In order to automatically generate id for our location
 */
let nextId = 0;

/*
 * We're defining every action name constant here
 * We're using Typescript's enum
 * Typescript understands enum better 
 */
export enum ActionTypes {
  GET_LOCATIONS = '[LOCATIONS] GET_LOCATIONS',
  GET_LOCATIONS_STARTED = '[LOCATIONS] GET_LOCATIONS_STARTED',
  GET_LOCATIONS_SUCCEEDED = '[LOCATIONS] GET_LOCATIONS_SUCCEEDED',
  GET_LOCATIONS_FAILED = '[LOCATIONS] GET_LOCATIONS_FAILED',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface GetLocationsAction { type: ActionTypes.GET_LOCATIONS, payload: {}, status: ActionTypes.GET_LOCATIONS };
export interface GetLocationsSucceededAction { type: ActionTypes.GET_LOCATIONS_SUCCEEDED, payload: { locations: Location[] }, status: ActionTypes.GET_LOCATIONS_SUCCEEDED };
export interface GetLocationsStartedAction { type: ActionTypes.GET_LOCATIONS_STARTED, payload: {}, status: ActionTypes.GET_LOCATIONS_STARTED };
export interface GetLocationsFailedAction { type: ActionTypes.GET_LOCATIONS_FAILED, payload: { error: string }, status: ActionTypes.GET_LOCATIONS_FAILED };

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function getLocations() {  
  return (dispatch: any)  => {

    dispatch(getLocationsStarted());
    
    // let response = await fetch(
    //   'https://api.radar.io/v1/geofences ', {
    //     method: 'GET',
    //     headers: {
    //       Authorization: RADAR_KEY_API,
    //       'Cache-Control': 'no-cache'
    //     }
    //   }
    // );
    // let payload = await  response.json();
    // console.log('get geofences', payload);
    // dispatch(getLocationsSucceeded(payload));


    try{
      fetch(
        'https://api.radar.io/v1/geofences', {
          method: 'GET',
          headers: {
            authorization: RADAR_KEY_API,
            accept: 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      ).then(response => response.json()).then(result => {
        console.log('get geofences', result);
        dispatch(getLocationsSucceeded(result));
      });
      
    } catch (e){
      console.log('wtf', e)
    }
    

    // fetch('https://reddit.com/.json').then(response => response.json()).then(result => {
    //   console.log(result)
    //   dispatch(getLocationsSucceeded(result));
    // }) 

  }
}

export function getLocationsStarted(): GetLocationsStartedAction {
  return {
    type: ActionTypes.GET_LOCATIONS_STARTED,
    payload: {},
    status: ActionTypes.GET_LOCATIONS_STARTED
  };
}

export function getLocationsSucceeded(payload: any): GetLocationsSucceededAction {
  console.log(payload);
  return {
    type: ActionTypes.GET_LOCATIONS_SUCCEEDED,
    payload: {
      locations: payload.geofences
    },
    status: ActionTypes.GET_LOCATIONS_SUCCEEDED
  }
}

export function getLocationsFailed(error: any): GetLocationsFailedAction {
  return {
    type: ActionTypes.GET_LOCATIONS_FAILED,
    payload: error,
    status: ActionTypes.GET_LOCATIONS_FAILED,
  };
}



/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = GetLocationsAction | GetLocationsStartedAction | GetLocationsSucceededAction | GetLocationsFailedAction 