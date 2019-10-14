import { createSelector } from 'reselect';
// @ts-ignore
import { API_ENDPOINT } from 'react-native-dotenv';


//#region state
export interface State {
    {{camelCase name}}: string
}
export const initialState: State = {
    {{camelCase name}}: ''
}
//#endregion state

//#region actions
export enum ActionTypes{
    GET_{{constantCase name}} = "[{{constantCase name}}] GET {{constantCase name}}",
    PUT_{{constantCase name}} = "[{{constantCase name}}] PUT {{constantCase name}}",
    POST_{{constantCase name}} = "[{{constantCase name}}] POST  {{constantCase name}}",
    DELETE_{{constantCase name}} = "[{{constantCase name}}] DELETE {{constantCase name}}",
    {{constantCase name}}_ACTION_STARTED = "[{{constantCase name}}] {{constantCase name}} Action STARTED",
    {{constantCase name}}_ACTION_SUCCEEDED = "[{{constantCase name}}] {{constantCase name}} Action SUCEEDED",
    {{constantCase name}}_ACTION_FAILED = "[{{constantCase name}}] {{constantCase name}} Action FAILED",
}

export function get{{pascalCase name}}(json: any, authToken: any){
    return async (dispatch: any) => {
        dispatch(started());
        try{
            fetch(`${API_ENDPOINT}`, {
                "method": "GET",
                "headers": {
                    "accept": "application/json",
                    "authorization": "Bearer " + authToken,
                    "content-type": "application/json"
                },
                "body": JSON.stringify(json)
            })
            .then(response => response.json())
            .then(payload => {
                dispatch(succeeded(payload, ActionTypes.GET_{{constantCase name}}));
            });
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function put{{pascalCase name}}(json: any, authToken: any){
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
                dispatch(succeeded(payload, ActionTypes.PUT_{{constantCase name}}));
            });
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function post{{pascalCase name}}(json: any, authToken: any){
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
                dispatch(succeeded(payload, ActionTypes.POST_{{constantCase name}}));
            });
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function delete{{pascalCase name}}(json: any, authToken: any){
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
                dispatch(succeeded(payload, ActionTypes.DELETE_{{constantCase name}}));
            });
        } catch(e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}


export function started() {
    return {
        type: ActionTypes.{{constantCase name}}_ACTION_STARTED,
        payload: {},
        status: ActionTypes.{{constantCase name}}_ACTION_STARTED
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
    console.log('[{{constantCase name}}_ACTION_FAILED]', error);
    return {
        type: ActionTypes.{{constantCase name}}_ACTION_FAILED,
        payload: error,
        status: ActionTypes.{{constantCase name}}_ACTION_FAILED,
    };
}
//#endregion actions

//#region reducers
export function reducers(state: State = initialState, action: any){
    
    switch(action.type){
        
        case ActionTypes.GET_{{constantCase name}}: {
            return {
                ...state,
                workflowId: action.payload
            }
        }
        case ActionTypes.PUT_{{constantCase name}}: {
            return {
                ...state,
                error: action.payload
            }
        }
        case ActionTypes.POST_{{constantCase name}}: {
            return {
                ...state,
                error: action.payload
            }
        }
        case ActionTypes.DELETE_{{constantCase name}}: {
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
export const {{camelCase name}}State = createSelector( (state: State) => state, state => state );
//#endregion selectors