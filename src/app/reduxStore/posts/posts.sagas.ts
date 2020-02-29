import { call, put, takeEvery, takeLatest, take, fork } from 'redux-saga/effects'
import { AppAction } from './../../utils/redux-utils';
import { ActionTypes, IComponentActions } from './posts.store';
import { getPostsApi } from './posts.api';

export function * rootWatcherSaga(){
    yield takeLatest(ActionTypes.SET_POSTS_LIST, postsSaga);
}



// Get Posts Saga (Main Saga) 
// =>
//  1) Gotta be logged in with a token [worker saga] 
//  2) Gotta have geohash [worker saga] 
//  3) Gotta have a room key 
//  4) Finally you can get posts for a room
//
// call like this from a component 
//    store.dispatch( {type: 'SET_POSTS_LIST', payload: 'a' } } )
export function * postsSaga(action: IComponentActions) {
    const geohash = action.payload;
    console.log('yielding for SET_POSTS_LIST');
    console.log(`called ${ActionTypes.SET_POSTS_LIST_COMPLETED}`, geohash);
    let postsResponse =  yield call( getPostsApi, { geohash } ); // call the getPostsApi and wait for a response
    yield put({   // dispatch the posts to the reducer
        type: ActionTypes.SET_POSTS_LIST_COMPLETED,
        payload: postsResponse,
        error: null
    });
}

export const sagas = {
    rootWatcherSaga,
    postsSaga,
}
