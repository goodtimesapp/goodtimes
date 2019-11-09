import { createSelector } from 'reselect';
// @ts-ignore
const API_ENDPOINT = '';
import { UserGroup, GroupInvitation, Central } from './../../radiks/src/index';


//#region state
export interface State {
    place: string
}
export const initialState: State = {
    place: ''
}
//#endregion state

//#region actions
export enum ActionTypes{
    GET_PLACE = "[PLACE] GET PLACE",
    PUT_PLACE = "[PLACE] PUT PLACE",
    POST_PLACE = "[PLACE] POST  PLACE",
    DELETE_PLACE = "[PLACE] DELETE PLACE",
    PLACE_ACTION_STARTED = "[PLACE] PLACE Action STARTED",
    PLACE_ACTION_SUCCEEDED = "[PLACE] PLACE Action SUCEEDED",
    PLACE_ACTION_FAILED = "[PLACE] PLACE Action FAILED",
}

export function getPlace(json: any, authToken: any){
    return async (dispatch: any) => {
        dispatch(started());
        try{
            
            ///
            /// Place Key Algorithm
            ///

            // does the place have an unexpired group key yet? (keys expire every 24 hours)
                // (n) then, you are the admin and create group key 
                    // as people enter the place give them the admin key (just in case you leave), i.e gossip the key around
                    // if everybody leaves the place then temporarily give the key to the central server
                    // then the next person to enter the place gets control of the admin key to gossip (deleted from central server)
                    // (repeat until the key expires)
                // (y) get the key from an admin or from the central server (if empty place)

            
            let payload = '';
            dispatch(succeeded(payload, ActionTypes.GET_PLACE));
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function putPlace(json: any, authToken: any){
    return async (dispatch: any) => {
        dispatch(started());
        try{
            fetch(`${API_ENDPOINT}`, {
                "method": "PUT",
                "headers": {
                    "accept": "application/json",
                    "authorization": "Bearer " + authToken,
                    "content-type": "application/json"
                },
                "body": JSON.stringify(json)
            })
            .then(response => response.json())
            .then(payload => {
                dispatch(succeeded(payload, ActionTypes.PUT_PLACE));
            });
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function postPlace(json: any, authToken: any){
    return async (dispatch: any) => {
        dispatch(started());
        try{
            fetch(`${API_ENDPOINT}`, {
                "method": "POST",
                "headers": {
                    "accept": "application/json",
                    "authorization": "Bearer " + authToken,
                    "content-type": "application/json"
                },
                "body": JSON.stringify(json)
            })
            .then(response => response.json())
            .then(payload => {
                dispatch(succeeded(payload, ActionTypes.POST_PLACE));
            });
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function deletePlace(json: any, authToken: any){
    return async (dispatch: any) => {
        dispatch(started());
        try{
            fetch(`${API_ENDPOINT}`, {
                "method": "DELETE",
                "headers": {
                    "accept": "application/json",
                    "authorization": "Bearer " + authToken,
                    "content-type": "application/json"
                },
                "body": JSON.stringify(json)
            })
            .then(response => response.json())
            .then(payload => {
                dispatch(succeeded(payload, ActionTypes.DELETE_PLACE));
            });
        } catch(e) {
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
    console.log(payload);
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
export function reducers(state: State = initialState, action: any){
    
    switch(action.type){
        
        case ActionTypes.GET_PLACE: {
            return {
                ...state,
                workflowId: action.payload
            }
        }
        case ActionTypes.PUT_PLACE: {
            return {
                ...state,
                error: action.payload
            }
        }
        case ActionTypes.POST_PLACE: {
            return {
                ...state,
                error: action.payload
            }
        }
        case ActionTypes.DELETE_PLACE: {
            return {
                ...state,
                error: action.payload
            }
        }
        default:
            return state
    }
}
//#endregion reducers

//#region selectors
export const placeState = createSelector( (state: State) => state, state => state );
//#endregion selectors