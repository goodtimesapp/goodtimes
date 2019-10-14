import { createSelector } from 'reselect';
import { API, accessDenied, apiError, apiStart, apiEnd } from './../common/api';
import { store } from './../configureStore';
import { addPostFromWebSocket } from './../posts/posts.store';

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


export function setupWebsockets(ws: any) {
    return async (dispatch: any) => {
        try {
            
            
            ws.onopen = () => {
                // connection opened
                // ws.send('something'); // send a message
            };

            ws.onmessage = (e: any) => {
                // a message was received
                console.log('[WEBSOCKET ONMESSAGE] ', e.data);
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

            dispatch(succeeded('', ActionTypes.SETUP_WEBSOCKETS))

        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function closeWebsockets() {
    return async (dispatch: any) => {

        try {

        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}


export function getWebsocket() {

}

export function putWebsockets(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function postWebsockets(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function deleteWebsockets(json: any, authToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
           
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
        case ActionTypes.GET_WEBSOCKETS: {
            return {
                ...state,
                workflowId: action.payload
            }
        }
        case ActionTypes.PUT_WEBSOCKETS: {
            return {
                ...state,
                error: action.payload
            }
        }
        case ActionTypes.POST_WEBSOCKETS: {
            return {
                ...state,
                error: action.payload
            }
        }
        case ActionTypes.DELETE_WEBSOCKETS: {
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
export const websocketsState = createSelector((state: State) => state, state => state);
export const websocket = createSelector((state: State) => state, state => state.websocket);
//#endregion selectors