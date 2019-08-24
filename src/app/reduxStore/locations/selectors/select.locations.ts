import { State } from './../../index';
import { createSelector } from 'reselect';

/*
 * Get the todos state from the root state
 */
const getLocationsState = ((state: State) => state.locations)

/*
 * Getting todos array from todos State
 */
export const getLocations = createSelector([getLocationsState], s => s.locations)
// export const getFirstLocationName = createSelector([getLocationsState], s => s.locations[0].title)