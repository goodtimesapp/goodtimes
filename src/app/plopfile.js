const commandLineArgs = require('command-line-args');
const promptDirectory = require('inquirer-directory');

const optsConfig = { partial: true, camelCase: true };
const options = commandLineArgs(
  {
    name: 'folder-name',
    type: String
  },
  optsConfig
);

let { folderName = 'reduxStore' } = options;

module.exports = function(plop) {
  plop.setPrompt('directory', promptDirectory);
  plop.setGenerator('Redux', {
    description: 'Create a new redux CRUD store',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Store name:'
      },
      {
        type: 'directory',
        name: 'directory',
        message: 'Directory:',
        basePath: process.cwd()
      }
    ],
    actions: data => {
      let { spec, directory } = data;
      componentName = data.name;     
      const actions = [
        addFileByTpl({ directory, componentName, tpl: 'redux/actions/create', type: 'actions', verb: 'create' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/actions/delete', type: 'actions', verb: 'delete' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/actions/get', type: 'actions', verb: 'get' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/actions/edit', type: 'actions', verb: 'edit' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/reducers/reduce', type: 'reducers', verb: 'reduce' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/selectors/select', type: 'selectors', verb: 'select' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/index', type: '', verb: 'index' }),
        addFileByTpl({ directory, componentName, tpl: 'redux/model', type: '', verb: 'model' }),

        addFileByTpl({ directory, componentName, tpl: 'react/component', type: '', verb: 'component' }),
        addFileByTpl({ directory, componentName, tpl: 'react/container', type: '', verb: 'container' }),
      ];

      console.log('Add the following to reduxStore/index.ts');
      console.log('\n');
      console.log(`import * as from${upperFirstLetter(componentName)} from './${componentName}/reducers/reduce.${componentName}.reducers';`);
      console.log('\n');
      console.log("export interface State { " + "\n" +
          `    ${componentName}s: from${upperFirstLetter(componentName)}.State` + "\n" +
        "}"
      );
      console.log('\n');
      console.log("export const initialState: State = {" + "\n" +
          `    ${componentName}s: from${upperFirstLetter(componentName)}.initialState` + "\n" +
        "}"
      );
      console.log('\n');
      console.log("export const reducer = combineReducers<State>({" + "\n" +
          `    ${componentName}s: from${upperFirstLetter(componentName)}.reducer` + "\n" +
        "}"
      );
      console.log('\n');
      return actions;    
    }
  });

  

};

function addFileByTpl({ directory, componentName, tpl, type, verb }) {
  const templateFile = `./ploptemplates/${tpl}.tpl`;
  let outputFile = '';

  switch (verb) {
    case 'index':
        outputFile = `${verb}.ts`;
        break;
    case 'model':
        outputFile = `../../models/${upperFirstLetter(componentName)}.ts`;
        break;
    case 'component':
        outputFile = `../../components/${componentName}/${upperFirstLetter(componentName)}.Component.tsx`;
        break;
    case 'container':
        outputFile = `../../components/${componentName}/${upperFirstLetter(componentName)}.Container.tsx`;
        break;
    default:
        outputFile = `${verb}.${componentName}.${type}.ts`;
  }

  const path = `${process.cwd()}/${directory}/${componentName}/${type}/${outputFile}`;
  return { type: 'add', skipIfExists: true, path, templateFile };
}

function addFileByTplExt({ directory, folderName, file }) {
  const templateFile = `./templates/${file}.tpl`;
  const typescriptFile = `{{\'dashCase\' name}}.${file}`;
  const path = `${process.cwd()}/${directory}/${folderName}/${typescriptFile}`;
  return { type: 'add', skipIfExists: true, path, templateFile };
}

function upperFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}
