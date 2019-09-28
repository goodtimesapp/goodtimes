
import { createSelector } from 'reselect';

//#region Initial State
export interface State {
    base64: string
}
export const initialState: State = {
    base64: ''
}
//#endregion Initial State

//#region Actions
export enum ActionTypes {
    SET_BASE64 = '[GLOBAL] SET_BASE64',
    GET_BASE64 = '[GLOBAL] GET_BASE64'
}

export function setBase64(base64: string) {
    return {
        type: ActionTypes.SET_BASE64,
        payload: base64
    }
}
export function getBase64(state: State) {
    return {
        type: ActionTypes.GET_BASE64,
        payload: state.base64
    }
}
//#endregion Actions

//#region Reducers
export function reducers(state: State = initialState, action: any) {
    switch (action.type) {
        case ActionTypes.SET_BASE64: {
            return {
                ...state,
                base64: action.payload
            }
        }
        case ActionTypes.GET_BASE64: {
            return action.payload;
        }
        default:
            return state
    }
}
//#endregion Reducers

//#region Selectors
export const selectBase64 = createSelector(( (state: State) => state), s => s.base64)
//#endregion Selectors
