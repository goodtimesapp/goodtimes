import { UserSession } from './../../radiks/src/types/index';
import { createSelector } from 'reselect';
import { configureRadiks, initWallet, makeUserSession, makeProfileJSON, saveProfileJSON  } from './../../utils/profile';
// @ts-ignore
import { getBlockchainIdentities, DEFAULT_PROFILE } from '@utils'; // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
declare let window: any;

//#region Initial State
export interface State {
    userSession: UserSession
    error: any,
    publicKey: string;
    privateKey: string;
    backupPhrase: string;
    username: string;
}
export const initialState: State = {
    userSession: {} as UserSession,
    error: null,
    publicKey: '',
    privateKey: '',
    backupPhrase: '',
    username: '',
}
//#endregion Initial State

//#region Actions
export enum ActionTypes {
    CREATE_ACCOUNT_SILENTLY = '[PROFILE] CREATE_BLOCKCHAIN_IDENTITY', //  create backup phrase then login silenty with avatar and user chosen name
    SILENT_LOGIN = '[PROFILE] SILENTLOGIN', // login with saved backup phrase
    BLOCKSTACK_LOGIN = '[PROFILE] BLOCKSTACKLOGIN', // normal flow
    LOGOUT = '[PROFILE] LOGOUT', // logot
    PROFILE_ACTION_STARTED = '[PROFILE] PROFILE_ACTION_STARTED',
    PROFILE_ACTION_SUCCEEDED = '[PROFILE] PROFILE_ACTION_SUCCEEDED',
    PROFILE_ACTION_FAILED = '[PROFILE] PROFILE_ACTION_FAILED'
}

export function createAccountSilently(userChosenName: string, avatar: string) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            const payload = 'login succeeded - see userSession'
            dispatch(succeeded(payload, ActionTypes.CREATE_ACCOUNT_SILENTLY));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.CREATE_ACCOUNT_SILENTLY));
        }
    }
}

export function silentLogin(backupPhrase: string) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            const payload = 'silent login with backup phrase'
            dispatch(succeeded(payload, ActionTypes.SILENT_LOGIN));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.SILENT_LOGIN));
        }
    }
}

export function blockstackLogin() {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            // @ts-ignore
            const payload = 'login with blockstack RN'
            dispatch(succeeded(payload, ActionTypes.BLOCKSTACK_LOGIN));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.BLOCKSTACK_LOGIN));
        }
    }
}

export function logout(token: any) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            // @ts-ignore
            const result = 'logout with Blockstack RN or clear ASync and Secure Storage'
            // todo if 200 then pass success with no payload {}
            // else dispatch error
            dispatch(succeeded(result, ActionTypes.LOGOUT));
        } catch (e) {
            console.log('error', e);
            dispatch(failed(e, ActionTypes.LOGOUT));
        }
    }
}

export function started() {
    return {
        type: ActionTypes.PROFILE_ACTION_STARTED,
        payload: {},
        status: ActionTypes.PROFILE_ACTION_STARTED
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

export function failed(error: any, action: ActionTypes) {
    console.log('[PROFILE_FAILED]', action, error);
    return {
        type: ActionTypes.PROFILE_ACTION_FAILED,
        payload: {
            error,
            action
        },
        status: ActionTypes.PROFILE_ACTION_FAILED,
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
export const getUserSession = createSelector(( (state: State) => state.userSession), s => s)
//#endregion Selectors
