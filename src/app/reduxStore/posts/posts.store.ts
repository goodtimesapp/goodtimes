
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

//#region Initial State
export interface State {
    posts: Array<Post>; // Array<Post>,
    markers: Array<any>;
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
    ]
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
    ADD_JOINER_FROM_WEBSOCKET = '[POSTS] ADD_JOINER_FROM_WEBSOCKET',
    POSTS_ACTION_STARTED = '[POSTS] POSTS_ACTION_STARTED',
    POSTS_ACTION_SUCCEEDED = '[POSTS] POSTS_ACTION_SUCCEEDED',
    POSTS_ACTION_FAILED = '[POSTS] POSTS_ACTION_FAILED'
}

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


export function getPosts(filter: any = {}) {
    return async (dispatch: any) => {
        dispatch(started());
        try {
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

            // get the group to post to 

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
            debugger;
            let p = await new Post(post).decrypt();
            let payload = p.attrs;

            // markers and pics
            
            dispatch(succeeded(payload, ActionTypes.ADD_POST_FROM_WEBSOCKET));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.ADD_POST_FROM_WEBSOCKET));
        }
    }
}

export function addJoinerFromWebSocket(data: any) {
    return async (dispatch: any) => {
        try {
            let payload;

            // radiks accept invitation

            try {
                payload = {
                    name: data.user,
                    coordinate: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    },
                    image: data.image.uri
                };
            } catch (e) {
                console.error('addJoinerFromWebSocket error', e)
            }

            if (payload) {
                dispatch(succeeded(payload, ActionTypes.ADD_POST_FROM_WEBSOCKET));
            }
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.ADD_POST_FROM_WEBSOCKET));
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
            error,
            action
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

        case ActionTypes.PUT_POST: {
            return {
                ...state,
                posts: [
                    ...state.posts,
                    action.payload
                ]
            }
        }

        case ActionTypes.ADD_JOINER_FROM_WEBSOCKET: {
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
                    ],
                    markers: initialState.markers
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
                error: action.payload
            }
        }

        default:
            return state
    }
}
//#endregion Reducers

//#region Selectors
export const postsState = createSelector((state: State) => state, state => state);

//#endregion Selectors
