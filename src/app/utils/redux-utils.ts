import { Action } from 'redux';

export interface AppAction extends Action { 
    payload?: any;
}