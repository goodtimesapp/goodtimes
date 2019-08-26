import {Location} from '../../../models/Location'
import { ActionTypes, Action } from '../actions/get.locations'


// Define our State interface for the current reducer
export interface State {
  locations: Location[]
}

// Define our initialState
export const initialState: State = {
  locations: [] // We don't have any todos at the start of the app
}

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled. Since we are in todos reducer, action type is Action defined in our actions/todos file.
 */
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case ActionTypes.GET_LOCATIONS_SUCCEEDED: {
      
      // console.warn("SUCCEDED");

      /*
       * We have autocompletion here
       * Typescript knows the action is type of AddTodoAction thanks to the ActionTypes enum
       * todo is type of Todo
       */
        const locs = action.payload.locations
        // console.warn(locs);
        return {
          ...state,
          locations: [...locs] 
        }
    }

    case ActionTypes.GET_LOCATIONS_STARTED :{
      // console.warn("STARTED");
    }

    case ActionTypes.GET_LOCATIONS_FAILED :{
      // console.warn("FAILED", action.payload);
    }

    default:
      return state
  }
}