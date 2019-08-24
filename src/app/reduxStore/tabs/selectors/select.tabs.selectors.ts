import { State } from '../../index';
import { createSelector } from 'reselect';

/*
 * Get the TABS state from the root state
 */
const getTabsState = ((state: State) => state.tabs)

/*
 * Getting TABS array from todos State
 */
export const getTabs = createSelector([getTabsState], s => s.tabs)
