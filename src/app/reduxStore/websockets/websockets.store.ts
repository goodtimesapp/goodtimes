import { createSelector } from 'reselect';
import { API, accessDenied, apiError, apiStart, apiEnd } from './../common/api';
import { store } from './../configureStore';
import { addPostFromWebSocket } from './../posts/posts.store';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';


//#region state
export interface State {
    websocket: any,
    posts: Array<any>,
    messages: Array<any>
}
export const initialState: State = {
    websocket: null,
    posts: [],
    messages: []
}
//#endregion state

//#region actions
export enum ActionTypes {
    SETUP_WEBSOCKETS = "[WEBSOCKETS] SETUP WEBSOCKETS",
    CLOSE_WEBSOCKETS = "[WEBSOCKETS] CLOSE WEBSOCKETS",
    RECEIVED_WEBSOCKET_MESSAGE = "[WEBSOCKETS] RECEIVED WEBSOCKET MESSAGE",
    RECEIVED_WEBSOCKET_POST = "[WEBSOCKETS] RECEIVED WEBSOCKET POST",
    GET_WEBSOCKETS = "[WEBSOCKETS] GET WEBSOCKETS",
    PUT_WEBSOCKETS = "[WEBSOCKETS] PUT WEBSOCKETS",
    POST_WEBSOCKETS = "[WEBSOCKETS] POST  WEBSOCKETS",
    DELETE_WEBSOCKETS = "[WEBSOCKETS] DELETE WEBSOCKETS",
    WEBSOCKETS_ACTION_STARTED = "[WEBSOCKETS] WEBSOCKETS ACTION STARTED",
    WEBSOCKETS_ACTION_SUCCEEDED = "[WEBSOCKETS] WEBSOCKETS ACTION SUCEEDED",
    WEBSOCKETS_ACTION_FAILED = "[WEBSOCKETS] WEBSOCKETS ACTION FAILED",
}


export function setupWebsockets(placeId: string) {
    return async (dispatch: any) => {
        try {
            
           


            let wsEndpoint = `${GOODTIMES_RADIKS_WEBSOCKET}/place/${placeId}`;
            // @ts-ignore
            let ws = new WebSocket(wsEndpoint);
            console.log(`Setup Websocket for place ${placeId}`)
            
            ws.onopen = () => {
                console.log(`connection opened for place ${placeId}`)
                // ws.send('something'); // send a message
            };

            ws.onmessage = (e: any) => {
                // a message was received
                console.log(`[WEBSOCKET ONMESSAGE from place ${placeId}] `, e.data);
                try {
                    let data = JSON.parse(e.data);
                    let modelType = data.radiksType;
                    switch (modelType) {
                        case "Message":
                            if (!data.content) return;
                            let msg = data.content;
                            dispatch(succeeded(data.content, ActionTypes.RECEIVED_WEBSOCKET_MESSAGE));
                        case "Post":
                            // dispatch(addPostFromWebSocket(data.content));
                            dispatch(succeeded(data.content, ActionTypes.RECEIVED_WEBSOCKET_POST));
                        default:
                            return;
                    }

                } catch (e) {
                    dispatch(apiError(e));
                }
            };

            ws.onerror = (e: any) => {
                // an error occurred
                console.log(e.message);
                dispatch(apiError(e));
                dispatch(failed(e));
                // dispatch(accessDenied(e.response.toString()));
            };

            ws.onclose = (e: any) => {
                // connection closed
                console.log(e.code, e.reason);
                dispatch(apiEnd(''));
            };

            dispatch(succeeded(ws, ActionTypes.SETUP_WEBSOCKETS))

        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function closeWebsockets(ws: any) {
    return async (dispatch: any) => {
        try {
            ws.close();
            dispatch(succeeded('', ActionTypes.CLOSE_WEBSOCKETS))
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}


export function started() {
    return {
        type: ActionTypes.WEBSOCKETS_ACTION_STARTED,
        payload: {},
        status: ActionTypes.WEBSOCKETS_ACTION_STARTED
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
    console.log('[WEBSOCKETS_ACTION_FAILED]', error);
    return {
        type: ActionTypes.WEBSOCKETS_ACTION_FAILED,
        payload: error,
        status: ActionTypes.WEBSOCKETS_ACTION_FAILED,
    };
}
//#endregion actions

//#region reducers
export function reducers(state: State = initialState, action: any) {

    switch (action.type) {
        case ActionTypes.SETUP_WEBSOCKETS: {
            
            // close old websocket
            if (state.websocket){
                console.log('closing websocket')
                state.websocket.close();
            }

            return {
                ...state,
                websocket: action.payload
            }
        }
        case ActionTypes.RECEIVED_WEBSOCKET_MESSAGE: {
            return {
                ...state,
                messages: [
                    ...state.messages,
                    action.payload
                ]
            }
        }
        case ActionTypes.RECEIVED_WEBSOCKET_POST: {
            return {
                ...state,
                posts: [
                    ...state.posts,
                    action.payload
                ]
            }
        }
        case ActionTypes.CLOSE_WEBSOCKETS: {
            return {
                ...state,
                websocket: null
            }
        }
        default:
            return state
    }
}
//#endregion reducers

//#region selectors
export const websocketsState = createSelector((state: State) => state, state => state);
export const websocket = createSelector((state: State) => state, state => state.websocket);
//#endregion selectors