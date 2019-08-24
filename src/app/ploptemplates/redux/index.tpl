import { get{{pascalCase name}} as get{{pascalCase name}}Selectors } from './selectors/select.{{camelCase name}}.selectors';
import { get{{pascalCase name}} as get{{pascalCase name}}Actions } from './actions/get.{{camelCase name}}.actions';
import { create{{pascalCase name}} as create{{pascalCase name}}Actions } from './actions/create.{{camelCase name}}.actions'
import { reducer as reduce{{pascalCase name}}s } from './reducers/reduce.{{camelCase name}}.reducers';

export {
    get{{pascalCase name}}Actions,
    create{{pascalCase name}}Actions,
    get{{pascalCase name}}Selectors,
    reduce{{pascalCase name}}s
}