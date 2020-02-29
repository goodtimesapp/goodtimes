import {Action} from 'redux';

// type for a redux action
export default interface IAction<TType extends string, TPayload> extends Action<TType> {
  type: TType; 
  payload: TPayload; // generic payload of type you pass in, like IAction<ActionType.SET_CIRCLE_RADIUS, ICircleRadius>
  error?: string; // in reducer check if completed action has error, if so dispatch an failed action
}