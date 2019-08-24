import { {{pascalCase name}} } from './../../../models/{{pascalCase name}}';
import { ActionTypes, Action } from '../actions/get.{{camelCase name}}.actions'


// Define our State interface for the current reducer
export interface State {
  {{camelCase name}}s: {{pascalCase name}}[]
}

// Define our initialState
export const initialState: State = {
  {{camelCase name}}s: [] 
}

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled. Since we are in todos reducer, action type is Action defined in our actions/todos file.
 */
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case ActionTypes.GET_{{constantCase name}}_SUCCEEDED: {
      const response = action.payload.{{camelCase name}}s
      return {
        ...state,
        {{camelCase name}}s: [...response] 
      }
    }

    case ActionTypes.GET_{{constantCase name}}_STARTED :{
      console.log("STARTED");
    }

    case ActionTypes.GET_{{constantCase name}}_FAILED :{
      console.log("FAILED", action.payload);
    }

    default:
      return state
  }
}