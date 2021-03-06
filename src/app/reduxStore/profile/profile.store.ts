import { UserSession } from 'radiks/src/types/index';
import { createSelector } from 'reselect';
import { 
    configureRadiks,
    createBlockchainIdentity,
    initWallet, 
    makeUserSession, 
    makeProfileJSON, 
    saveProfileJSON  } from './../../utils/profile';
import { setUserGroupId  } from './../places/place.store';
// @ts-ignore
import { getBlockchainIdentities, DEFAULT_PROFILE } from '@utils'; // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
declare let window: any;
import AsyncStorage from '@react-native-community/async-storage';
// @ts-ignore
import SecureStorage from 'react-native-secure-storage';
import { configure, User, UserGroup, GroupInvitation, Model, Central, getConfig } from 'radiks/src/index';
import { Profile } from './../../models/Profile';
import { store } from './../../reduxStore/configureStore';
// @ts-ignore
import localStorage from 'react-native-sync-localstorage';
import { putActiveUser } from './../../reduxStore/posts/posts.store';


const PLACEHOLDER_IMAGE_URL = "https://t4.ftcdn.net/jpg/01/40/46/19/240_F_140461947_tWo9D0W8QQnrhzhCXJbDHIXblMV9BTZv.jpg"

//#region Initial State
export interface State {
    userSession: UserSession
    error: any,
    publicKey: string;
    privateKey: string;
    backupPhrase: string;
    username: string;
    profileJSON: any;
    settings: Profile;
    progress: string; 
    keys?: any; // ref to personalSigningKeyId in mongo radiksType: SigningKey _id=key
    groups?: any;
}
export const initialState: State = {
    userSession: {} as UserSession,
    error: '',
    publicKey: '',
    privateKey: '',
    backupPhrase: '',
    username: '',
    profileJSON: {},
    settings: new Profile({
        image: PLACEHOLDER_IMAGE_URL,
        firstName: "First Name"
    }),
    progress: 'initializing...',
    keys: null,
    groups: null
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
    GET_PROFILE_SETTINGS = '[PROFILE] GET_PROFILE_SETTINGS',
    PUT_PROFILE_SETTINGS = '[PROFILE] PUT_PROFILE_SETTINGS',
    GET_KEYS = '[PROFILE] GET_KEYS',
    GET_GROUPS = '[PROFILE] GET_GROUPS',
    ACCEPT_ROOM_INVITATION = '[PROFILE] ACCEPT_ROOM_INVITATION',
    SET_LOGIN_STATUS = '[PROFILE] SET_LOGIN_STATUS'
}


// called when first load and "Continue as Guest" is clicked
export function createAccountSilently(userChosenName: string, avatar: string) {
    return async (dispatch: any) => {
        dispatch(started('creating account silently...'));
        try {

            let keychain = await initWallet();
            let id = await createBlockchainIdentity(keychain);
            let uSession = makeUserSession(id.appPrivateKey, id.appPublicKey, id.username, id.profileJSON.decodedToken.payload.claim);
           
            configureRadiks(uSession);
            const { userSession } = getConfig();
            let sesh = await User.createWithCurrentUser();
            
            let payload: State = {
                backupPhrase: keychain.backupPhrase,
                publicKey: id.appPublicKey,
                privateKey: id.appPrivateKey,
                userSession: userSession as any,
                username: id.username,
                error: 'none',
                profileJSON: id.profileJSON,
                settings: new Profile({
                    image: PLACEHOLDER_IMAGE_URL,
                    firstName: "First Name"
                }),
                progress: 'logged in'
            }
            dispatch(succeeded(payload, ActionTypes.CREATE_ACCOUNT_SILENTLY));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.CREATE_ACCOUNT_SILENTLY));
        }
    }
}

// called everytime app is loaded and there is a cached UserSession
export function silentLogin(state: State) {
    return async (dispatch: any) => {
        dispatch(started('silently logging in...'));
        try {
            let uSession = makeUserSession(state.privateKey, state.publicKey, state.username, state.profileJSON.decodedToken.payload.claim);
            window.userSession = uSession;
            configureRadiks(uSession);
            // @todo remov this below...i dont think we need this becuase the userSession is cached and recreated on silentLogin
            //let blockstackUser = await User.createWithCurrentUser();
            //let config = getConfig();
            //window.User = blockstackUser;
            const { userSession } = getConfig();
            let sesh = await User.createWithCurrentUser();

            let payload: State = {
                ...state,
                userSession: userSession as any,
                //publicKey: state.publicKey,
                //privateKey: state.privateKey,
                //username: state.username,
                //profileJSON: state.profileJSON,
                // settings: new Profile({
                //     image: PLACEHOLDER_IMAGE_URL, // placeholders
                //     firstName: "" // placeholders
                // }),
                progress: 'logged in'
            }
            // dispatch(getProfileSettings());
            dispatch(succeeded(payload, ActionTypes.SILENT_LOGIN));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.SILENT_LOGIN));
        }
    }
}

export function saveStateFromBlockstackLogin(state: State) {
    return async (dispatch: any) => {
        dispatch(started('silently logging in...'));
        try {
            window.userSession = state.userSession;
            configureRadiks(state.userSession);
            const { userSession } = getConfig();
            let sesh = await User.createWithCurrentUser();
           
            let payload: State = {
                ...state,
                userSession: state.userSession as any,
                publicKey: state.publicKey,
                privateKey: state.privateKey,
                username: state.username,
                profileJSON: state.profileJSON,
                settings: new Profile({
                    image: PLACEHOLDER_IMAGE_URL, // placeholders
                    firstName: "" // placeholders
                }),
                progress: 'logged in'
            }
            dispatch(getProfileSettings());
            dispatch(succeeded(payload, ActionTypes.SILENT_LOGIN));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.SILENT_LOGIN));
        }
    }
}


export function logout() {
    return async (dispatch: any) => {
        dispatch(started('logging out...'));
        try {
            await SecureStorage.removeItem('backupPhrase');
            await SecureStorage.removeItem('GROUP_MEMBERSHIPS_STORAGE_KEY');
            await SecureStorage.removeItem('username');
            const result = 'logout with Blockstack RN or clear Secure Storage';
            await AsyncStorage.removeItem('hasSeenIntro');
            localStorage.setItem("GROUP_MEMBERSHIPS_STORAGE_KEY", "");
            await AsyncStorage.removeItem('GROUP_MEMBERSHIPS_STORAGE_KEY');
            // todo if 200 then pass success with no payload {}
            // else dispatch error
            dispatch(succeeded(result, ActionTypes.LOGOUT));
        } catch (e) {
            console.log('error', e);
            dispatch(failed(e, ActionTypes.LOGOUT));
        }
    }
}

export function getProfileSettings() {
    return async (dispatch: any) => {
        dispatch(started('getting profile settings'));
        try {
            
            // @ts-ignore
            let myProfile = await Profile.fetchOwnList();
            if (myProfile.length > 0){
                const payload = myProfile[myProfile.length - 1];
                dispatch(succeeded(payload, ActionTypes.GET_PROFILE_SETTINGS));
            } else {
                dispatch(failed('no profile settings created yet', ActionTypes.GET_PROFILE_SETTINGS));
            }
            
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.GET_PROFILE_SETTINGS));
        }
    }
}

export function getKeys() {
    return async (dispatch: any) => {
        
        try {
            let keys  = await User.fetchList({_id: store.getState().profile.username});
            const payload = keys[0].attrs.personalSigningKeyId;
            dispatch(succeeded(payload, ActionTypes.GET_KEYS));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.GET_KEYS));
        }
    }
}

export function getGroups() {
    return async (dispatch: any) => {
        
        try {
            let groups  = await UserGroup.myGroups();
            const payload = groups;
            dispatch(succeeded(payload, ActionTypes.GET_GROUPS));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.GET_GROUPS));
        }
    }
}

export function acceptRoomInvitation(inviteId: string){
    return async (dispatch: any) => {
        try {
            await User.createWithCurrentUser();
            const invitation: any = await GroupInvitation.findById(inviteId);
            if (invitation){  
                let resp = await invitation.activate();
                console.log("invite resp=>", resp);
                const payload = resp;
                dispatch(succeeded(payload, ActionTypes.ACCEPT_ROOM_INVITATION));
                dispatch(setUserGroupId(invitation.attrs.userGroupId));
                // dispatch(putActiveUser())
            } else{
                // probably already accepted the invitation. 
                // @todo maybe check localstorage for the group key
                // dispatch(failed("no invitation found", ActionTypes.ACCEPT_ROOM_INVITATION));    
            }
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.ACCEPT_ROOM_INVITATION));
        }
    }
}


export function putProfileSettings(profile: Profile) {
    return async (dispatch: any) => {
        dispatch(started('saving profile settings...'));
        try {
            let resp = await profile.save();
            console.log('radiks resp', resp);
            const payload = resp;
            dispatch(succeeded(payload, ActionTypes.PUT_PROFILE_SETTINGS));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.PUT_PROFILE_SETTINGS));
        }
    }
}

export function setLoginStatus(status: string) {
    return {
        type: ActionTypes.SET_LOGIN_STATUS,
        payload: status,
        status: ActionTypes.SET_LOGIN_STATUS
    };
}


export function started(message: string) {
    return {
        type: ActionTypes.PROFILE_ACTION_STARTED,
        payload: message,
        status: ActionTypes.PROFILE_ACTION_STARTED
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

export function failed(error: any, action: ActionTypes) {
    console.log('[PROFILE_FAILED]', action, error);
    return {
        type: ActionTypes.PROFILE_ACTION_FAILED,
        payload: {
            error,
            action,
            progress: `An error happened ${error}`
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
        
        case ActionTypes.SET_LOGIN_STATUS: {
            return  { 
                ...state,
                progress: action.payload
            }
        }

        case ActionTypes.LOGOUT: {
            return  { 
                ...initialState,
                progress: 'logged out'
            }
        }

        case ActionTypes.GET_PROFILE_SETTINGS : {
            return {
                ...state,
                settings: action.payload,
                progress: 'got profile settings...'
            }
        }

        case ActionTypes.GET_KEYS : {
            return {
                ...state,
                keys: action.payload
            }
        }

        case ActionTypes.GET_GROUPS : {
            return {
                ...state,
                groups: action.payload
            }
        }

        case ActionTypes.PUT_PROFILE_SETTINGS : {
            return {
                ...state,
                settings: action.payload,
                progress: 'saved profile settings...'
            }
        }

        case ActionTypes.PROFILE_ACTION_STARTED: {
            console.log("PROFILE_STARTED");
            return {
                ...state,
                progress: action.payload
            }
        }

        case ActionTypes.PROFILE_ACTION_FAILED: {
            console.log("PROFILE_FAILED", action.payload);
            return {
                ...state,
                error: action.payload,
                progress: action.payload.progress
            }
        }

        case ActionTypes.ACCEPT_ROOM_INVITATION: {
            return {
                ...state,
            }
        }

        default:
            return state
    }
}
//#endregion Reducers

//#region Selectors
export const profileState = createSelector(( (state: State) => state), s => s)
export const getUserSession = createSelector(( (state: State) => state), s => s.userSession)
export const getProfileState = createSelector( (state: State) => state, state => state);
export const getUserName= createSelector( (state: State) => state, state => state.username);
export const profileSettingsSelector = createSelector( (state: State) => state, state => state.settings);
//#endregion Selectors
