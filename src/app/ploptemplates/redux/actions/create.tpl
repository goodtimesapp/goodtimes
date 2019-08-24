import { {{pascalCase name}} } from './../../../models/{{pascalCase name}}';
import { API_KEY } from 'react-native-dotenv';

/*
 * In order to automatically generate id for our model
 */
let nextId = 0;

/*
 * We're defining every action name constant here
 * We're using Typescript's enum
 * Typescript understands enum better 
 */
export enum ActionTypes {
  CREATE_{{constantCase name}} = '[{{constantCase name}}] CREATE_{{constantCase name}}',
  CREATE_{{constantCase name}}_STARTED = '[{{constantCase name}}] CREATE_{{constantCase name}}_STARTED',
  CREATE_{{constantCase name}}_SUCCEEDED = '[{{constantCase name}}] CREATE_{{constantCase name}}_SUCCEEDED',
  CREATE_{{constantCase name}}_FAILED = '[{{constantCase name}}] CREATE_{{constantCase name}}_FAILED',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface Create{{pascalCase name}}Action { type: ActionTypes.CREATE_{{constantCase name}}, payload: {}, status: ActionTypes.CREATE_{{constantCase name}} };
export interface Create{{pascalCase name}}SucceededAction { type: ActionTypes.CREATE_{{constantCase name}}_SUCCEEDED, payload: { {{camelCase name}}s: {{pascalCase name}}[] }, status: ActionTypes.CREATE_{{constantCase name}}_SUCCEEDED };
export interface Create{{pascalCase name}}StartedAction { type: ActionTypes.CREATE_{{constantCase name}}_STARTED, payload: {}, status: ActionTypes.CREATE_{{constantCase name}}_STARTED };
export interface Create{{pascalCase name}}FailedAction { type: ActionTypes.CREATE_{{constantCase name}}_FAILED, payload: { error: string }, status: ActionTypes.CREATE_{{constantCase name}}_FAILED };

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function create{{pascalCase name}}(data: any) {  
  return (dispatch: any)  => {
    dispatch(create{{pascalCase name}}Started());
    try{
      fetch(
        'https://url.com/api', {
          method: 'POST',
          headers: {
            authorization: API_KEY,
          },
          body: JSON.stringify(data)
        }
      ).then(response => response.json()).then(result => {
        console.log('created', result);
        dispatch(create{{pascalCase name}}Succeeded(result));
      });
      
    } catch (e){
      console.log('error creating {{pascalCase name}}', e)
    }
  }
}

export function create{{pascalCase name}}Started(): Create{{pascalCase name}}StartedAction {
  return {
    type: ActionTypes.CREATE_{{constantCase name}}_STARTED,
    payload: {},
    status: ActionTypes.CREATE_{{constantCase name}}_STARTED
  };
}

export function create{{pascalCase name}}Succeeded(payload: any): Create{{pascalCase name}}SucceededAction {
  console.log(payload);
  return {
    type: ActionTypes.CREATE_{{constantCase name}}_SUCCEEDED,
    payload: {
      {{camelCase name}}s: payload.YOURDATA
    },
    status: ActionTypes.CREATE_{{constantCase name}}_SUCCEEDED
  }
}

export function create{{pascalCase name}}Failed(error: any): Create{{pascalCase name}}FailedAction {
  return {
    type: ActionTypes.CREATE_{{constantCase name}}_FAILED,
    payload: error,
    status: ActionTypes.CREATE_{{constantCase name}}_FAILED,
  };
}


/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = Create{{pascalCase name}}Action | Create{{pascalCase name}}StartedAction | Create{{pascalCase name}}SucceededAction | Create{{pascalCase name}}FailedAction 