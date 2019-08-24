import { connect } from 'react-redux';
import { State } from './../../reduxStore';
import { 
  get{{pascalCase name}}Selectors, 
  get{{pascalCase name}}Actions,
  create{{pascalCase name}}Actions
} from './../../reduxStore/{{camelCase name}}/index';
import {{pascalCase name}}Component from './{{pascalCase name}}.Component'

const mapStateToProps: any = (state: State) => ({
 {{camelCase name}}s: get{{pascalCase name}}Selectors(state)
})

const mapDispatchToProps = {
  get{{pascalCase name}}:  get{{pascalCase name}}Actions,
  create{{pascalCase name}}: create{{pascalCase name}}Actions
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)({{pascalCase name}}Component)