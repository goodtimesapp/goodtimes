import { combineReducers } from 'redux'
import * as fromLocations from './locations/reducers/reduce.locations';
import * as fromTabs from './tabs/reducers/reduce.tabs.reducers';
import * as fromProfile from './profile/profile.store';

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface State {
    locations: fromLocations.State,
    tabs: fromTabs.State,
    profile: fromProfile.State
}

/*
 * initialState of the app
 */
export const initialState: State = {
  locations: fromLocations.initialState,  
  tabs: fromTabs.initialState,
  profile: fromProfile.initialState
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<State>({
  locations: fromLocations.reducer,
  tabs: fromTabs.reducer,
  profile: fromProfile.reducers
})