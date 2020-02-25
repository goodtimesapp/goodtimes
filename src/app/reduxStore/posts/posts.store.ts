
import { createSelector } from 'reselect';
import { Dimensions } from 'react-native';
import { Post } from './../../models/Post';
import Comment from './../../models/Comment';
import _ from 'lodash';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE = 47.122036;
const LONGITUDE = -88.564358;
import uuidv4 from 'uuid/v4';
import { IActiveUser, ActiveUser } from './../../models/ActiveUser';
import { ACL } from './../../models/ACL';
import { store } from './../../reduxStore/configureStore';
import { User, Model } from 'radiks/src';
import { call, put, takeEvery, takeLatest, take, fork } from 'redux-saga/effects'
import { AppAction } from './../../utils/redux-utils';



//#region Initial State
export interface State {
    posts: Array<Post>; // Array<Post>,
    markers: Array<any>;
    error: any;
}
export const initialState: State = {
    posts: [
        new Post({
            _id: '44',
            image: 'https://banter-pub.imgix.net/users/nicktee.id',
            user: 'Nick',
            tags: ["#coffee"],
            hashtagColor: "#4c9aff",
            time: "5 mins",
            content: "44",
            pullRight: true,
            location: [2, 3],
            clientGuid: '30c9854a-290b-4bfa-b089-8e0864444007',
            geohash: 'a'
        })
    ],
    markers: [
        {
            name: 'Nick',
            coordinate: {
                latitude: 47.122036,
                longitude: -88.564358
            },
            image: 'https://banter-pub.imgix.net/users/nicktee.id'
        }
    ],
    error: {}
}
//#endregion Initial State

//#region Actions
export enum ActionTypes {
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
    YIELDY = "YIELDY"
}

// #region sagas

// Get Posts Saga (Main Saga) 
// =>
//  1) Gotta be logged in with a token [worker saga] 
//  2) Gotta have geohash [worker saga] 
//  3) Gotta have a room key 
//  4) Finally you can get posts for a room
//
// call like this from a component 
//    store.dispatch( {type: '[POSTS SAGA] BEGIN_POSTS_SAGA', data: 'd1' } )
export function * postsSaga(action: AppAction) {
    console.log('yielding for BEGIN_POSTS_SAGA');
    const { geohash } = yield take(ActionTypes.BEGIN_POSTS_SAGA);
    console.log(`called ${ActionTypes.BEGIN_POSTS_SAGA}`, geohash);
    let postsResponse =  yield call( getPostsApi, { geohash } ); // call the getPostsApi and wait for a response
    yield put({   // dispatch the posts to the reducer
        type: ActionTypes.POSTS_ACTION_SUCCEEDED,
        payload: postsResponse,
        status: ActionTypes.POSTS_ACTION_SUCCEEDED
    });
}
// //#endregion sagas


export function getChats() {
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

export async function getPostsApi(filter: any = {}): Promise<any>{
    await User.createWithCurrentUser();
    let posts = Post.fetchList(filter);
    return posts;
}

export function getPosts(filter: any = {}) {
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

export function putPost(post: Post) {
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

export function addPostFromWebSocket(post: any) {
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

export function putActiveUser() {
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

export function addActiveUserFromWebSocket(activeUser: IActiveUser){
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

export function deletePost(id: string) {
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

export function clearPosts() {
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



export function started() {
    return {
        type: ActionTypes.POSTS_ACTION_STARTED,
        payload: {},
        status: ActionTypes.POSTS_ACTION_STARTED
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

// export type Action = any;
//#endregion Actions

//#region Reducers
export function reducers(state: State = initialState, action: any) {
    switch (action.type) {

        case ActionTypes.GET_CHATS: {
            return {
                ...state,
                posts: action.payload
            }
        }

        case ActionTypes.GET_POST: {
            return {
                ...state,
                posts: action.payload
            }
        }

        case ActionTypes.POSTS_ACTION_SUCCEEDED: {
            return {
                ...state,
                posts: action.payload
            }
        }

        case ActionTypes.PUT_POST: {
            return {
                ...state,
                posts: [
                    ...state.posts,
                    action.payload
                ]
            }
        }

        case ActionTypes.ADD_ACTIVE_USER_FROM_WEBSOCKET: {
            return {
                ...state,
                markers: [
                    ...state.markers,
                    action.payload
                ]
            }
        }

        case ActionTypes.ADD_POST_FROM_WEBSOCKET: {
            try {
                if (!action.payload.attrs) {
                    action.payload = {
                        attrs: action.payload
                    }
                }
                let clientGuid = action.payload.attrs.clientGuid;
                let poppedPosts = state.posts;
                if (clientGuid) {
                    let existingPost = state.posts.find(g => g.attrs.clientGuid == clientGuid);
                    if (existingPost) {
                        _.remove(poppedPosts, existingPost);
                    }
                }

                return {
                    ...state,
                    posts: [
                        ...poppedPosts,
                        action.payload
                    ]
                }
            } catch (e) {
                console.error('ADD_POST_FROM_WEBSOCKET reducer error', e);
                return state;
            }

        }


        case ActionTypes.DELETE_POST: {
            return state;
        }

        case ActionTypes.CLEAR_POSTS: {
            return {
                ...state,
                posts: []
            }
        }


        case ActionTypes.POSTS_ACTION_STARTED: {
            console.log("POSTS_STARTED");
            return state;
        }

        case ActionTypes.POSTS_ACTION_FAILED: {
            console.log("POSTS_FAILED", action.payload);
            return {
                ...state,
                error: {
                    message: action.payload.error.message,
                    action: action.payload.error.action
                }
            }
        }

        case ActionTypes.BEGIN_POSTS_SAGA: {
            console.log("BEGIN_POSTS_SAGA REDUCER");
            return {
                ...state
            };
        }

        case ActionTypes.YIELDY: {
            console.log("YIELDY");
            return {
                ...state
            };
        }

        default:
            return state
    }
}
//#endregion Reducers

//#region Selectors
export const postsState = createSelector((state: State) => state, state => state);

//#endregion Selectors
