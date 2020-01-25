"use strict";
exports.__esModule = true;
require("./shim"); // make sure to use es6 import and not require()
var react_native_1 = require("react-native");
var App_1 = require("./App");
// @ts-ignore
var app_json_1 = require("./app.json");
react_native_1.YellowBox.ignoreWarnings([
    'Require cycle:',
    'Switch:',
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
    'Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.'
]);
react_native_1.AppRegistry.registerComponent(app_json_1.name, function () { return App_1["default"]; });
