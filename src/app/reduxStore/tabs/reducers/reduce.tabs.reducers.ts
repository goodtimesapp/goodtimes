import { Tabs } from './../../../models/Tabs';
import { ActionTypes, Action } from '../actions/get.tabs.actions'


// Define our State interface for the current reducer
export interface State {
  tabs: Tabs[]
}

// Define our initialState
export const initialState: State = {
  tabs: [] 
}

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled. Since we are in todos reducer, action type is Action defined in our actions/todos file.
 */
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case ActionTypes.GET_TABS_SUCCEEDED: {
      const response = action.payload.tabs
      return {
        ...state,
        tabs: [...response] 
      }
    }

    case ActionTypes.GET_TABS_STARTED :{
      console.log("STARTED");
    }

    case ActionTypes.GET_TABS_FAILED :{
      console.log("FAILED", action.payload);
    }

    default:
      return state
  }
}