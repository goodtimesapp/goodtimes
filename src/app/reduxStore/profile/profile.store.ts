import { UserSession } from './../../radiks/src/types/index';
import { createSelector } from 'reselect';
import { 
    configureRadiks,
    createBlockchainIdentity,
    initWallet, 
    makeUserSession, 
    makeProfileJSON, 
    saveProfileJSON  } from './../../utils/profile';
// @ts-ignore
import { getBlockchainIdentities, DEFAULT_PROFILE } from '@utils'; // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
declare let window: any;
import AsyncStorage from '@react-native-community/async-storage';
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import { configure, User, UserGroup, GroupInvitation, Model, Central } from './../../radiks/src/index';


//#region Initial State
export interface State {
    userSession: UserSession
    error: any,
    publicKey: string;
    privateKey: string;
    backupPhrase: string;
    username: string;
    profileJSON: any
}
export const initialState: State = {
    userSession: {} as UserSession,
    error: '',
    publicKey: '',
    privateKey: '',
    backupPhrase: '',
    username: '',
    profileJSON: {}
}
//#endregion Initial State

//#region Actions
export enum ActionTypes {
    CREATE_ACCOUNT_SILENTLY = '[PROFILE] CREATE_BLOCKCHAIN_IDENTITY', //  create backup phrase then login silenty with avatar and user chosen name
    SILENT_LOGIN = '[PROFILE] SILENTLOGIN', // login with saved backup phrase
    LOGOUT = '[PROFILE] LOGOUT', // logot
    PROFILE_ACTION_STARTED = '[PROFILE] PROFILE_ACTION_STARTED',
    PROFILE_ACTION_SUCCEEDED = '[PROFILE] PROFILE_ACTION_SUCCEEDED',
    PROFILE_ACTION_FAILED = '[PROFILE] PROFILE_ACTION_FAILED',
    PUT_PROFILE_SETTINGS = 'PUT_PROFILE_SETTINGS',
}

export function createAccountSilently(userChosenName: string, avatar: string) {
    return async (dispatch: any) => {
        dispatch(started());
        try {

            let keychain = await initWallet();
            let id = await createBlockchainIdentity(keychain);
            let userSession = makeUserSession(id.appPrivateKey, id.appPublicKey, id.username, id.profileJSON.decodedToken.payload.claim);
            window.userSession = userSession;
            configureRadiks(userSession);
            let blockstackUser = await User.createWithCurrentUser();
            const payload = {
                backupPhrase: keychain.backupPhrase,
                publicKey: id.appPublicKey,
                privateKey: id.appPrivateKey,
                userSession: userSession,
                username: id.username,
                error: 'none',
                profileJSON: id.profileJSON
            }
            dispatch(succeeded(payload, ActionTypes.CREATE_ACCOUNT_SILENTLY));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.CREATE_ACCOUNT_SILENTLY));
        }
    }
}

export function silentLogin(state: State) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
      
            let userSession = makeUserSession(state.privateKey, state.publicKey, state.username, state.profileJSON.decodedToken.payload.claim);
            window.userSession = userSession;
            configureRadiks(userSession);
            let blockstackUser = await User.createWithCurrentUser();
            let payload = {
                ...state,
                userSession: userSession,
                publicKey: state.publicKey,
                privateKey: state.privateKey,
                username: state.username,
                profileJSON: state.profileJSON
            }
            dispatch(succeeded(payload, ActionTypes.SILENT_LOGIN));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.SILENT_LOGIN));
        }
    }
}


export function logout() {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            await SecureStorage.removeItem('backupPhrase');
            await SecureStorage.removeItem('GROUP_MEMBERSHIPS_STORAGE_KEY');
            await SecureStorage.removeItem('username');
            const result = 'logout with Blockstack RN or clear Secure Storage';
            await AsyncStorage.removeItem('hasSeenIntro');
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
        payload: payload,
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

        case ActionTypes.CREATE_ACCOUNT_SILENTLY: {
            return action.payload
        }

        case ActionTypes.SILENT_LOGIN: {
            return action.payload
        }
        

        case ActionTypes.LOGOUT: {
            return  { 

            }
        }

        case ActionTypes.PROFILE_ACTION_STARTED: {
            console.log("PROFILE_STARTED");
        }

        case ActionTypes.PROFILE_ACTION_FAILED: {
            console.log("PROFILE_FAILED", action.payload);
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
export const getUserSession = createSelector(( (state: State) => state), s => s.userSession)
export const getProfileState = createSelector( (state: State) => state, state => state);
export const getUserName= createSelector( (state: State) => state, state => state.username);
//#endregion Selectors
