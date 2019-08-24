import './shim' // make sure to use es6 import and not require()
import { AppRegistry } from 'react-native';
import App from './App';
// @ts-ignore
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
