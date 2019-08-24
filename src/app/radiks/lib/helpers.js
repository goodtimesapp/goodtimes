"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadUserData = exports.requireUserSession = exports.addUserGroupKey = exports.addPersonalSigningKey = exports.userGroupKeys = exports.clearStorage = exports.encryptObject = exports.decryptObject = exports.GROUP_MEMBERSHIPS_STORAGE_KEY = void 0;

var _encryption = require("blockstack/lib/encryption");

var _config = require("./config");

var _reactNativeSecureStorage = _interopRequireDefault(require("react-native-secure-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const GROUP_MEMBERSHIPS_STORAGE_KEY = 'GROUP_MEMBERSHIPS_STORAGE_KEY';
exports.GROUP_MEMBERSHIPS_STORAGE_KEY = GROUP_MEMBERSHIPS_STORAGE_KEY;

const valueToString = (value, clazz) => {
  if (clazz === Boolean) {
    return value ? 'true' : 'false';
  }

  if (clazz === Number) {
    return String(value);
  }

  if (clazz === Array || clazz === Object) {
    return JSON.stringify(value);
  }

  return value;
};

const stringToValue = (value, clazz) => {
  if (clazz === Boolean) {
    return value === 'true';
  }

  if (clazz === Number) {
    return parseFloat(value);
  }

  if (clazz === Array || clazz === Object) {
    return JSON.parse(value);
  }

  return value;
};

const decryptObject = async (encrypted, model) => {
  const privateKey = await model.encryptionPrivateKey();

  const decrypted = _objectSpread({}, encrypted);

  const {
    schema
  } = model;
  Object.keys(encrypted).forEach(key => {
    const value = encrypted[key];
    const schemaValue = schema[key];
    let clazz = schemaValue;
    const schemaAttribute = schema[key];

    if (schemaAttribute && schemaAttribute.type) {
      clazz = schemaAttribute.type;
    }

    if (clazz && schemaAttribute && !schemaAttribute.decrypted) {
      try {
        const decryptedValue = (0, _encryption.decryptECIES)(privateKey, value);
        decrypted[key] = stringToValue(decryptedValue, clazz);
      } catch (error) {
        console.debug(`Decryption error for key: '${key}': ${error.message}`); // eslint-disable-line

        decrypted[key] = value;
      }
    }
  });
  return decrypted;
};

exports.decryptObject = decryptObject;

const encryptObject = async model => {
  const publicKey = await model.encryptionPublicKey();
  const object = model.attrs;

  const encrypted = _objectSpread({}, object, {
    _id: model._id
  });

  Object.keys(model.schema).forEach(key => {
    const schemaValue = model.schema[key];
    const schemaAttribute = model.schema[key];
    const value = object[key];
    let clazz = schemaValue;
    if (typeof value === 'undefined') return;

    if (schemaAttribute.type) {
      clazz = schemaAttribute.type;
    }

    if (schemaAttribute.decrypted) {
      encrypted[key] = value;
      return;
    }

    const stringValue = valueToString(value, clazz);
    
    encrypted[key] = (0, _encryption.encryptECIES)(publicKey, stringValue);
  });
  return encrypted;
};

exports.encryptObject = encryptObject;

const clearStorage = () => {
  _reactNativeSecureStorage.default.removeItem(GROUP_MEMBERSHIPS_STORAGE_KEY);
};

exports.clearStorage = clearStorage;

const userGroupKeys = async () => {

  const keysString = await _reactNativeSecureStorage.default.getItem(GROUP_MEMBERSHIPS_STORAGE_KEY);
  let keys = keysString ? JSON.parse(keysString) : {};
  keys = _objectSpread({
    userGroups: {},
    signingKeys: {},
    personal: {}
  }, keys);
  return keys;
};

exports.userGroupKeys = userGroupKeys;

const addPersonalSigningKey = async signingKey => {
  const keys = await userGroupKeys();
  keys.personal = _objectSpread({
    _id: signingKey._id
  }, signingKey.attrs);
  await _reactNativeSecureStorage.default.setItem(GROUP_MEMBERSHIPS_STORAGE_KEY, JSON.stringify(keys));
};

exports.addPersonalSigningKey = addPersonalSigningKey;

const addUserGroupKey = async userGroup => {
  const keys = await userGroupKeys();
  keys.userGroups[userGroup._id] = userGroup.attrs.signingKeyId;
  keys.signingKeys[userGroup.attrs.signingKeyId] = userGroup.privateKey;
  await _reactNativeSecureStorage.default.setItem(GROUP_MEMBERSHIPS_STORAGE_KEY, JSON.stringify(keys));
};

exports.addUserGroupKey = addUserGroupKey;

const requireUserSession = () => {
  const {
    userSession
  } = (0, _config.getConfig)();

  if (!userSession) {
    // TODO: link to docs
    throw new Error('You have not properly configured your UserSession.');
  }

  return userSession;
};

exports.requireUserSession = requireUserSession;

const loadUserData = () => {
  const {
    userSession
  } = (0, _config.getConfig)();

  console.log('ussession from helper.js', userSession);

  if (userSession) {
    return userSession.loadUserData();
  }

  return null;
};

exports.loadUserData = loadUserData;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbIkdST1VQX01FTUJFUlNISVBTX1NUT1JBR0VfS0VZIiwidmFsdWVUb1N0cmluZyIsInZhbHVlIiwiY2xhenoiLCJCb29sZWFuIiwiTnVtYmVyIiwiU3RyaW5nIiwiQXJyYXkiLCJPYmplY3QiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RyaW5nVG9WYWx1ZSIsInBhcnNlRmxvYXQiLCJwYXJzZSIsImRlY3J5cHRPYmplY3QiLCJlbmNyeXB0ZWQiLCJtb2RlbCIsInByaXZhdGVLZXkiLCJlbmNyeXB0aW9uUHJpdmF0ZUtleSIsImRlY3J5cHRlZCIsInNjaGVtYSIsImtleXMiLCJmb3JFYWNoIiwia2V5Iiwic2NoZW1hVmFsdWUiLCJzY2hlbWFBdHRyaWJ1dGUiLCJ0eXBlIiwiZGVjcnlwdGVkVmFsdWUiLCJlcnJvciIsImNvbnNvbGUiLCJkZWJ1ZyIsIm1lc3NhZ2UiLCJlbmNyeXB0T2JqZWN0IiwicHVibGljS2V5IiwiZW5jcnlwdGlvblB1YmxpY0tleSIsIm9iamVjdCIsImF0dHJzIiwiX2lkIiwic3RyaW5nVmFsdWUiLCJjbGVhclN0b3JhZ2UiLCJTZWN1cmVTdG9yYWdlIiwicmVtb3ZlSXRlbSIsInVzZXJHcm91cEtleXMiLCJrZXlzU3RyaW5nIiwiZ2V0SXRlbSIsInVzZXJHcm91cHMiLCJzaWduaW5nS2V5cyIsInBlcnNvbmFsIiwiYWRkUGVyc29uYWxTaWduaW5nS2V5Iiwic2lnbmluZ0tleSIsInNldEl0ZW0iLCJhZGRVc2VyR3JvdXBLZXkiLCJ1c2VyR3JvdXAiLCJzaWduaW5nS2V5SWQiLCJyZXF1aXJlVXNlclNlc3Npb24iLCJ1c2VyU2Vzc2lvbiIsIkVycm9yIiwibG9hZFVzZXJEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7QUFFTyxNQUFNQSw2QkFBNkIsR0FBRywrQkFBdEM7OztBQUVQLE1BQU1DLGFBQWEsR0FBRyxDQUFDQyxLQUFELEVBQWFD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QUFQO0FBQ0QsQ0FQTTs7OztBQVNBLE1BQU1FLFlBQVksR0FBRyxNQUFNO0FBQ2hDLFFBQU07QUFBRUYsSUFBQUE7QUFBRixNQUFrQix3QkFBeEI7O0FBQ0EsTUFBSUEsV0FBSixFQUFpQjtBQUNmLFdBQU9BLFdBQVcsQ0FBQ0UsWUFBWixFQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FOTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVuY3J5cHRFQ0lFUywgZGVjcnlwdEVDSUVTIH0gZnJvbSAnYmxvY2tzdGFjay9saWIvZW5jcnlwdGlvbic7XG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQgeyBTY2hlbWFBdHRyaWJ1dGUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBTZWN1cmVTdG9yYWdlIGZyb20gJ3JlYWN0LW5hdGl2ZS1zZWN1cmUtc3RvcmFnZSdcblxuZXhwb3J0IGNvbnN0IEdST1VQX01FTUJFUlNISVBTX1NUT1JBR0VfS0VZID0gJ0dST1VQX01FTUJFUlNISVBTX1NUT1JBR0VfS0VZJztcblxuY29uc3QgdmFsdWVUb1N0cmluZyA9ICh2YWx1ZTogYW55LCBjbGF6ejogYW55KSA9PiB7XG4gIGlmIChjbGF6eiA9PT0gQm9vbGVhbikge1xuICAgIHJldHVybiB2YWx1ZSA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gIH0gaWYgKGNsYXp6ID09PSBOdW1iZXIpIHtcbiAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgfSBpZiAoY2xhenogPT09IEFycmF5IHx8IGNsYXp6ID09PSBPYmplY3QpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmNvbnN0IHN0cmluZ1RvVmFsdWUgPSAodmFsdWU6IHN0cmluZywgY2xheno6IGFueSkgPT4ge1xuICBpZiAoY2xhenogPT09IEJvb2xlYW4pIHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICd0cnVlJztcbiAgfSBpZiAoY2xhenogPT09IE51bWJlcikge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgfSBpZiAoY2xhenogPT09IEFycmF5IHx8IGNsYXp6ID09PSBPYmplY3QpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IGRlY3J5cHRPYmplY3QgPSBhc3luYyAoZW5jcnlwdGVkOiBhbnksIG1vZGVsOiBNb2RlbCkgPT4ge1xuICBjb25zdCBwcml2YXRlS2V5ID0gYXdhaXQgbW9kZWwuZW5jcnlwdGlvblByaXZhdGVLZXkoKTtcbiAgY29uc3QgZGVjcnlwdGVkID0ge1xuICAgIC4uLmVuY3J5cHRlZCxcbiAgfTtcbiAgY29uc3QgeyBzY2hlbWEgfSA9IG1vZGVsO1xuICBPYmplY3Qua2V5cyhlbmNyeXB0ZWQpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZW5jcnlwdGVkW2tleV07XG4gICAgY29uc3Qgc2NoZW1hVmFsdWUgPSBzY2hlbWFba2V5XTtcbiAgICBsZXQgY2xhenogPSBzY2hlbWFWYWx1ZTtcbiAgICBjb25zdCBzY2hlbWFBdHRyaWJ1dGUgPSBzY2hlbWFba2V5XSBhcyBTY2hlbWFBdHRyaWJ1dGU7XG4gICAgaWYgKHNjaGVtYUF0dHJpYnV0ZSAmJiBzY2hlbWFBdHRyaWJ1dGUudHlwZSkge1xuICAgICAgY2xhenogPSBzY2hlbWFBdHRyaWJ1dGUudHlwZTtcbiAgICB9XG4gICAgaWYgKGNsYXp6ICYmIHNjaGVtYUF0dHJpYnV0ZSAmJiAhc2NoZW1hQXR0cmlidXRlLmRlY3J5cHRlZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGVjcnlwdGVkVmFsdWUgPSBkZWNyeXB0RUNJRVMocHJpdmF0ZUtleSwgdmFsdWUpIGFzIHN0cmluZztcbiAgICAgICAgZGVjcnlwdGVkW2tleV0gPSBzdHJpbmdUb1ZhbHVlKGRlY3J5cHRlZFZhbHVlLCBjbGF6eik7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmRlYnVnKGBEZWNyeXB0aW9uIGVycm9yIGZvciBrZXk6ICcke2tleX0nOiAke2Vycm9yLm1lc3NhZ2V9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgZGVjcnlwdGVkW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZGVjcnlwdGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGVuY3J5cHRPYmplY3QgPSBhc3luYyAobW9kZWw6IE1vZGVsKSA9PiB7XG4gIGNvbnN0IHB1YmxpY0tleSA9IGF3YWl0IG1vZGVsLmVuY3J5cHRpb25QdWJsaWNLZXkoKTtcbiAgY29uc3Qgb2JqZWN0ID0gbW9kZWwuYXR0cnM7XG4gIGNvbnN0IGVuY3J5cHRlZCA9IHtcbiAgICAuLi5vYmplY3QsXG4gICAgX2lkOiBtb2RlbC5faWQsXG4gIH07XG4gIE9iamVjdC5rZXlzKG1vZGVsLnNjaGVtYSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgY29uc3Qgc2NoZW1hVmFsdWUgPSBtb2RlbC5zY2hlbWFba2V5XTtcbiAgICBjb25zdCBzY2hlbWFBdHRyaWJ1dGUgPSBtb2RlbC5zY2hlbWFba2V5XSBhcyBTY2hlbWFBdHRyaWJ1dGU7XG4gICAgY29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICBsZXQgY2xhenogPSBzY2hlbWFWYWx1ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuICAgIGlmIChzY2hlbWFBdHRyaWJ1dGUudHlwZSkge1xuICAgICAgY2xhenogPSBzY2hlbWFBdHRyaWJ1dGUudHlwZTtcbiAgICB9XG4gICAgaWYgKHNjaGVtYUF0dHJpYnV0ZS5kZWNyeXB0ZWQpIHtcbiAgICAgIGVuY3J5cHRlZFtrZXldID0gdmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gdmFsdWVUb1N0cmluZyh2YWx1ZSwgY2xhenopO1xuICAgIGVuY3J5cHRlZFtrZXldID0gZW5jcnlwdEVDSUVTKHB1YmxpY0tleSwgc3RyaW5nVmFsdWUpO1xuICB9KTtcbiAgcmV0dXJuIGVuY3J5cHRlZDtcbn07XG5cbmV4cG9ydCBjb25zdCBjbGVhclN0b3JhZ2UgPSAoKSA9PiB7XG4gIFNlY3VyZVN0b3JhZ2UucmVtb3ZlSXRlbShHUk9VUF9NRU1CRVJTSElQU19TVE9SQUdFX0tFWSk7XG59O1xuXG5leHBvcnQgY29uc3QgdXNlckdyb3VwS2V5cyA9IGFzeW5jICgpID0+IHtcbiAgY29uc3Qga2V5c1N0cmluZyA9IGF3YWl0IFNlY3VyZVN0b3JhZ2UuZ2V0SXRlbShHUk9VUF9NRU1CRVJTSElQU19TVE9SQUdFX0tFWSk7XG4gIGxldCBrZXlzID0ga2V5c1N0cmluZyA/IEpTT04ucGFyc2Uoa2V5c1N0cmluZykgOiB7fTtcbiAga2V5cyA9IHtcbiAgICB1c2VyR3JvdXBzOiB7fSxcbiAgICBzaWduaW5nS2V5czoge30sXG4gICAgcGVyc29uYWw6IHt9LFxuICAgIC4uLmtleXMsXG4gIH07XG4gIHJldHVybiBrZXlzO1xufTtcblxuZXhwb3J0IGNvbnN0IGFkZFBlcnNvbmFsU2lnbmluZ0tleSA9IGFzeW5jIChzaWduaW5nS2V5KSA9PiB7XG4gIGNvbnN0IGtleXMgPSBhd2FpdCB1c2VyR3JvdXBLZXlzKCk7XG4gIGtleXMucGVyc29uYWwgPSB7XG4gICAgX2lkOiBzaWduaW5nS2V5Ll9pZCxcbiAgICAuLi5zaWduaW5nS2V5LmF0dHJzLFxuICB9O1xuICBhd2FpdCBTZWN1cmVTdG9yYWdlLnNldEl0ZW0oR1JPVVBfTUVNQkVSU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGtleXMpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRVc2VyR3JvdXBLZXkgPSBhc3luYyAodXNlckdyb3VwKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBhd2FpdCB1c2VyR3JvdXBLZXlzKCk7XG4gIGtleXMudXNlckdyb3Vwc1t1c2VyR3JvdXAuX2lkXSA9IHVzZXJHcm91cC5hdHRycy5zaWduaW5nS2V5SWQ7XG4gIGtleXMuc2lnbmluZ0tleXNbdXNlckdyb3VwLmF0dHJzLnNpZ25pbmdLZXlJZF0gPSB1c2VyR3JvdXAucHJpdmF0ZUtleTtcbiAgYXdhaXQgU2VjdXJlU3RvcmFnZS5zZXRJdGVtKEdST1VQX01FTUJFUlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShrZXlzKSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVxdWlyZVVzZXJTZXNzaW9uID0gKCkgPT4ge1xuICBjb25zdCB7IHVzZXJTZXNzaW9uIH0gPSBnZXRDb25maWcoKTtcbiAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgIC8vIFRPRE86IGxpbmsgdG8gZG9jc1xuICAgIHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgbm90IHByb3Blcmx5IGNvbmZpZ3VyZWQgeW91ciBVc2VyU2Vzc2lvbi4nKTtcbiAgfVxuICByZXR1cm4gdXNlclNlc3Npb247XG59O1xuXG5leHBvcnQgY29uc3QgbG9hZFVzZXJEYXRhID0gKCkgPT4ge1xuICBjb25zdCB7IHVzZXJTZXNzaW9uIH0gPSBnZXRDb25maWcoKTtcbiAgaWYgKHVzZXJTZXNzaW9uKSB7XG4gICAgcmV0dXJuIHVzZXJTZXNzaW9uLmxvYWRVc2VyRGF0YSgpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbiJdfQ==