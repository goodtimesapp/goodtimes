
import { createSelector } from 'reselect';
import { configure, User, UserGroup, GroupInvitation, Model, Central } from './../../radiks/src/index';
import { Post }  from './../../models/Post';
import Comment from './../../models/Comment';


//#region Initial State
export interface State {
    posts: Array<Post>
}
export const initialState: State = {
    posts: []
}
//#endregion Initial State

//#region Actions
export enum ActionTypes {
    GET_POST = '[POSTS] GET_POST',
    PUT_POST = '[POSTS] PUT_POST', 
    DELETE_POST = '[POSTS] DELETE_POST',
    ADD_POST_FROM_WEBSOCKET = '[POSTS] ADD_POST_FROM_WEBSOCKET',
    POSTS_ACTION_STARTED = '[POSTS] POSTS_ACTION_STARTED',
    POSTS_ACTION_SUCCEEDED = '[POSTS] POSTS_ACTION_SUCCEEDED',
    POSTS_ACTION_FAILED = '[POSTS] POSTS_ACTION_FAILED'
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
            let resp = await post.save();
            console.log('radiks resp', resp);
            const payload = resp;
            dispatch(succeeded(payload, ActionTypes.PUT_POST));
        } catch (e) {
            console.log('error', e)
            dispatch(failed(e, ActionTypes.PUT_POST));
        }
    }
}

export function addPostFromWebSocket(post: any) {
    return async (dispatch: any) => {
        try {
            let payload = post;
            dispatch(succeeded(payload, ActionTypes.ADD_POST_FROM_WEBSOCKET));
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



export function started() {
    return {
        type: ActionTypes.POSTS_ACTION_STARTED,
        payload: {},
        status: ActionTypes.POSTS_ACTION_STARTED
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

        case ActionTypes.GET_POST: {
            return {
                ...state, 
                posts: action.payload
            }
        }

        case ActionTypes.PUT_POST : {
            let clone = [...state.posts];
            clone.unshift(action.payload);
            return {
                ...state,
                posts: clone
            }
        }

        case ActionTypes.ADD_POST_FROM_WEBSOCKET : {
            return {
                ...state,
                posts: [
                    ...state.posts,
                    action.payload
                ]
            }
        }
        

        case ActionTypes.DELETE_POST: {
            return  state;
        }

        case ActionTypes.POSTS_ACTION_STARTED: {
            console.log("POSTS_STARTED");
            return  state;
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
export const posts = createSelector(( (state: State) => state), s => s.posts)
//#endregion Selectors
