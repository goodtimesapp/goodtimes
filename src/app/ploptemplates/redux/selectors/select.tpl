import { State } from '../../index';
import { createSelector } from 'reselect';

/*
 * Get the {{constantCase name}} state from the root state
 */
const get{{pascalCase name}}State = ((state: State) => state.{{camelCase name}}s)

/*
 * Getting {{constantCase name}} array from todos State
 */
export const get{{pascalCase name}} = createSelector([get{{pascalCase name}}State], s => s.{{camelCase name}}s)
