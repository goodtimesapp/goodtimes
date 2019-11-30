import { createSelector } from 'reselect';
// @ts-ignore
const API_ENDPOINT = '';
import { UserGroup, GroupInvitation, Central } from './../../radiks/src/index';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';


//#region state
export interface State {
    place: string,
    placeId: string,
    key: string,
    websocket: any
}
export const initialState: State = {
    place: '',
    placeId: '',
    key: '',
    websocket: null
}
//#endregion state

//#region actions
export enum ActionTypes {
    SETUP_WEBSOCKET = "[PLACE] Setup websocket",
    REQUEST_KEY = "[PLACE] Request a room key ",
    GET_PLACE_DATA = "[PLACE] GET PLACE DATA",
    GET_PLACE = "[PLACE] GET PLACE",
    GET_PLACE_KEY = "[PLACE] GET PLACE KEY",
    PUT_PLACE = "[PLACE] PUT PLACE",
    POST_PLACE = "[PLACE] POST  PLACE",
    DELETE_PLACE = "[PLACE] DELETE PLACE",
    PLACE_ACTION_STARTED = "[PLACE] PLACE Action STARTED",
    PLACE_ACTION_SUCCEEDED = "[PLACE] PLACE Action SUCEEDED",
    PLACE_ACTION_FAILED = "[PLACE] PLACE Action FAILED",
}


export function setupWebsocket(placeId: string) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            // @ts-ignore
            let wsEndpoint = `${GOODTIMES_RADIKS_WEBSOCKET}/place/${placeId}`;
            // @ts-ignore
            let ws = new WebSocket(wsEndpoint);
            ws.onopen = () => {
                // connection opened
                console.log(`websocket opened to ${wsEndpoint}`);
                // ws.send('something'); // send a message
            };
            ws.onmessage = (e: any) => {
                // a message was received
                console.log(`[MSG_RECIEVED from ${placeId}]`, e.data);
                try {
                    let data = JSON.parse(e.data);
                    let modelType = data.radiksType;
                    switch (modelType) {
                        case "Message":
                            console.log('message recieved from ' , data);
                        default:
                            return;
                    }
                } catch (e) { }
            };
            dispatch(succeeded(ws, ActionTypes.SETUP_WEBSOCKET));
        } catch (e) {
            dispatch(failed(e));
        }
    };
}

// requestKey
export function requestKey(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {

            // open two ws

            // 1 key reciever key ws /place/placeId/publickey 

            // listen for key "ReceiveKey" websocket message

            // 2 data ws /place/placeId

            let keyResp = await fetch(`${API_ENDPOINT}`, {
                "method": "GET",
                "headers": {
                    "accept": "application/json",
                    "authorization": "Bearer " + authToken,
                    "content-type": "application/json"
                },
                "body": JSON.stringify(json)
            });
            // Room key algo
            // @todo proof of presxense - likilhood rank based on reputation and bluetooth. server passes back key if you are most likley there
            // locationClaim, placeId, userId

            // https://goodtimes-server.herokuapp.com/place/placeId


            let payload = '';
            dispatch(succeeded(payload, ActionTypes.GET_PLACE));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

// getPlaceData


export function getPlace(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {

            let payload = '';
            dispatch(succeeded(payload, ActionTypes.GET_PLACE));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function putPlace(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
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
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function postPlace(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
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
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function deletePlace(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
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
export function reducers(state: State = initialState, action: any) {

    switch (action.type) {


        case ActionTypes.SETUP_WEBSOCKET: {
            return {
                ...state,
                websocket: action.payload
            }
        }

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
export const placeState = createSelector((state: State) => state, state => state);
export const websocket = createSelector((state: State) => state, state => state.websocket);
//#endregion selectors