import { createSelector } from 'reselect';
import { API, accessDenied, apiError, apiStart, apiEnd } from './../common/api';
import { store } from './../configureStore';
import { addPostFromWebSocket, addActiveUserFromWebSocket } from './../posts/posts.store';
import { acceptRoomInvitation } from './../profile/profile.store';
// @ts-ignore
import { GOODTIMES_RADIKS_SERVER, GOODTIMES_RADIKS_WEBSOCKET } from 'react-native-dotenv';
import Message from './../../models/Message';
import { Alert } from 'react-native';
import io from 'socket.io-client';
declare let window: any;

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
    WEBSOCKETS_ACTION_FAILED = "[WEBSOCKETS] WEBSOCKETS ACTION FAILED"    
}


export function setupWebsockets(placeId: string) {
    return async (dispatch: any) => {
        try {


            // socket io test
            // set-up a connection between the client and the server
            // https://github.com/justadudewhohacks/websocket-chat
            // const socket = io.connect(GOODTIMES_RADIKS_SERVER);
            const ws = io(`${GOODTIMES_RADIKS_SERVER}`);
            
            window.ws = ws;
            window.io = io;
            
            console.log(`Setup Websocket for place ${placeId}`)

            ws.on('message',  (data: any) => {
                // a message was received
                console.log(`[WEBSOCKET ON MESSAGE from place ${placeId}] `);
                try {
                    if (data){
                        let modelType = data.radiksType;
                        switch (modelType) {
                            case "Message":
                                if (!data.content) return;
                                let msg = data.content;
                                dispatch(succeeded(data.content, ActionTypes.RECEIVED_WEBSOCKET_MESSAGE));
                            case "Post":
                                dispatch(addPostFromWebSocket(data));
                                // Alert.alert(data.content);
                                dispatch(succeeded(data.content, ActionTypes.RECEIVED_WEBSOCKET_POST));
                            case "GroupInvitation":
                                dispatch(acceptRoomInvitation(data.inviteId));
                                return;
                            case "ActiveUser":
                                debugger;
                                dispatch(addActiveUserFromWebSocket(data.attrs));
                                return;
                            default:
                                return;
                        }
                    } else {
                        // no data passed from websocket
                    }
                } catch (e) {
                    dispatch(apiError(e));
                }
            });


            ws.on('error', (e: any) => {
                // an error occurred
                console.log(e.message);
                dispatch(apiError(e));
                dispatch(failed(e));
                // dispatch(accessDenied(e.response.toString()));
            });


            let authToken = (store.getState().profile.userSession as any).store.sessionData.userData.authResponseToken;
            ws.emit('join', { room: placeId, authToken: authToken });

            // ws.onclose = (e: any) => {
            //     // connection closed
            //     console.log(e.code, e.reason);
            //     dispatch(apiEnd(''));
            // };

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
    // console.log(payload);
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
            if (state.websocket) {
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