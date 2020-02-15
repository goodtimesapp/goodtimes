import './shim' // make sure to use es6 import and not require()
import { AppRegistry, YellowBox } from 'react-native';
// @ts-ignore
import { name as appName } from './app.json';
import App from './App';

YellowBox.ignoreWarnings([
    'Require cycle:',
    'Switch:',
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
    'Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.',
    'Warning: Async Storage has been extracted from react-native core'
]);

AppRegistry.registerComponent(appName, () => App);



