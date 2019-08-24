"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = exports.configure = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let config = {
  apiServer: '',
  userSession: null
};

const configure = newConfig => {
  config = _objectSpread({}, config, {}, newConfig);
};
/**
 * some info
 */


exports.configure = configure;

const getConfig = () => config;

exports.getConfig = getConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWcudHMiXSwibmFtZXMiOlsiY29uZmlnIiwiYXBpU2VydmVyIiwidXNlclNlc3Npb24iLCJjb25maWd1cmUiLCJuZXdDb25maWciLCJnZXRDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFRQSxJQUFJQSxNQUFjLEdBQUc7QUFDbkJDLEVBQUFBLFNBQVMsRUFBRSxFQURRO0FBRW5CQyxFQUFBQSxXQUFXLEVBQUU7QUFGTSxDQUFyQjs7QUFLTyxNQUFNQyxTQUFTLEdBQUlDLFNBQUQsSUFBdUI7QUFDOUNKLEVBQUFBLE1BQU0scUJBQ0RBLE1BREMsTUFFREksU0FGQyxDQUFOO0FBSUQsQ0FMTTtBQU9QOzs7Ozs7O0FBR08sTUFBTUMsU0FBUyxHQUFHLE1BQWNMLE1BQWhDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgUk5CbG9ja3N0YWNrU2RrIGZyb20gJ3JlYWN0LW5hdGl2ZS1ibG9ja3N0YWNrJztcblxuaW50ZXJmYWNlIENvbmZpZyB7XG4gIGFwaVNlcnZlcjogc3RyaW5nLFxuICB1c2VyU2Vzc2lvbjogUk5CbG9ja3N0YWNrU2RrLlVzZXJTZXNzaW9uLFxufVxuXG5sZXQgY29uZmlnOiBDb25maWcgPSB7XG4gIGFwaVNlcnZlcjogJycsXG4gIHVzZXJTZXNzaW9uOiBudWxsLFxufTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZSA9IChuZXdDb25maWc6IENvbmZpZykgPT4ge1xuICBjb25maWcgPSB7XG4gICAgLi4uY29uZmlnLFxuICAgIC4uLm5ld0NvbmZpZyxcbiAgfTtcbn07XG5cbi8qKlxuICogc29tZSBpbmZvXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb25maWcgPSAoKTogQ29uZmlnID0+IGNvbmZpZztcbiJdfQ==