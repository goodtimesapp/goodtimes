import { combineReducers } from 'redux'
import * as fromLocations from './locations/reducers/reduce.locations';
import * as fromTabs from './tabs/reducers/reduce.tabs.reducers';
import * as fromProfile from './profile/profile.store';
import * as fromGlobal from './global/global.store';
import * as fromPosts from './posts/posts.store';
import * as fromWebsockets from './websockets/websockets.store';
import * as fromPlaces from './places/place.store';

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface State {
    locations: fromLocations.State,
    tabs: fromTabs.State,
    profile: fromProfile.State,
    global: fromGlobal.State,
    posts: fromPosts.State,
    websockets: fromWebsockets.State,
    places: fromPlaces.State
}

/*
 * initialState of the app
 */
export const initialState: State = {
  locations: fromLocations.initialState,  
  tabs: fromTabs.initialState,
  profile: fromProfile.initialState,
  global: fromGlobal.initialState,
  posts: fromPosts.initialState,
  websockets: fromWebsockets.initialState,
  places: fromPlaces.initialState
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<State>({
  locations: fromLocations.reducer,
  tabs: fromTabs.reducer,
  profile: fromProfile.reducers,
  global: fromGlobal.reducers,
  posts: fromPosts.reducers,
  websockets: fromWebsockets.reducers,
  places: fromPlaces.reducers
})