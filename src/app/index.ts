import './shim' // make sure to use es6 import and not require()
import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
// @ts-ignore
import { name as appName } from './app.json';


YellowBox.ignoreWarnings([
    'Require cycle:',
    'Switch:',
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

AppRegistry.registerComponent(appName, () => App);
