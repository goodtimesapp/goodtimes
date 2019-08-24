"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = _interopRequireDefault(require("../model"));

var _user = _interopRequireDefault(require("./user"));

var _userGroup = _interopRequireDefault(require("./user-group"));

var _helpers = require("../helpers");

var _signingKey = _interopRequireDefault(require("./signing-key"));

var _reactNativeSecureStorage = _interopRequireDefault(require("react-native-secure-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let GroupMembership =
/*#__PURE__*/
function (_Model) {
  _inherits(GroupMembership, _Model);

  function GroupMembership() {
    _classCallCheck(this, GroupMembership);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroupMembership).apply(this, arguments));
  }

  _createClass(GroupMembership, [{
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      const user = await _user.default.findById(this.attrs.username, {
        decrypt: false
      });
      const {
        publicKey
      } = user.attrs;
      return publicKey;
    }
  }, {
    key: "encryptionPrivateKey",
    value: function encryptionPrivateKey() {
      return (0, _helpers.loadUserData)().appPrivateKey;
    } // @ts-ignore

  }, {
    key: "getSigningKey",
    value: function getSigningKey() {
      const {
        signingKeyId,
        signingKeyPrivateKey
      } = this.attrs;
      return {
        _id: signingKeyId,
        privateKey: signingKeyPrivateKey
      };
    }
  }, {
    key: "fetchUserGroupSigningKey",
    value: async function fetchUserGroupSigningKey() {
      const _id = this.attrs.userGroupId;
      const userGroup = await _userGroup.default.findById(_id);
      const {
        signingKeyId
      } = userGroup.attrs;
      return {
        _id,
        signingKeyId
      };
    }
  }], [{
    key: "fetchUserGroups",
    value: async function fetchUserGroups() {
      const {
        username
      } = (0, _helpers.loadUserData)();
      const memberships = await GroupMembership.fetchList({
        username
      });
      const signingKeys = {};
      memberships.forEach(({
        attrs
      }) => {
        signingKeys[attrs.signingKeyId] = attrs.signingKeyPrivateKey;
      });
      const fetchAll = memberships.map(membership => membership.fetchUserGroupSigningKey());
      const userGroupList = await Promise.all(fetchAll);
      const userGroups = {};
      userGroupList.forEach(userGroup => {
        // @ts-ignore
        userGroups[userGroup._id] = userGroup.signingKeyId;
      });
      return {
        userGroups,
        signingKeys
      };
    }
  }, {
    key: "cacheKeys",
    value: async function cacheKeys() {

      const {
        userGroups,
        signingKeys
      } = await this.fetchUserGroups();
     
      const groupKeys = await (0, _helpers.userGroupKeys)();
      const self = await _user.default.findById((0, _helpers.loadUserData)().username);
      const key = await _signingKey.default.findById(self.attrs.personalSigningKeyId);
      groupKeys.personal = key.attrs;
      groupKeys.signingKeys = signingKeys;
      groupKeys.userGroups = userGroups;
      await _reactNativeSecureStorage.default.setItem(_helpers.addPersonalSigningKe, JSON.stringify(groupKeys));
    }
  }, {
    key: "clearStorage",
    value: async function clearStorage() {
      (0, _helpers.clearStorage)();
    }
  }, {
    key: "userGroupKeys",
    value: function userGroupKeys() {
      return (0, _helpers.userGroupKeys)();
    }
  }]);

  return GroupMembership;
}(_model.default);

exports.default = GroupMembership;

_defineProperty(GroupMembership, "className", 'GroupMembership');

_defineProperty(GroupMembership, "schema", {
  userGroupId: String,
  username: {
    type: String,
    decrypted: true
  },
  signingKeyPrivateKey: String,
  signingKeyId: String
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZ3JvdXAtbWVtYmVyc2hpcC50cyJdLCJuYW1lcyI6WyJHcm91cE1lbWJlcnNoaXAiLCJ1c2VyIiwiVXNlciIsImZpbmRCeUlkIiwiYXR0cnMiLCJ1c2VybmFtZSIsImRlY3J5cHQiLCJwdWJsaWNLZXkiLCJhcHBQcml2YXRlS2V5Iiwic2lnbmluZ0tleUlkIiwic2lnbmluZ0tleVByaXZhdGVLZXkiLCJfaWQiLCJwcml2YXRlS2V5IiwidXNlckdyb3VwSWQiLCJ1c2VyR3JvdXAiLCJVc2VyR3JvdXAiLCJtZW1iZXJzaGlwcyIsImZldGNoTGlzdCIsInNpZ25pbmdLZXlzIiwiZm9yRWFjaCIsImZldGNoQWxsIiwibWFwIiwibWVtYmVyc2hpcCIsImZldGNoVXNlckdyb3VwU2lnbmluZ0tleSIsInVzZXJHcm91cExpc3QiLCJQcm9taXNlIiwiYWxsIiwidXNlckdyb3VwcyIsImZldGNoVXNlckdyb3VwcyIsImdyb3VwS2V5cyIsInNlbGYiLCJrZXkiLCJTaWduaW5nS2V5IiwicGVyc29uYWxTaWduaW5nS2V5SWQiLCJwZXJzb25hbCIsIlNlY3VyZVN0b3JhZ2UiLCJzZXRJdGVtIiwiR1JPVVBfTUVNQkVSU0hJUFNfU1RPUkFHRV9LRVkiLCJKU09OIiwic3RyaW5naWZ5IiwiTW9kZWwiLCJTdHJpbmciLCJ0eXBlIiwiZGVjcnlwdGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXcUJBLGU7Ozs7Ozs7Ozs7Ozs7Z0RBa0RTO0FBQzFCLFlBQU1DLElBQUksR0FBRyxNQUFNQyxjQUFLQyxRQUFMLENBQWMsS0FBS0MsS0FBTCxDQUFXQyxRQUF6QixFQUFtQztBQUFFQyxRQUFBQSxPQUFPLEVBQUU7QUFBWCxPQUFuQyxDQUFuQjtBQUNBLFlBQU07QUFBRUMsUUFBQUE7QUFBRixVQUFnQk4sSUFBSSxDQUFDRyxLQUEzQjtBQUNBLGFBQU9H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QUFvQixFQUFFK0IsTUFOUjtBQU9kaEMsRUFBQUEsWUFBWSxFQUFFZ0M7QUFQQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZGVsIGZyb20gJy4uL21vZGVsJztcbmltcG9ydCBVc2VyIGZyb20gJy4vdXNlcic7XG5pbXBvcnQgVXNlckdyb3VwIGZyb20gJy4vdXNlci1ncm91cCc7XG5pbXBvcnQge1xuICBjbGVhclN0b3JhZ2UsIHVzZXJHcm91cEtleXMsIEdST1VQX01FTUJFUlNISVBTX1NUT1JBR0VfS0VZLCBsb2FkVXNlckRhdGEsXG59IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IFNpZ25pbmdLZXkgZnJvbSAnLi9zaWduaW5nLWtleSc7XG5pbXBvcnQgeyBBdHRycyB9IGZyb20gJy4uL3R5cGVzL2luZGV4JztcbmltcG9ydCBTZWN1cmVTdG9yYWdlIGZyb20gJ3JlYWN0LW5hdGl2ZS1zZWN1cmUtc3RvcmFnZSdcblxuaW50ZXJmYWNlIFVzZXJHcm91cEtleXMge1xuICB1c2VyR3JvdXBzOiB7XG4gICAgW3VzZXJHcm91cElkOiBzdHJpbmddOiBzdHJpbmcsXG4gIH0sXG4gIHNpZ25pbmdLZXlzOiB7XG4gICAgW3NpZ25pbmdLZXlJZDogc3RyaW5nXTogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JvdXBNZW1iZXJzaGlwIGV4dGVuZHMgTW9kZWwge1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ0dyb3VwTWVtYmVyc2hpcCc7XG4gIHN0YXRpYyBzY2hlbWEgPSB7XG4gICAgdXNlckdyb3VwSWQ6IFN0cmluZyxcbiAgICB1c2VybmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVjcnlwdGVkOiB0cnVlLFxuICAgIH0sXG4gICAgc2lnbmluZ0tleVByaXZhdGVLZXk6IFN0cmluZyxcbiAgICBzaWduaW5nS2V5SWQ6IFN0cmluZyxcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmZXRjaFVzZXJHcm91cHMoKTogUHJvbWlzZTxVc2VyR3JvdXBLZXlzPiB7XG4gICAgY29uc3QgeyB1c2VybmFtZSB9ID0gbG9hZFVzZXJEYXRhKCk7XG4gICAgY29uc3QgbWVtYmVyc2hpcHM6IGFueSA9IGF3YWl0IEdyb3VwTWVtYmVyc2hpcC5mZXRjaExpc3Qoe1xuICAgICAgdXNlcm5hbWUsXG4gICAgfSk7XG4gICAgY29uc3Qgc2lnbmluZ0tleXM6IFVzZXJHcm91cEtleXNbJ3NpZ25pbmdLZXlzJ10gPSB7fTtcbiAgICBtZW1iZXJzaGlwcy5mb3JFYWNoKCh7IGF0dHJzIH0pID0+IHtcbiAgICAgIHNpZ25pbmdLZXlzW2F0dHJzLnNpZ25pbmdLZXlJZF0gPSBhdHRycy5zaWduaW5nS2V5UHJpdmF0ZUtleTtcbiAgICB9KTtcbiAgICBjb25zdCBmZXRjaEFsbCA9IG1lbWJlcnNoaXBzLm1hcChtZW1iZXJzaGlwID0+IG1lbWJlcnNoaXAuZmV0Y2hVc2VyR3JvdXBTaWduaW5nS2V5KCkpO1xuICAgIGNvbnN0IHVzZXJHcm91cExpc3QgPSBhd2FpdCBQcm9taXNlLmFsbChmZXRjaEFsbCk7XG4gICAgY29uc3QgdXNlckdyb3VwczogVXNlckdyb3VwS2V5c1sndXNlckdyb3VwcyddID0ge307XG4gICAgdXNlckdyb3VwTGlzdC5mb3JFYWNoKCh1c2VyR3JvdXApID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHVzZXJHcm91cHNbdXNlckdyb3VwLl9pZF0gPSB1c2VyR3JvdXAuc2lnbmluZ0tleUlkO1xuICAgIH0pO1xuICAgIHJldHVybiB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH07XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgY2FjaGVLZXlzKCkge1xuICAgIGNvbnN0IHsgdXNlckdyb3Vwcywgc2lnbmluZ0tleXMgfSA9IGF3YWl0IHRoaXMuZmV0Y2hVc2VyR3JvdXBzKCk7XG4gICAgY29uc3QgZ3JvdXBLZXlzID0gYXdhaXQgdXNlckdyb3VwS2V5cygpO1xuICAgIGNvbnN0IHNlbGYgPSBhd2FpdCBVc2VyLmZpbmRCeUlkKGxvYWRVc2VyRGF0YSgpLnVzZXJuYW1lKTtcbiAgICBjb25zdCBrZXkgPSBhd2FpdCBTaWduaW5nS2V5LmZpbmRCeUlkKHNlbGYuYXR0cnMucGVyc29uYWxTaWduaW5nS2V5SWQpO1xuICAgIGdyb3VwS2V5cy5wZXJzb25hbCA9IGtleS5hdHRycztcbiAgICBncm91cEtleXMuc2lnbmluZ0tleXMgPSBzaWduaW5nS2V5cztcbiAgICBncm91cEtleXMudXNlckdyb3VwcyA9IHVzZXJHcm91cHM7XG4gICAgYXdhaXQgU2VjdXJlU3RvcmFnZS5zZXRJdGVtKEdST1VQX01FTUJFUlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShncm91cEtleXMpKTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBjbGVhclN0b3JhZ2UoKSB7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gIH1cblxuICBzdGF0aWMgdXNlckdyb3VwS2V5cygpIHtcbiAgICByZXR1cm4gdXNlckdyb3VwS2V5cygpO1xuICB9XG5cbiAgYXN5bmMgZW5jcnlwdGlvblB1YmxpY0tleSgpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kQnlJZCh0aGlzLmF0dHJzLnVzZXJuYW1lLCB7IGRlY3J5cHQ6IGZhbHNlIH0pO1xuICAgIGNvbnN0IHsgcHVibGljS2V5IH0gPSB1c2VyLmF0dHJzO1xuICAgIHJldHVybiBwdWJsaWNLZXk7XG4gIH1cblxuICBlbmNyeXB0aW9uUHJpdmF0ZUtleSgpIHtcbiAgICByZXR1cm4gbG9hZFVzZXJEYXRhKCkuYXBwUHJpdmF0ZUtleTtcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgZ2V0U2lnbmluZ0tleSgpIHtcbiAgICBjb25zdCB7IHNpZ25pbmdLZXlJZCwgc2lnbmluZ0tleVByaXZhdGVLZXkgfToge1xuICAgICAgc2lnbmluZ0tleUlkPzogc3RyaW5nLFxuICAgICAgc2lnbmluZ0tleVByaXZhdGVLZXk/OiBzdHJpbmdcbiAgICB9ID0gdGhpcy5hdHRycztcbiAgICByZXR1cm4ge1xuICAgICAgX2lkOiBzaWduaW5nS2V5SWQsXG4gICAgICBwcml2YXRlS2V5OiBzaWduaW5nS2V5UHJpdmF0ZUtleSxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hVc2VyR3JvdXBTaWduaW5nS2V5KCkge1xuICAgIGNvbnN0IF9pZDogc3RyaW5nID0gdGhpcy5hdHRycy51c2VyR3JvdXBJZDtcbiAgICBjb25zdCB1c2VyR3JvdXAgPSBhd2FpdCBVc2VyR3JvdXAuZmluZEJ5SWQ8VXNlckdyb3VwPihfaWQpIGFzIFVzZXJHcm91cDtcbiAgICBjb25zdCB7IHNpZ25pbmdLZXlJZCB9OiB7XG4gICAgICBzaWduaW5nS2V5SWQ/OiBzdHJpbmdcbiAgICB9ID0gdXNlckdyb3VwLmF0dHJzO1xuICAgIHJldHVybiB7XG4gICAgICBfaWQsXG4gICAgICBzaWduaW5nS2V5SWQsXG4gICAgfTtcbiAgfVxufVxuIl19