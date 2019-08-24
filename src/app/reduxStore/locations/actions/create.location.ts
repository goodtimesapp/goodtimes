import { Location } from '../../../models/Location';
// @ts-ignore
import { RADAR_KEY_API } from 'react-native-dotenv';
import qs from 'qs';

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
  CREATE_LOCATION = '[LOCATIONS] CREATE_LOCATIONS',
  CREATE_LOCATION_STARTED = '[LOCATIONS] CREATE_LOCATIONS_STARTED',
  CREATE_LOCATION_SUCCEEDED = '[LOCATIONS] CREATE_LOCATIONS_SUCCEEDED',
  CREATE_LOCATION_FAILED = '[LOCATIONS] CREATE_LOCATIONS_FAILED',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface CreateLocationAction { type: ActionTypes.CREATE_LOCATION, payload: {}, status: ActionTypes.CREATE_LOCATION };
export interface CreateLocationSucceededAction { type: ActionTypes.CREATE_LOCATION_SUCCEEDED, payload: { locations: Location[] }, status: ActionTypes.CREATE_LOCATION_SUCCEEDED };
export interface CreateLocationStartedAction { type: ActionTypes.CREATE_LOCATION_STARTED, payload: {}, status: ActionTypes.CREATE_LOCATION_STARTED };
export interface CreateLocationFailedAction { type: ActionTypes.CREATE_LOCATION_FAILED, payload: { error: string }, status: ActionTypes.CREATE_LOCATION_FAILED };

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function createLocation(location: Location) {  
  return (dispatch: any)  => {

    dispatch(createLocationStarted());
    
    try{
      fetch(
        'https://api.radar.io/v1/geofences', {
          method: 'POST',
          headers: {
            authorization: RADAR_KEY_API,
            'content-type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify(location)
        }
      ).then(response => response.json()).then(result => {
        console.log('created geofence', result);
        dispatch(createLocationSucceeded(result));
      });
      
    } catch (e){
      dispatch(createLocationFailed(e));
    }
    
  }
}

export function createLocationStarted(): CreateLocationStartedAction {
  return {
    type: ActionTypes.CREATE_LOCATION_STARTED,
    payload: {},
    status: ActionTypes.CREATE_LOCATION_STARTED
  };
}

export function createLocationSucceeded(payload: any): CreateLocationSucceededAction {
  console.log(payload);
  return {
    type: ActionTypes.CREATE_LOCATION_SUCCEEDED,
    payload: {
      locations: payload.geofences
    },
    status: ActionTypes.CREATE_LOCATION_SUCCEEDED
  }
}

export function createLocationFailed(error: any): CreateLocationFailedAction {
  return {
    type: ActionTypes.CREATE_LOCATION_FAILED,
    payload: error,
    status: ActionTypes.CREATE_LOCATION_FAILED,
  };
}


/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = CreateLocationAction | CreateLocationStartedAction | CreateLocationSucceededAction | CreateLocationFailedAction 