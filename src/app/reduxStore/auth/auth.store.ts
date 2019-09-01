import { Auth } from './../../models/Auth';
// @ts-ignore
import { Config } from './getConfig.js';
import { createSelector } from 'reselect';

declare let authorize:any;
declare let revoke:any;
declare let refresh:any;

//#region Initial State
export interface State {
    auth: Auth,
    error: any
}
export const initialState: State = {
    auth: {} as Auth,
    error: null
}
//#endregion Initial State

//#region Actions
export enum ActionTypes {
    LOGIN = '[AUTH] LOGIN',
    LOGOUT = '[AUTH] SIGNIN',
    REFRESH_TOKEN = '[AUTH] REFRESH_TOKEN',
    AUTH_ACTION_STARTED = '[AUTH] AUTH_ACTION_STARTED',
    AUTH_ACTION_SUCCEEDED = '[AUTH] AUTH_ACTION_SUCCEEDED',
    AUTH_ACTION_FAILED = '[AUTH] AUTH_ACTION_FAILED'
}

export function login() {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            // @ts-ignore
            const payload = await authorize(Config);
            dispatch(succeeded(payload, ActionTypes.LOGIN));
        } catch (e) {
            console.log('error', e)
        }
    }
}

export function logout(token: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            // @ts-ignore
            const result = await authorize(Config);
            // todo if 200 then pass success with no payload {}
            // else dispatch error
            dispatch(succeeded(result, ActionTypes.LOGOUT));
        } catch (e) {
            console.log('error', e)
        }
    }
}

export function refreshToken(refreshToken: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            // @ts-ignore
            const payload = await refresh(Config, {
                refreshToken: refreshToken
            });
            dispatch(succeeded(payload, ActionTypes.REFRESH_TOKEN));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e));
        }
    }
}

export function started() {
    return {
        type: ActionTypes.AUTH_ACTION_STARTED,
        payload: {},
        status: ActionTypes.AUTH_ACTION_STARTED
    };
}

export function succeeded(payload: any, action: ActionTypes) {
    console.log(payload);
    return {
        type: action,
        payload: {
            auth: payload
        },
        status: action
    }
}

export function failed(error: any) {
    console.log('[AUTH_FAILED]', error);
    return {
        type: ActionTypes.AUTH_ACTION_FAILED,
        payload: error,
        status: ActionTypes.AUTH_ACTION_FAILED,
    };
}

// export type Action = any;
//#endregion Actions

//#region Reducers
export function reducers(state: State = initialState, action: any) {
    switch (action.type) {

        case ActionTypes.LOGIN: {
            return {
                ...state,
                auth: action.payload.auth
            }
        }

        case ActionTypes.LOGOUT: {
            return {
                ...state,
                auth: {}
            }
        }

        case ActionTypes.REFRESH_TOKEN: {
            return {
                ...state,
                auth: action.payload.auth
            }
        }

        case ActionTypes.AUTH_ACTION_STARTED: {
            console.log("AUTH_STARTED");
        }

        case ActionTypes.AUTH_ACTION_FAILED: {
            console.log("AUTH_FAILED", action.payload);
            return {
                ...state,
                error: action.payload
            }
        }

        default:
            return state
    }
}
//#endregion Reducers

//#region Selectors
export const getAuth = createSelector(( (state: State) => state.auth), s => s)
//#endregion Selectors
