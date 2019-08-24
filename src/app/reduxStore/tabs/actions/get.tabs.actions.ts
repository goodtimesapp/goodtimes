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
  GET_TABS = '[TABS] GET_TABS',
  GET_TABS_STARTED = '[TABS] GET_TABS_STARTED',
  GET_TABS_SUCCEEDED = '[TABS] GET_TABS_SUCCEEDED',
  GET_TABS_FAILED = '[TABS] GET_TABS_FAILED',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface GetTabsAction { type: ActionTypes.GET_TABS, payload: {}, status: ActionTypes.GET_TABS };
export interface GetTabsSucceededAction { type: ActionTypes.GET_TABS_SUCCEEDED, payload: { tabs: Tabs[] }, status: ActionTypes.GET_TABS_SUCCEEDED };
export interface GetTabsStartedAction { type: ActionTypes.GET_TABS_STARTED, payload: {}, status: ActionTypes.GET_TABS_STARTED };
export interface GetTabsFailedAction { type: ActionTypes.GET_TABS_FAILED, payload: { error: string }, status: ActionTypes.GET_TABS_FAILED };

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function getTabs() {  
  return {
    type: ActionTypes.GET_TABS,
    payload: {selected: 'Profile'},
    status: ActionTypes.GET_TABS
  };
}

export function getTabsStarted(): GetTabsStartedAction {
  return {
    type: ActionTypes.GET_TABS_STARTED,
    payload: {},
    status: ActionTypes.GET_TABS_STARTED
  };
}

export function getTabsSucceeded(payload: any): GetTabsSucceededAction {
  console.log(payload);
  return {
    type: ActionTypes.GET_TABS_SUCCEEDED,
    payload: {
      tabs: payload.YOURDATA
    },
    status: ActionTypes.GET_TABS_SUCCEEDED
  }
}

export function getTabsFailed(error: any): GetTabsFailedAction {
  return {
    type: ActionTypes.GET_TABS_FAILED,
    payload: error,
    status: ActionTypes.GET_TABS_FAILED,
  };
}

/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = GetTabsAction | GetTabsStartedAction | GetTabsSucceededAction | GetTabsFailedAction 