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
  GET_{{constantCase name}} = '[{{constantCase name}}] GET_{{constantCase name}}',
  GET_{{constantCase name}}_STARTED = '[{{constantCase name}}] GET_{{constantCase name}}_STARTED',
  GET_{{constantCase name}}_SUCCEEDED = '[{{constantCase name}}] GET_{{constantCase name}}_SUCCEEDED',
  GET_{{constantCase name}}_FAILED = '[{{constantCase name}}] GET_{{constantCase name}}_FAILED',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface Get{{pascalCase name}}Action { type: ActionTypes.GET_{{constantCase name}}, payload: {}, status: ActionTypes.GET_{{constantCase name}} };
export interface Get{{pascalCase name}}SucceededAction { type: ActionTypes.GET_{{constantCase name}}_SUCCEEDED, payload: { {{camelCase name}}s: {{pascalCase name}}[] }, status: ActionTypes.GET_{{constantCase name}}_SUCCEEDED };
export interface Get{{pascalCase name}}StartedAction { type: ActionTypes.GET_{{constantCase name}}_STARTED, payload: {}, status: ActionTypes.GET_{{constantCase name}}_STARTED };
export interface Get{{pascalCase name}}FailedAction { type: ActionTypes.GET_{{constantCase name}}_FAILED, payload: { error: string }, status: ActionTypes.GET_{{constantCase name}}_FAILED };

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function get{{pascalCase name}}() {  
  return (dispatch: any)  => {
    dispatch(get{{pascalCase name}}Started());
    try{
      fetch(
        'https://url.com/api', {
          method: 'GET',
          headers: {
            authorization: API_KEY,
          }
        }
      ).then(response => response.json()).then(result => {
        console.log('get {{pascalCase name}}', result);
        dispatch(get{{pascalCase name}}Succeeded(result));
      }); 
    } catch (e){
      console.log('error', e)
    }
  }
}

export function get{{pascalCase name}}Started(): Get{{pascalCase name}}StartedAction {
  return {
    type: ActionTypes.GET_{{constantCase name}}_STARTED,
    payload: {},
    status: ActionTypes.GET_{{constantCase name}}_STARTED
  };
}

export function get{{pascalCase name}}Succeeded(payload: any): Get{{pascalCase name}}SucceededAction {
  console.log(payload);
  return {
    type: ActionTypes.GET_{{constantCase name}}_SUCCEEDED,
    payload: {
      {{camelCase name}}s: payload.YOURDATA
    },
    status: ActionTypes.GET_{{constantCase name}}_SUCCEEDED
  }
}

export function get{{pascalCase name}}Failed(error: any): Get{{pascalCase name}}FailedAction {
  return {
    type: ActionTypes.GET_{{constantCase name}}_FAILED,
    payload: error,
    status: ActionTypes.GET_{{constantCase name}}_FAILED,
  };
}

/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = Get{{pascalCase name}}Action | Get{{pascalCase name}}StartedAction | Get{{pascalCase name}}SucceededAction | Get{{pascalCase name}}FailedAction 