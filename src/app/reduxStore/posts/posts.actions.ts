import { initialState, IState } from './posts.store';
import { User } from 'radiks/src';
import { Post } from './../../models/Post';
import IAction from './../../models/common/IAction';
import uuidv4 from 'uuid/v4';
import { ActiveUser, IActiveUser } from './../../models/ActiveUser';
import { store } from './../configureStore';
import _ from 'lodash';

//#region Actions
export enum ActionTypes {
    SET_POSTS_LIST = 'SET_POSTS_LIST',
    SET_POSTS_LIST_COMPLETED = 'SET_POSTS_LIST_COMPLETED',
    GET_CHATS = '[POSTS] GET_CHATS',
    GET_POST = '[POSTS] GET_POST',
    PUT_POST = '[POSTS] PUT_POST',
    DELETE_POST = '[POSTS] DELETE_POST',
    CLEAR_POSTS = '[POSTS] CLEAR_POST',
    ADD_POST_FROM_WEBSOCKET = '[POSTS] ADD_POST_FROM_WEBSOCKET',
    PUT_ACTIVE_USER = '[POSTS] PUT_ACTIVE_USER',
    ADD_ACTIVE_USER_FROM_WEBSOCKET = '[POSTS] ADD_ACTIVE_USER_FROM_WEBSOCKET',
    POSTS_ACTION_STARTED = '[POSTS] POSTS_ACTION_STARTED',
    POSTS_ACTION_SUCCEEDED = '[POSTS] POSTS_ACTION_SUCCEEDED',
    POSTS_ACTION_FAILED = '[POSTS] POSTS_ACTION_FAILED',
    BEGIN_POSTS_SAGA = '[POSTS SAGA] BEGIN_POSTS_SAGA',
    BEGIN_POSTS_COMPLETED = 'BEGIN_POSTS_COMPLETED'
}
export const actions = {
    setPostsList, 
    setPostsListCompleted,
    getChats,
    getPosts,
    putPost,
    addPostFromWebSocket,
    putActiveUser,
    addActiveUserFromWebSocket,
    deletePost,
    clearPosts,
    started,
    succeeded,
    failed
}

function getChats() {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            const payload = initialState.posts;
            dispatch(succeeded(payload, ActionTypes.GET_CHATS));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.GET_CHATS));
        }
    }
}

function setPostsList(geohash: string): IAction<ActionTypes.SET_POSTS_LIST,  string> {
    return {
        type: ActionTypes.SET_POSTS_LIST,
        payload: geohash,
      };
}

function setPostsListCompleted(geohash: string, error?: any): IAction<ActionTypes.SET_POSTS_LIST_COMPLETED, string> {
    return {
        type: ActionTypes.SET_POSTS_LIST_COMPLETED,
        payload: geohash,
        error: error ? error : null
      };
}


function getPosts(filter: any = {}) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            await User.createWithCurrentUser();
            let posts = await Post.fetchList(filter);
            const payload = posts;
            dispatch(succeeded(payload, ActionTypes.GET_POST));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.GET_POST));
        }
    }
}

function putPost(post: Post) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            post.attrs.isSynced = false;
            post.attrs.clientGuid = uuidv4();
            let activeUser = new ActiveUser();
            let d = store.getState();
            post.attrs.userGroupId = d.places.userGroupId;
            // get the group to post to 
            await User.createWithCurrentUser();
            dispatch(succeeded(post, ActionTypes.PUT_POST));
            let resp = await post.save();
            console.log('radiks resp', resp);
            const payload = resp;
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.PUT_POST));
        }
    }
}

function addPostFromWebSocket(post: any) {
    return async (dispatch: any) => {
        try {
            let p = await new Post(post).decrypt();
            let payload = p.attrs;
            dispatch(succeeded(payload, ActionTypes.ADD_POST_FROM_WEBSOCKET));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.ADD_POST_FROM_WEBSOCKET));
        }
    }
}

function putActiveUser() {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            await User.createWithCurrentUser();
            let activeUser = new ActiveUser();
            let d = store.getState();
            activeUser.attrs = {
                awayMessage: 'away message',
                user: d.profile.username,
                userGroupId: d.places.userGroupId,
                avatar: d.profile.settings.attrs.image,
                // acl: {
                //     distance: 1000,
                //     expires: 9999999,
                //     geohash: d.places.geohash,
                //     location: [d.places.currentLocation.latitude,d.places.currentLocation.longitude],
                //     readers: ["*"]
                // }
            } as IActiveUser
            // @ts-ignore
            //let resp = await activeUser.save();
            //const payload = resp;
            dispatch(succeeded("payload", ActionTypes.PUT_ACTIVE_USER));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.PUT_ACTIVE_USER));
        }
    }
}

function addActiveUserFromWebSocket(activeUser: IActiveUser){
    return async (dispatch: any) => {
        try {
            let payload;
            debugger;
            // @ts-ignore
            let aUser: IActiveUser = new ActiveUser(activeUser).decrypt();
            try {
                payload = {
                    name: aUser.user,
                    coordinate: {
                        latitude: aUser.acl.location[0],
                        longitude: aUser.acl.location[1]
                    },
                    image: aUser.avatar
                };
            } catch (e) {
                console.error('addActiveUserFromWebSocket error', e)
            }

            if (payload) {
                dispatch(succeeded(payload, ActionTypes.ADD_ACTIVE_USER_FROM_WEBSOCKET));
            }
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.ADD_ACTIVE_USER_FROM_WEBSOCKET));
        }
    }
}

function deletePost(id: string) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            const payload = {

            }
            dispatch(succeeded(payload, ActionTypes.DELETE_POST));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.DELETE_POST));
        }
    }
}

function clearPosts() {
    return async (dispatch: any) => {
        dispatch(started());
        try {
            const payload: any = []
            dispatch(succeeded(payload, ActionTypes.CLEAR_POSTS));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.DELETE_POST));
        }
    }
}



function started() {
    return {
        type: ActionTypes.POSTS_ACTION_STARTED,
        payload: {},
        status: ActionTypes.POSTS_ACTION_STARTED
    };
}

function succeeded(payload: any, action: ActionTypes) {
    // console.log(payload);
    return {
        type: action,
        payload: payload,
        status: action
    }
}

function failed(error: any, action: ActionTypes) {
    console.log('[POSTS_FAILED]', action, error);
    return {
        type: ActionTypes.POSTS_ACTION_FAILED,
        payload: {
            error: error,
            action: action
        },
        status: ActionTypes.POSTS_ACTION_FAILED,
    };
}

export declare namespace ActionReturnTypes {
    export type SetPostsList = ReturnType<typeof setPostsList>;
    export type SetPostsListCompleted = ReturnType<typeof setPostsListCompleted>;
}
  
  export type IComponentActions =
    | ReturnType<typeof setPostsList>
    | ReturnType<typeof setPostsListCompleted>
   