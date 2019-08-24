"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

var _keys = require("blockstack/lib/keys");

var _encryption = require("blockstack/lib/encryption");

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _helpers = require("./helpers");

var _api = require("./api");

var _streamer = _interopRequireDefault(require("./streamer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EVENT_NAME = 'MODEL_STREAM_EVENT';


let Model =
/*#__PURE__*/
function () {
  _createClass(Model, null, [{
    key: "fromSchema",
    value: function fromSchema(schema) {
      this.schema = schema;
      return this;
    }
  }, {
    key: "fetchList",
    value: async function fetchList(_selector = {}, {
      decrypt = true
    } = {}) {
      const selector = _objectSpread({}, _selector, {
        radiksType: this.modelName()
      });

      const {
        results
      } = await (0, _api.find)(selector);
      const Clazz = this;
      const modelDecryptions = results.map(doc => {
        const model = new Clazz(doc);

        if (decrypt) {
          return model.decrypt();
        }

        return Promise.resolve(model);
      });
      const models = await Promise.all(modelDecryptions);
      return models;
    }
  }, {
    key: "findOne",
    value: async function findOne(_selector = {}, options = {
      decrypt: true
    }) {
      const selector = _objectSpread({}, _selector, {
        limit: 1
      });

      const results = await this.fetchList(selector, options);
      return results[0];
    }
  }, {
    key: "findById",
    value: async function findById(_id, fetchOptions) {
      const Clazz = this;
      const model = new Clazz({
        _id
      });
      return model.fetch(fetchOptions);
    }
  }, {
    key: "count",
    value: async function count(_selector = {}) {
      const selector = _objectSpread({}, _selector, {
        radiksType: this.modelName()
      });

      const data = await (0, _api.count)(selector);
      return data.total;
    }
    /**
     * Fetch all models that are owned by the current user.
     * This only includes 'personally' owned models, and not those created
     * as part of a UserGroup
     *
     * @param {Object} _selector - A query to include when fetching models
     */

  }, {
    key: "fetchOwnList",
    value: async function fetchOwnList(_selector = {}) {
      // @ts-ignore
      const {
        _id
      } = await (0, _helpers.userGroupKeys)().personal;

      const selector = _objectSpread({}, _selector, {
        signingKeyId: _id
      });

      return this.fetchList(selector);
    }
  }]);

  function Model(attrs = {}) {
    _classCallCheck(this, Model);

    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "attrs", void 0);

    const {
      schema,
      defaults
    } = this.constructor;
    const name = this.modelName();
    this.schema = schema;
    this._id = attrs._id || (0, _v.default)().replace('-', '');
    this.attrs = _objectSpread({}, defaults, {}, attrs, {
      radiksType: name
    });
  }

  _createClass(Model, [{
    key: "save",
    value: async function save() {
      return new Promise(async (resolve, reject) => {
        try {
         
          if (this.beforeSave) {
            await this.beforeSave();
          }

          const now = new Date().getTime();
          this.attrs.createdAt = this.attrs.createdAt || now;
          this.attrs.updatedAt = now;
          await this.sign();

          const encrypted = await this.encrypted();
          const gaiaURL = await this.saveFile(encrypted);
          if (gaiaURL.fileUrl){
            await (0, _api.sendNewGaiaUrl)(gaiaURL.fileUrl); 
          } else{
            await (0, _api.sendNewGaiaUrl)(gaiaURL);
          }
          
          resolve(this);
        } catch (error) {
          reject(error);
        }
      });
    }
  }, {
    key: "encrypted",
    value: function encrypted() {
      return (0, _helpers.encryptObject)(this);
    }
  }, {
    key: "saveFile",
    value: function saveFile(encrypted) {
      const userSession = (0, _helpers.requireUserSession)();
      return userSession.putFile(this.blockstackPath(), JSON.stringify(encrypted), {
        encrypt: false
      });
    }
  }, {
    key: "deleteFile",
    value: function deleteFile() {
      const userSession = (0, _helpers.requireUserSession)();
      return userSession.deleteFile(this.blockstackPath());
    }
  }, {
    key: "blockstackPath",
    value: function blockstackPath() {
      const path = `${this.modelName()}/${this._id}`;
      return path;
    }
  }, {
    key: "fetch",
    value: async function fetch({
      decrypt = true
    } = {}) {
      const query = {
        _id: this._id
      };
      const {
        results
      } = await (0, _api.find)(query);
      const [attrs] = results; // Object not found on the server so we return undefined

      if (!attrs) {
        return undefined;
      }

      this.attrs = _objectSpread({}, this.attrs, {}, attrs);

      if (decrypt) {
        await this.decrypt();
      }

      await this.afterFetch();
      return this;
    }
  }, {
    key: "decrypt",
    value: async function decrypt() {
      this.attrs = await (0, _helpers.decryptObject)(this.attrs, this);
      return this;
    }
  }, {
    key: "update",
    value: function update(attrs) {
      this.attrs = _objectSpread({}, this.attrs, {}, attrs);
    }
  }, {
    key: "sign",
    value: async function sign() {
      if (this.attrs.updatable === false) {
        return true;
      }
      const signingKey = await this.getSigningKey();
      this.attrs.signingKeyId = this.attrs.signingKeyId || signingKey._id;
      const {
        privateKey
      } = signingKey;
      const contentToSign = [this._id];

      if (this.attrs.updatedAt) {
        contentToSign.push(this.attrs.updatedAt);
      }

      const {
        signature
      } = (0, _encryption.signECDSA)(privateKey, contentToSign.join('-'));
      this.attrs.radiksSignature = signature;
      return this;
    }
  }, {
    key: "getSigningKey",
    value: async function getSigningKey() {
      if (this.attrs.userGroupId) {
        const {
          userGroups,
          signingKeys
        } = await (0, _helpers.userGroupKeys)();
        const _id = userGroups[this.attrs.userGroupId];
        const privateKey = signingKeys[_id];
        return {
          _id,
          privateKey
        };
      }
      let result = await (0, _helpers.userGroupKeys)();
      return result.personal;
    }
  }, {
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      return (0, _keys.getPublicKeyFromPrivate)((await this.encryptionPrivateKey()));
    }
  }, {
    key: "encryptionPrivateKey",
    value: async function encryptionPrivateKey() {
      let privateKey;

      if (this.attrs.userGroupId) {
        const {
          userGroups,
          signingKeys
        } = await (0, _helpers.userGroupKeys)();
        privateKey = signingKeys[userGroups[this.attrs.userGroupId]];
      } else {
        privateKey = (0, _helpers.requireUserSession)().loadUserData().appPrivateKey;
      }

      return privateKey;
    }
  }, {
    key: "modelName",
    value: function modelName() {
      const {
        modelName
      } = this.constructor;
      return modelName.apply(this.constructor);
    }
  }, {
    key: "isOwnedByUser",
    value: async function isOwnedByUser() {
      const keys = await (0, _helpers.userGroupKeys)();

      if (this.attrs.signingKeyId === keys.personal._id) {
        return true;
      }

      if (this.attrs.userGroupId) {
        let isOwned = false;
        Object.keys(keys.userGroups).forEach(groupId => {
          if (groupId === this.attrs.userGroupId) {
            isOwned = true;
          }
        });
        return isOwned;
      }

      return false;
    }
  }, {
    key: "destroy",
    value: async function destroy() {
      await this.sign();
      await this.deleteFile();
      return (0, _api.destroyModel)(this);
    } // @abstract

  }, {
    key: "beforeSave",
    value: function beforeSave() {} // @abstract

  }, {
    key: "afterFetch",
    value: function afterFetch() {}
  }], [{
    key: "modelName",
    value: function modelName() {
      return this.className || this.name;
    }
  }, {
    key: "addStreamListener",
    value: function addStreamListener(callback) {
      if (!this.emitter) {
        this.emitter = new _wolfy87Eventemitter.default();
      }

      if (this.emitter.getListeners().length === 0) {
        _streamer.default.addListener(args => {
          this.onStreamEvent(this, args);
        });
      }

      this.emitter.addListener(EVENT_NAME, callback);
    }
  }, {
    key: "removeStreamListener",
    value: function removeStreamListener(callback) {
      this.emitter.removeListener(EVENT_NAME, callback);

      if (this.emitter.getListeners().length === 0) {
        _streamer.default.removeListener(this.onStreamEvent);
      }
    }
  }]);

  return Model;
}();

exports.default = Model;

_defineProperty(Model, "schema", void 0);

_defineProperty(Model, "defaults", {});

_defineProperty(Model, "className", void 0);

_defineProperty(Model, "emitter", void 0);

_defineProperty(Model, "onStreamEvent", (_this, [event]) => {
  try {
    const {
      data
    } = event;
    const attrs = JSON.parse(data);

    if (attrs && attrs.radiksType === _this.modelName()) {
      const model = new _this(attrs);

      if (model.isOwnedByUser()) {
        model.decrypt().then(() => {
          _this.emitter.emit(EVENT_NAME, model);
        });
      } else {
        _this.emitter.emit(EVENT_NAME, model);
      }
    }
  } catch (error) {// console.error(error.message);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbC50cyJdLCJuYW1lcyI6WyJFVkVOVF9OQU1FIiwiTW9kZWwiLCJzY2hlbWEiLCJfc2VsZWN0b3IiLCJkZWNyeXB0Iiwic2VsZWN0b3IiLCJyYWRpa3NUeXBlIiwibW9kZWxOYW1lIiwicmVzdWx0cyIsIkNsYXp6IiwibW9kZWxEZWNyeXB0aW9ucyIsIm1hcCIsImRvYyIsIm1vZGVsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJtb2RlbHMiLCJhbGwiLCJvcHRpb25zIiwibGltaXQiLCJmZXRjaExpc3QiLCJfaWQiLCJmZXRjaE9wdGlvbnMiLCJmZXRjaCIsImRhdGEiLCJ0b3RhbCIsInBlcnNvbmFsIiwic2lnbmluZ0tleUlkIiwiYXR0cnMiLCJkZWZhdWx0cyIsImNvbnN0cnVjdG9yIiwibmFtZSIsInJlcGxhY2UiLCJyZWplY3QiLCJiZWZvcmVTYXZlIiwibm93IiwiRGF0ZSIsImdldFRpbWUiLCJjcmVhdGVkQXQiLCJ1cGRhdGVkQXQiLCJzaWduIiwiZW5jcnlwdGVkIiwiZ2FpYVVSTCIsInNhdmVGaWxlIiwiZXJyb3IiLCJ1c2VyU2Vzc2lvbiIsInB1dEZpbGUiLCJibG9ja3N0YWNrUGF0aCIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmNyeXB0IiwiZGVsZXRlRmlsZSIsInBhdGgiLCJxdWVyeSIsInVuZGVmaW5lZCIsImFmdGVyRmV0Y2giLCJ1cGRhdGFibGUiLCJzaWduaW5nS2V5IiwiZ2V0U2lnbmluZ0tleSIsInByaXZhdGVLZXkiLCJjb250ZW50VG9TaWduIiwicHVzaCIsInNpZ25hdHVyZSIsImpvaW4iLCJyYWRpa3NTaWduYXR1cmUiLCJ1c2VyR3JvdXBJZCIsInVzZXJHcm91cHMiLCJzaWduaW5nS2V5cyIsImVuY3J5cHRpb25Qcml2YXRlS2V5IiwibG9hZFVzZXJEYXRhIiwiYXBwUHJpdmF0ZUtleSIsImFwcGx5Iiwia2V5cyIsImlzT3duZWQiLCJPYmplY3QiLCJmb3JFYWNoIiwiZ3JvdXBJZCIsImNsYXNzTmFtZSIsImNhbGxiYWNrIiwiZW1pdHRlciIsIkV2ZW50RW1pdHRlciIsImdldExpc3RlbmVycyIsImxlbmd0aCIsIlN0cmVhbWVyIiwiYWRkTGlzdGVuZXIiLCJhcmdzIiwib25TdHJlYW1FdmVudCIsInJlbW92ZUxpc3RlbmVyIiwiX3RoaXMiLCJldmVudCIsInBhcnNlIiwiaXNPd25lZEJ5VXNlciIsInRoZW4iLCJlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBTUE7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxNQUFNQSxVQUFVLEdBQUcsb0JBQW5COztJQVVxQkMsSzs7Ozs7K0JBU0RDLE0sRUFBZ0I7QUFDaEMsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztvQ0FHQ0MsU0FBb0IsR0FBRyxFLEVBQ3ZCO0FBQUVDLE1BQUFBLE9BQU8sR0FBRztBQUFaLFFBQW1DLEUsRUFDbkM7QUFDQSxZQUFNQyxRQUFtQixxQkFDcEJGLFNBRG9CO0FBRXZCRyxRQUFBQSxVQUFVLEVBQUUsS0FBS0MsU0FBTDtBQUZXLFFBQXpCOztBQUlBLFlBQU07QUFBRUMsUUFBQUE7QUFBRixVQUFjLE1BQU0sZUFBS0gsUUFBTCxDQUExQjtBQUNBLFlBQU1JLEtBQUssR0FBRyxJQUFkO0FBQ0EsWUFBTUMsZ0JBQThCLEdBQUdGLE9BQU8sQ0FBQ0csR0FBUixDQUFhQyxHQUFELElBQWM7QUFDL0QsY0FBTUMsS0FBSyxHQUFHLElBQUlKLEtBQUosQ0FBVUcsR0FBVixDQUFkOztBQUNBLFlBQUlSLE9BQUosRUFBYTtBQUNYLGlCQUFPUyxLQUFLLENBQUNULE9BQU4sRUFBUDtBQUNEOztBQUNELGVBQU9VLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQkYsS0FBaEIsQ0FBUDtBQUNELE9BTnNDLENBQXZDO0FBT0EsWUFBTUcsTUFBVyxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csR0FBUixDQUFZUCxnQkFBWixDQUExQjtBQUNBLGFBQU9NLE1BQVA7QUFDRDs7O2tDQUdD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SUksS0FBSyxJQUFJQSxLQUFLLENBQUN0QixVQUFOLEtBQXFCa0YsS0FBSyxDQUFDakYsU0FBTixFQUFsQyxFQUFxRDtBQUNuRCxZQUFNTSxLQUFLLEdBQUcsSUFBSTJFLEtBQUosQ0FBVTVELEtBQVYsQ0FBZDs7QUFDQSxVQUFJZixLQUFLLENBQUM4RSxhQUFOLEVBQUosRUFBMkI7QUFDekI5RSxRQUFBQSxLQUFLLENBQUNULE9BQU4sR0FBZ0J3RixJQUFoQixDQUFxQixNQUFNO0FBQ3pCSixVQUFBQSxLQUFLLENBQUNULE9BQU4sQ0FBY2MsSUFBZCxDQUFtQjdGLFVBQW5CLEVBQStCYSxLQUEvQjtBQUNELFNBRkQ7QUFHRCxPQUpELE1BSU87QUFDTDJFLFFBQUFBLEtBQUssQ0FBQ1QsT0FBTixDQUFjYyxJQUFkLENBQW1CN0YsVUFBbkIsRUFBK0JhLEtBQS9CO0FBQ0Q7QUFDRjtBQUNGLEdBYkQsQ0FhRSxPQUFPK0IsS0FBUCxFQUFjLENBQ2Q7QUFDRDtBQUNGLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkL3Y0JztcbmltcG9ydCB7IGdldFB1YmxpY0tleUZyb21Qcml2YXRlIH0gZnJvbSAnYmxvY2tzdGFjay9saWIva2V5cyc7XG5pbXBvcnQgeyBzaWduRUNEU0EgfSBmcm9tICdibG9ja3N0YWNrL2xpYi9lbmNyeXB0aW9uJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnd29sZnk4Ny1ldmVudGVtaXR0ZXInO1xuXG5pbXBvcnQge1xuICBlbmNyeXB0T2JqZWN0LFxuICBkZWNyeXB0T2JqZWN0LFxuICB1c2VyR3JvdXBLZXlzLFxuICByZXF1aXJlVXNlclNlc3Npb24sXG59IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQge1xuICBzZW5kTmV3R2FpYVVybCwgZmluZCwgY291bnQsIEZpbmRRdWVyeSwgZGVzdHJveU1vZGVsLFxufSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgU3RyZWFtZXIgZnJvbSAnLi9zdHJlYW1lcic7XG5pbXBvcnQgeyBTY2hlbWEsIEF0dHJzIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbmNvbnN0IEVWRU5UX05BTUUgPSAnTU9ERUxfU1RSRUFNX0VWRU5UJztcblxuaW50ZXJmYWNlIEZldGNoT3B0aW9ucyB7XG4gIGRlY3J5cHQ/OiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgRXZlbnQge1xuICBkYXRhOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsIHtcbiAgcHVibGljIHN0YXRpYyBzY2hlbWE6IFNjaGVtYTtcbiAgcHVibGljIHN0YXRpYyBkZWZhdWx0czogYW55ID0ge307XG4gIHB1YmxpYyBzdGF0aWMgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBwdWJsaWMgc3RhdGljIGVtaXR0ZXI/OiBFdmVudEVtaXR0ZXI7XG4gIHNjaGVtYTogU2NoZW1hO1xuICBfaWQ6IHN0cmluZztcbiAgYXR0cnM6IEF0dHJzO1xuXG4gIHN0YXRpYyBmcm9tU2NoZW1hKHNjaGVtYTogU2NoZW1hKSB7XG4gICAgdGhpcy5zY2hlbWEgPSBzY2hlbWE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmV0Y2hMaXN0PFQgZXh0ZW5kcyBNb2RlbD4oXG4gICAgX3NlbGVjdG9yOiBGaW5kUXVlcnkgPSB7fSxcbiAgICB7IGRlY3J5cHQgPSB0cnVlIH06IEZldGNoT3B0aW9ucyA9IHt9LFxuICApIHtcbiAgICBjb25zdCBzZWxlY3RvcjogRmluZFF1ZXJ5ID0ge1xuICAgICAgLi4uX3NlbGVjdG9yLFxuICAgICAgcmFkaWtzVHlwZTogdGhpcy5tb2RlbE5hbWUoKSxcbiAgICB9O1xuICAgIGNvbnN0IHsgcmVzdWx0cyB9ID0gYXdhaXQgZmluZChzZWxlY3Rvcik7XG4gICAgY29uc3QgQ2xhenogPSB0aGlzO1xuICAgIGNvbnN0IG1vZGVsRGVjcnlwdGlvbnM6IFByb21pc2U8VD5bXSA9IHJlc3VsdHMubWFwKChkb2M6IGFueSkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBuZXcgQ2xhenooZG9jKTtcbiAgICAgIGlmIChkZWNyeXB0KSB7XG4gICAgICAgIHJldHVybiBtb2RlbC5kZWNyeXB0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG1vZGVsKTtcbiAgICB9KTtcbiAgICBjb25zdCBtb2RlbHM6IFRbXSA9IGF3YWl0IFByb21pc2UuYWxsKG1vZGVsRGVjcnlwdGlvbnMpO1xuICAgIHJldHVybiBtb2RlbHM7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmluZE9uZTxUIGV4dGVuZHMgTW9kZWw+KFxuICAgIF9zZWxlY3RvcjogRmluZFF1ZXJ5ID0ge30sXG4gICAgb3B0aW9uczogRmV0Y2hPcHRpb25zID0geyBkZWNyeXB0OiB0cnVlIH0sXG4gICkge1xuICAgIGNvbnN0IHNlbGVjdG9yOiBGaW5kUXVlcnkgPSB7XG4gICAgICAuLi5fc2VsZWN0b3IsXG4gICAgICBsaW1pdDogMSxcbiAgICB9O1xuICAgIGNvbnN0IHJlc3VsdHM6IFRbXSA9IGF3YWl0IHRoaXMuZmV0Y2hMaXN0KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICByZXR1cm4gcmVzdWx0c1swXTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmaW5kQnlJZDxUIGV4dGVuZHMgTW9kZWw+KFxuICAgIF9pZDogc3RyaW5nLFxuICAgIGZldGNoT3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gICkge1xuICAgIGNvbnN0IENsYXp6ID0gdGhpcztcbiAgICBjb25zdCBtb2RlbDogTW9kZWwgPSBuZXcgQ2xhenooeyBfaWQgfSk7XG4gICAgcmV0dXJuIG1vZGVsLmZldGNoKGZldGNoT3B0aW9ucyk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgY291bnQoX3NlbGVjdG9yOiBGaW5kUXVlcnkgPSB7fSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3Qgc2VsZWN0b3I6IEZpbmRRdWVyeSA9IHtcbiAgICAgIC4uLl9zZWxlY3RvcixcbiAgICAgIHJhZGlrc1R5cGU6IHRoaXMubW9kZWxOYW1lKCksXG4gICAgfTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgY291bnQoc2VsZWN0b3IpO1xuICAgIHJldHVybiBkYXRhLnRvdGFsO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIGFsbCBtb2RlbHMgdGhhdCBhcmUgb3duZWQgYnkgdGhlIGN1cnJlbnQgdXNlci5cbiAgICogVGhpcyBvbmx5IGluY2x1ZGVzICdwZXJzb25hbGx5JyBvd25lZCBtb2RlbHMsIGFuZCBub3QgdGhvc2UgY3JlYXRlZFxuICAgKiBhcyBwYXJ0IG9mIGEgVXNlckdyb3VwXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBfc2VsZWN0b3IgLSBBIHF1ZXJ5IHRvIGluY2x1ZGUgd2hlbiBmZXRjaGluZyBtb2RlbHNcbiAgICovXG4gIHN0YXRpYyBhc3luYyBmZXRjaE93bkxpc3QoX3NlbGVjdG9yOiBGaW5kUXVlcnkgPSB7fSkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB7IF9pZCB9ID0gYXdhaXQgdXNlckdyb3VwS2V5cygpLnBlcnNvbmFsO1xuICAgIGNvbnN0IHNlbGVjdG9yID0ge1xuICAgICAgLi4uX3NlbGVjdG9yLFxuICAgICAgc2lnbmluZ0tleUlkOiBfaWQsXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5mZXRjaExpc3Qoc2VsZWN0b3IpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoYXR0cnM6IEF0dHJzID0ge30pIHtcbiAgICBjb25zdCB7IHNjaGVtYSwgZGVmYXVsdHMgfSA9IHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIE1vZGVsO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLm1vZGVsTmFtZSgpO1xuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgIHRoaXMuX2lkID0gYXR0cnMuX2lkIHx8IHV1aWQoKS5yZXBsYWNlKCctJywgJycpO1xuICAgIHRoaXMuYXR0cnMgPSB7XG4gICAgICAuLi5kZWZhdWx0cyxcbiAgICAgIC4uLmF0dHJzLFxuICAgICAgcmFkaWtzVHlwZTogbmFtZSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2F2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMuYmVmb3JlU2F2ZSkge1xuICAgICAgICAgIGF3YWl0IHRoaXMuYmVmb3JlU2F2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLmF0dHJzLmNyZWF0ZWRBdCA9IHRoaXMuYXR0cnMuY3JlYXRlZEF0IHx8IG5vdztcbiAgICAgICAgdGhpcy5hdHRycy51cGRhdGVkQXQgPSBub3c7XG4gICAgICAgIGF3YWl0IHRoaXMuc2lnbigpO1xuICAgICAgICBjb25zdCBlbmNyeXB0ZWQgPSBhd2FpdCB0aGlzLmVuY3J5cHRlZCgpO1xuICAgICAgICBjb25zdCBnYWlhVVJMID0gYXdhaXQgdGhpcy5zYXZlRmlsZShlbmNyeXB0ZWQpO1xuICAgICAgICBhd2FpdCBzZW5kTmV3R2FpYVVybChnYWlhVVJMKTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBlbmNyeXB0ZWQoKSB7XG4gICAgcmV0dXJuIGVuY3J5cHRPYmplY3QodGhpcyk7XG4gIH1cblxuICBzYXZlRmlsZShlbmNyeXB0ZWQ6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBjb25zdCB1c2VyU2Vzc2lvbiA9IHJlcXVpcmVVc2VyU2Vzc2lvbigpO1xuICAgIHJldHVybiB1c2VyU2Vzc2lvbi5wdXRGaWxlKFxuICAgICAgdGhpcy5ibG9ja3N0YWNrUGF0aCgpLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoZW5jcnlwdGVkKSxcbiAgICAgIHtcbiAgICAgICAgZW5jcnlwdDogZmFsc2UsXG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBkZWxldGVGaWxlKCkge1xuICAgIGNvbnN0IHVzZXJTZXNzaW9uID0gcmVxdWlyZVVzZXJTZXNzaW9uKCk7XG4gICAgcmV0dXJuIHVzZXJTZXNzaW9uLmRlbGV0ZUZpbGUodGhpcy5ibG9ja3N0YWNrUGF0aCgpKTtcbiAgfVxuXG4gIGJsb2Nrc3RhY2tQYXRoKCkge1xuICAgIGNvbnN0IHBhdGggPSBgJHt0aGlzLm1vZGVsTmFtZSgpfS8ke3RoaXMuX2lkfWA7XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICBhc3luYyBmZXRjaCh7IGRlY3J5cHQgPSB0cnVlIH0gPSB7fSk6IFByb21pc2U8dGhpcyB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0ge1xuICAgICAgX2lkOiB0aGlzLl9pZCxcbiAgICB9O1xuICAgIGNvbnN0IHsgcmVzdWx0cyB9ID0gYXdhaXQgZmluZChxdWVyeSk7XG4gICAgY29uc3QgW2F0dHJzXSA9IHJlc3VsdHM7XG4gICAgLy8gT2JqZWN0IG5vdCBmb3VuZCBvbiB0aGUgc2VydmVyIHNvIHdlIHJldHVybiB1bmRlZmluZWRcbiAgICBpZiAoIWF0dHJzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgLi4udGhpcy5hdHRycyxcbiAgICAgIC4uLmF0dHJzLFxuICAgIH07XG4gICAgaWYgKGRlY3J5cHQpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGVjcnlwdCgpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLmFmdGVyRmV0Y2goKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFzeW5jIGRlY3J5cHQoKSB7XG4gICAgdGhpcy5hdHRycyA9IGF3YWl0IGRlY3J5cHRPYmplY3QodGhpcy5hdHRycywgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGUoYXR0cnM6IEF0dHJzKSB7XG4gICAgdGhpcy5hdHRycyA9IHtcbiAgICAgIC4uLnRoaXMuYXR0cnMsXG4gICAgICAuLi5hdHRycyxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgc2lnbigpIHtcbiAgICBpZiAodGhpcy5hdHRycy51cGRhdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3Qgc2lnbmluZ0tleSA9IGF3YWl0IHRoaXMuZ2V0U2lnbmluZ0tleSgpO1xuICAgIHRoaXMuYXR0cnMuc2lnbmluZ0tleUlkID0gdGhpcy5hdHRycy5zaWduaW5nS2V5SWQgfHwgc2lnbmluZ0tleS5faWQ7XG4gICAgY29uc3QgeyBwcml2YXRlS2V5IH0gPSBzaWduaW5nS2V5O1xuICAgIGNvbnN0IGNvbnRlbnRUb1NpZ246IChzdHJpbmcgfCBudW1iZXIpW10gPSBbdGhpcy5faWRdO1xuICAgIGlmICh0aGlzLmF0dHJzLnVwZGF0ZWRBdCkge1xuICAgICAgY29udGVudFRvU2lnbi5wdXNoKHRoaXMuYXR0cnMudXBkYXRlZEF0KTtcbiAgICB9XG4gICAgY29uc3QgeyBzaWduYXR1cmUgfSA9IHNpZ25FQ0RTQShwcml2YXRlS2V5LCBjb250ZW50VG9TaWduLmpvaW4oJy0nKSk7XG4gICAgdGhpcy5hdHRycy5yYWRpa3NTaWduYXR1cmUgPSBzaWduYXR1cmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhc3luYyBnZXRTaWduaW5nS2V5KCkge1xuICAgIGlmICh0aGlzLmF0dHJzLnVzZXJHcm91cElkKSB7XG4gICAgICBjb25zdCB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH0gPSBhd2FpdCB1c2VyR3JvdXBLZXlzKCk7XG5cbiAgICAgIGNvbnN0IF9pZCA9IHVzZXJHcm91cHNbdGhpcy5hdHRycy51c2VyR3JvdXBJZF07XG4gICAgICBjb25zdCBwcml2YXRlS2V5ID0gc2lnbmluZ0tleXNbX2lkXTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZCxcbiAgICAgICAgcHJpdmF0ZUtleSxcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gdXNlckdyb3VwS2V5cygpLnBlcnNvbmFsO1xuICB9XG5cbiAgYXN5bmMgZW5jcnlwdGlvblB1YmxpY0tleSgpIHtcbiAgICByZXR1cm4gZ2V0UHVibGljS2V5RnJvbVByaXZhdGUoYXdhaXQgdGhpcy5lbmNyeXB0aW9uUHJpdmF0ZUtleSgpKTtcbiAgfVxuXG4gIGFzeW5jIGVuY3J5cHRpb25Qcml2YXRlS2V5KCkge1xuICAgIGxldCBwcml2YXRlS2V5OiBzdHJpbmc7XG4gICAgaWYgKHRoaXMuYXR0cnMudXNlckdyb3VwSWQpIHtcbiAgICAgIGNvbnN0IHsgdXNlckdyb3Vwcywgc2lnbmluZ0tleXMgfSA9IGF3YWl0IHVzZXJHcm91cEtleXMoKTtcbiAgICAgIHByaXZhdGVLZXkgPSBzaWduaW5nS2V5c1t1c2VyR3JvdXBzW3RoaXMuYXR0cnMudXNlckdyb3VwSWRdXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJpdmF0ZUtleSA9IHJlcXVpcmVVc2VyU2Vzc2lvbigpLmxvYWRVc2VyRGF0YSgpLmFwcFByaXZhdGVLZXk7XG4gICAgfVxuICAgIHJldHVybiBwcml2YXRlS2V5O1xuICB9XG5cbiAgc3RhdGljIG1vZGVsTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNsYXNzTmFtZSB8fCB0aGlzLm5hbWU7XG4gIH1cblxuICBtb2RlbE5hbWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCB7IG1vZGVsTmFtZSB9ID0gdGhpcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgTW9kZWw7XG4gICAgcmV0dXJuIG1vZGVsTmFtZS5hcHBseSh0aGlzLmNvbnN0cnVjdG9yKTtcbiAgfVxuXG4gIGFzeW5jIGlzT3duZWRCeVVzZXIoKSB7XG4gICAgY29uc3Qga2V5cyA9IGF3YWl0IHVzZXJHcm91cEtleXMoKTtcbiAgICBpZiAodGhpcy5hdHRycy5zaWduaW5nS2V5SWQgPT09IGtleXMucGVyc29uYWwuX2lkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXR0cnMudXNlckdyb3VwSWQpIHtcbiAgICAgIGxldCBpc093bmVkID0gZmFsc2U7XG4gICAgICBPYmplY3Qua2V5cyhrZXlzLnVzZXJHcm91cHMpLmZvckVhY2goKGdyb3VwSWQpID0+IHtcbiAgICAgICAgaWYgKGdyb3VwSWQgPT09IHRoaXMuYXR0cnMudXNlckdyb3VwSWQpIHtcbiAgICAgICAgICBpc093bmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaXNPd25lZDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIG9uU3RyZWFtRXZlbnQgPSAoX3RoaXMsIFtldmVudF0pID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBldmVudDtcbiAgICAgIGNvbnN0IGF0dHJzID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgIGlmIChhdHRycyAmJiBhdHRycy5yYWRpa3NUeXBlID09PSBfdGhpcy5tb2RlbE5hbWUoKSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IG5ldyBfdGhpcyhhdHRycyk7XG4gICAgICAgIGlmIChtb2RlbC5pc093bmVkQnlVc2VyKCkpIHtcbiAgICAgICAgICBtb2RlbC5kZWNyeXB0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5lbWl0dGVyLmVtaXQoRVZFTlRfTkFNRSwgbW9kZWwpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLmVtaXR0ZXIuZW1pdChFVkVOVF9OQU1FLCBtb2RlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgc3RhdGljIGFkZFN0cmVhbUxpc3RlbmVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKCF0aGlzLmVtaXR0ZXIpIHtcbiAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW1pdHRlci5nZXRMaXN0ZW5lcnMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgIFN0cmVhbWVyLmFkZExpc3RlbmVyKChhcmdzOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5vblN0cmVhbUV2ZW50KHRoaXMsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5hZGRMaXN0ZW5lcihFVkVOVF9OQU1FLCBjYWxsYmFjayk7XG4gIH1cblxuICBzdGF0aWMgcmVtb3ZlU3RyZWFtTGlzdGVuZXIoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLmVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoRVZFTlRfTkFNRSwgY2FsbGJhY2spO1xuICAgIGlmICh0aGlzLmVtaXR0ZXIuZ2V0TGlzdGVuZXJzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICBTdHJlYW1lci5yZW1vdmVMaXN0ZW5lcih0aGlzLm9uU3RyZWFtRXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgYXdhaXQgdGhpcy5zaWduKCk7XG4gICAgYXdhaXQgdGhpcy5kZWxldGVGaWxlKCk7XG4gICAgcmV0dXJuIGRlc3Ryb3lNb2RlbCh0aGlzKTtcbiAgfVxuXG4gIC8vIEBhYnN0cmFjdFxuICBiZWZvcmVTYXZlKCkge31cblxuICAvLyBAYWJzdHJhY3RcbiAgYWZ0ZXJGZXRjaCgpIHt9XG59XG4iXX0=