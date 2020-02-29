import { IState , initialState, ActionTypes} from './posts.store'; 
import _ from 'lodash';

export function reducers(state: IState = initialState, action: any) {
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


        default:
            return state
    }
}

