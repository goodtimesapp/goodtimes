import { Tabs } from './../../../models/Tabs';
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
  CREATE_TABS = '[TABS] CREATE_TABS',
  CREATE_TABS_STARTED = '[TABS] CREATE_TABS_STARTED',
  CREATE_TABS_SUCCEEDED = '[TABS] CREATE_TABS_SUCCEEDED',
  CREATE_TABS_FAILED = '[TABS] CREATE_TABS_FAILED',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface CreateTabsAction { type: ActionTypes.CREATE_TABS, payload: {}, status: ActionTypes.CREATE_TABS };
export interface CreateTabsSucceededAction { type: ActionTypes.CREATE_TABS_SUCCEEDED, payload: { tabs: Tabs[] }, status: ActionTypes.CREATE_TABS_SUCCEEDED };
export interface CreateTabsStartedAction { type: ActionTypes.CREATE_TABS_STARTED, payload: {}, status: ActionTypes.CREATE_TABS_STARTED };
export interface CreateTabsFailedAction { type: ActionTypes.CREATE_TABS_FAILED, payload: { error: string }, status: ActionTypes.CREATE_TABS_FAILED };

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function createTabs(data: any) {  
  return (dispatch: any)  => {
    dispatch(createTabsStarted());
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
        dispatch(createTabsSucceeded(result));
      });
      
    } catch (e){
      console.log('error creating Tabs', e)
    }
  }
}

export function createTabsStarted(): CreateTabsStartedAction {
  return {
    type: ActionTypes.CREATE_TABS_STARTED,
    payload: {},
    status: ActionTypes.CREATE_TABS_STARTED
  };
}

export function createTabsSucceeded(payload: any): CreateTabsSucceededAction {
  console.log(payload);
  return {
    type: ActionTypes.CREATE_TABS_SUCCEEDED,
    payload: {
      tabs: payload.YOURDATA
    },
    status: ActionTypes.CREATE_TABS_SUCCEEDED
  }
}

export function createTabsFailed(error: any): CreateTabsFailedAction {
  return {
    type: ActionTypes.CREATE_TABS_FAILED,
    payload: error,
    status: ActionTypes.CREATE_TABS_FAILED,
  };
}


/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = CreateTabsAction | CreateTabsStartedAction | CreateTabsSucceededAction | CreateTabsFailedAction 