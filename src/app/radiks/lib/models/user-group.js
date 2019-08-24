"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = require("blockstack/lib/keys");

var _model = _interopRequireDefault(require("../model"));

var _groupMembership = _interopRequireDefault(require("./group-membership"));

var _groupInvitation = _interopRequireDefault(require("./group-invitation"));

var _signingKey = _interopRequireDefault(require("./signing-key"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultMembers = [];

let UserGroup =
/*#__PURE__*/
function (_Model) {
  _inherits(UserGroup, _Model);

  function UserGroup(...args) {
    var _this;

    _classCallCheck(this, UserGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UserGroup).call(this, ...args));

    _defineProperty(_assertThisInitialized(_this), "privateKey", void 0);

    return _this;
  }

  _createClass(UserGroup, [{
    key: "create",
    value: async function create() {
      const signingKey = await _signingKey.default.create({
        userGroupId: this._id
      });
      this.attrs.signingKeyId = signingKey._id;
      this.privateKey = signingKey.attrs.privateKey;
      (0, _helpers.addUserGroupKey)(this); // await this.makeGaiaConfig();

      const {
        username
      } = (0, _helpers.loadUserData)();
      const invitation = await this.makeGroupMembership(username);
      await invitation.activate();
      return this;
    }
  }, {
    key: "makeGroupMembership",
    value: async function makeGroupMembership(username) {
      let existingInviteId = null;
      this.attrs.members.forEach(member => {
        if (member.username === username) {
          existingInviteId = member.inviteId;
        }
      });

      if (existingInviteId) {
        const invitation = await _groupInvitation.default.findById(existingInviteId, {
          decrypt: false
        });
        return invitation;
      }

      const invitation = await _groupInvitation.default.makeInvitation(username, this);
      this.attrs.members.push({
        username,
        inviteId: invitation._id
      });
      await this.save();
      return invitation;
    }
  }, {
    key: "publicKey",
    value: function publicKey() {
      return (0, _keys.getPublicKeyFromPrivate)(this.privateKey);
    }
  }, {
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      return this.publicKey();
    }
  }, {
    key: "encryptionPrivateKey",
    value: async function encryptionPrivateKey() {
      if (this.privateKey) {
        return this.privateKey;
      }

      const {
        signingKeys
      } = await (0, _helpers.userGroupKeys)();
      return signingKeys[this.attrs.signingKeyId];
    } // async makeGaiaConfig() {
    //   const userData = loadUserData();
    //   const { appPrivateKey, hubUrl } = userData;
    //   const scopes = [
    //     {
    //       scope: 'putFilePrefix',
    //       domain: `UserGroups/${this._id}/`,
    //     },
    //   ];
    //   const userSession = requireUserSession();
    //   const gaiaConfig = await userSession.connectToGaiaHub(hubUrl, appPrivateKey, scopes);
    //   this.attrs.gaiaConfig = gaiaConfig;
    //   return gaiaConfig;
    // }

  }, {
    key: "getSigningKey",
    value: async function getSigningKey() {
      const {
        userGroups,
        signingKeys
      } = await (0, _helpers.userGroupKeys)();
      const id = userGroups[this._id];
      const privateKey = signingKeys[id];
      return {
        privateKey,
        id
      };
    }
  }], [{
    key: "find",
    value: async function find(id) {
      const {
        userGroups,
        signingKeys
      } = await _groupMembership.default.userGroupKeys();

      if (!userGroups || !userGroups[id]) {
        throw new Error(`UserGroup not found with id: '${id}'. Have you called \`GroupMembership.cacheKeys()\`?`);
      }

      const signingKey = userGroups[id];
      const privateKey = signingKeys[signingKey];
      const userGroup = new this({
        _id: id
      });
      userGroup.privateKey = privateKey;
      await userGroup.fetch();
      return userGroup;
    }
  }, {
    key: "myGroups",
    value: async function myGroups() {
      const {
        userGroups
      } = await (0, _helpers.userGroupKeys)();
      const keys = Object.keys(userGroups);
      return this.fetchList({
        _id: keys.join(',')
      });
    }
  }]);

  return UserGroup;
}(_model.default);

exports.default = UserGroup;

_defineProperty(UserGroup, "schema", {
  name: String,
  gaiaConfig: Object,
  members: {
    type: Array
  }
});

_defineProperty(UserGroup, "defaults", {
  members: defaultMembers
});

_defineProperty(UserGroup, "modelName", () => 'UserGroup');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci1ncm91cC50cyJdLCJuYW1lcyI6WyJkZWZhdWx0TWVtYmVycyIsIlVzZXJHcm91cCIsInNpZ25pbmdLZXkiLCJTaWduaW5nS2V5IiwiY3JlYXRlIiwidXNlckdyb3VwSWQiLCJfaWQiLCJhdHRycyIsInNpZ25pbmdLZXlJZCIsInByaXZhdGVLZXkiLCJ1c2VybmFtZSIsImludml0YXRpb24iLCJtYWtlR3JvdXBNZW1iZXJzaGlwIiwiYWN0aXZhdGUiLCJleGlzdGluZ0ludml0ZUlkIiwibWVtYmVycyIsImZvckVhY2giLCJtZW1iZXIiLCJpbnZpdGVJZCIsIkdyb3VwSW52aXRhdGlvbiIsImZpbmRCeUlkIiwiZGVjcnlwdCIsIm1ha2VJbnZpdGF0aW9uIiwicHVzaCIsInNhdmUiLCJwdWJsaWNLZXkiLCJzaWduaW5nS2V5cyIsInVzZXJHcm91cHMiLCJpZCIsIkdyb3VwTWVtYmVyc2hpcCIsInVzZXJHcm91cEtleXMiLCJFcnJvciIsInVzZXJHcm91cCIsImZldGNoIiwia2V5cyIsIk9iamVjdCIsImZldGNoTGlzdCIsImpvaW4iLCJNb2RlbCIsIm5hbWUiLCJTdHJpbmciLCJnYWlhQ29uZmlnIiwidHlwZSIsIkFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsTUFBTUEsY0FBd0IsR0FBRyxFQUFqQzs7SUFFcUJDLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBNEJKO0FBQ2IsWUFBTUMsVUFBVSxHQUFHLE1BQU1DLG9CQUFXQyxNQUFYLENBQWtCO0FBQUVDLFFBQUFBLFdBQVcsRUFBRSxLQUFLQztBQUFwQixPQUFsQixDQUF6QjtBQUNBLFdBQUtDLEtBQUwsQ0FBV0MsWUFBWCxHQUEwQk4sVUFBVSxDQUFDSSxHQUFyQztBQUNBLFdBQUtHLFVBQUwsR0FBa0JQLFVBQVUsQ0FBQ0ssS0FBWCxDQUFpQkUsVUFBbkM7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OztxQ0FxQ3VCO0FBQ3RCLFlBQU07QUFBRUwsUUFBQUE7QUFBRixVQUFpQixNQUFNLDZCQUE3QjtBQUNBLFlBQU1PLElBQUksR0FBR0MsTUFBTSxDQUFDRCxJQUFQLENBQVlQLFVBQVosQ0FBYjtBQUNBLGFBQU8sS0FBS1MsU0FBTCxDQUFlO0FBQUU5QixRQUFBQSxHQUFHLEVBQUU0QixJQUFJLENBQUNHLElBQUwsQ0FBVSxHQUFWO0FBQVAsT0FBZixDQUFQO0FBQ0Q7Ozs7RUFuRW9DQyxjOzs7O2dCQUFsQnJDLFMsWUFHSztBQUN0QnNDLEVBQUFBLElBQUksRUFBRUMsTUFEZ0I7QUFFdEJDLEVBQUFBLFVBQVUsRUFBRU4sTUFGVTtBQUd0QnBCLEVBQUFBLE9BQU8sRUFBRTtBQUNQMkIsSUFBQUEsSUFBSSxFQUFFQztBQURDO0FBSGEsQzs7Z0JBSEwxQyxTLGNBV0Q7QUFDaEJjLEVBQUFBLE9BQU8sRUFBRWY7QUFETyxDOztnQkFYQ0MsUyxlQW9HQSxNQUFNLFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZSB9IGZyb20gJ2Jsb2Nrc3RhY2svbGliL2tleXMnO1xuXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IEdyb3VwTWVtYmVyc2hpcCBmcm9tICcuL2dyb3VwLW1lbWJlcnNoaXAnO1xuaW1wb3J0IEdyb3VwSW52aXRhdGlvbiBmcm9tICcuL2dyb3VwLWludml0YXRpb24nO1xuaW1wb3J0IFNpZ25pbmdLZXkgZnJvbSAnLi9zaWduaW5nLWtleSc7XG5pbXBvcnQge1xuICB1c2VyR3JvdXBLZXlzLCBhZGRVc2VyR3JvdXBLZXksIGxvYWRVc2VyRGF0YSwgcmVxdWlyZVVzZXJTZXNzaW9uLFxufSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7IFNjaGVtYSwgQXR0cnMgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5cbmludGVyZmFjZSBNZW1iZXIge1xuICB1c2VybmFtZTogc3RyaW5nLFxuICBpbnZpdGVJZDogc3RyaW5nXG59XG5cbmludGVyZmFjZSBVc2VyR3JvdXBBdHRycyBleHRlbmRzIEF0dHJzIHtcbiAgbmFtZT86IHN0cmluZyB8IGFueSxcbiAgZ2FpYUNvbmZpZzogUmVjb3JkPHN0cmluZywgYW55PiB8IGFueSxcbiAgbWVtYmVyczogYW55W10gfCBhbnksXG59XG5cbmNvbnN0IGRlZmF1bHRNZW1iZXJzOiBNZW1iZXJbXSA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyR3JvdXAgZXh0ZW5kcyBNb2RlbCB7XG4gIHByaXZhdGVLZXk/OiBzdHJpbmc7XG5cbiAgc3RhdGljIHNjaGVtYTogU2NoZW1hID0ge1xuICAgIG5hbWU6IFN0cmluZyxcbiAgICBnYWlhQ29uZmlnOiBPYmplY3QsXG4gICAgbWVtYmVyczoge1xuICAgICAgdHlwZTogQXJyYXksXG4gICAgfSxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0cyA9IHtcbiAgICBtZW1iZXJzOiBkZWZhdWx0TWVtYmVycyxcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmaW5kKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCB7IHVzZXJHcm91cHMsIHNpZ25pbmdLZXlzIH0gPSBhd2FpdCBHcm91cE1lbWJlcnNoaXAudXNlckdyb3VwS2V5cygpO1xuICAgIGlmICghdXNlckdyb3VwcyB8fCAhdXNlckdyb3Vwc1tpZF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVXNlckdyb3VwIG5vdCBmb3VuZCB3aXRoIGlkOiAnJHtpZH0nLiBIYXZlIHlvdSBjYWxsZWQgXFxgR3JvdXBNZW1iZXJzaGlwLmNhY2hlS2V5cygpXFxgP2ApO1xuICAgIH1cbiAgICBjb25zdCBzaWduaW5nS2V5ID0gdXNlckdyb3Vwc1tpZF07XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IHNpZ25pbmdLZXlzW3NpZ25pbmdLZXldO1xuICAgIGNvbnN0IHVzZXJHcm91cCA9IG5ldyB0aGlzKHsgX2lkOiBpZCB9KTtcbiAgICB1c2VyR3JvdXAucHJpdmF0ZUtleSA9IHByaXZhdGVLZXk7XG4gICAgYXdhaXQgdXNlckdyb3VwLmZldGNoKCk7XG4gICAgcmV0dXJuIHVzZXJHcm91cDtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZSgpIHtcbiAgICBjb25zdCBzaWduaW5nS2V5ID0gYXdhaXQgU2lnbmluZ0tleS5jcmVhdGUoeyB1c2VyR3JvdXBJZDogdGhpcy5faWQgfSk7XG4gICAgdGhpcy5hdHRycy5zaWduaW5nS2V5SWQgPSBzaWduaW5nS2V5Ll9pZDtcbiAgICB0aGlzLnByaXZhdGVLZXkgPSBzaWduaW5nS2V5LmF0dHJzLnByaXZhdGVLZXk7XG4gICAgYWRkVXNlckdyb3VwS2V5KHRoaXMpO1xuICAgIC8vIGF3YWl0IHRoaXMubWFrZUdhaWFDb25maWcoKTtcbiAgICBjb25zdCB7IHVzZXJuYW1lIH0gPSBsb2FkVXNlckRhdGEoKTtcbiAgICBjb25zdCBpbnZpdGF0aW9uID0gYXdhaXQgdGhpcy5tYWtlR3JvdXBNZW1iZXJzaGlwKHVzZXJuYW1lKTtcbiAgICBhd2FpdCBpbnZpdGF0aW9uLmFjdGl2YXRlKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhc3luYyBtYWtlR3JvdXBNZW1iZXJzaGlwKHVzZXJuYW1lOiBzdHJpbmcpOiBQcm9taXNlPEdyb3VwSW52aXRhdGlvbj4ge1xuICAgIGxldCBleGlzdGluZ0ludml0ZUlkID0gbnVsbDtcbiAgICB0aGlzLmF0dHJzLm1lbWJlcnMuZm9yRWFjaCgobWVtYmVyOiBNZW1iZXIpID0+IHtcbiAgICAgIGlmIChtZW1iZXIudXNlcm5hbWUgPT09IHVzZXJuYW1lKSB7XG4gICAgICAgIGV4aXN0aW5nSW52aXRlSWQgPSBtZW1iZXIuaW52aXRlSWQ7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGV4aXN0aW5nSW52aXRlSWQpIHtcbiAgICAgIGNvbnN0IGludml0YXRpb24gPSBhd2FpdCBHcm91cEludml0YXRpb24uZmluZEJ5SWQoXG4gICAgICAgIGV4aXN0aW5nSW52aXRlSWQsXG4gICAgICAgIHsgZGVjcnlwdDogZmFsc2UgfSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gaW52aXRhdGlvbiBhcyBHcm91cEludml0YXRpb247XG4gICAgfVxuICAgIGNvbnN0IGludml0YXRpb24gPSBhd2FpdCBHcm91cEludml0YXRpb24ubWFrZUludml0YXRpb24odXNlcm5hbWUsIHRoaXMpO1xuICAgIHRoaXMuYXR0cnMubWVtYmVycy5wdXNoKHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgaW52aXRlSWQ6IGludml0YXRpb24uX2lkLFxuICAgIH0pO1xuICAgIGF3YWl0IHRoaXMuc2F2ZSgpO1xuICAgIHJldHVybiBpbnZpdGF0aW9uO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIG15R3JvdXBzKCkge1xuICAgIGNvbnN0IHsgdXNlckdyb3VwcyB9ID0gYXdhaXQgdXNlckdyb3VwS2V5cygpO1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh1c2VyR3JvdXBzKTtcbiAgICByZXR1cm4gdGhpcy5mZXRjaExpc3QoeyBfaWQ6IGtleXMuam9pbignLCcpIH0pO1xuICB9XG5cbiAgcHVibGljS2V5KCkge1xuICAgIHJldHVybiBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZSh0aGlzLnByaXZhdGVLZXkpO1xuICB9XG5cbiAgYXN5bmMgZW5jcnlwdGlvblB1YmxpY0tleSgpIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaWNLZXkoKTtcbiAgfVxuXG4gIGFzeW5jIGVuY3J5cHRpb25Qcml2YXRlS2V5KCkge1xuICAgIGlmICh0aGlzLnByaXZhdGVLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLnByaXZhdGVLZXk7XG4gICAgfVxuICAgIGNvbnN0IHsgc2lnbmluZ0tleXMgfSA9IGF3YWl0IHVzZXJHcm91cEtleXMoKTtcbiAgICByZXR1cm4gc2lnbmluZ0tleXNbdGhpcy5hdHRycy5zaWduaW5nS2V5SWRdO1xuICB9XG5cbiAgLy8gYXN5bmMgbWFrZUdhaWFDb25maWcoKSB7XG4gIC8vICAgY29uc3QgdXNlckRhdGEgPSBsb2FkVXNlckRhdGEoKTtcbiAgLy8gICBjb25zdCB7IGFwcFByaXZhdGVLZXksIGh1YlVybCB9ID0gdXNlckRhdGE7XG4gIC8vICAgY29uc3Qgc2NvcGVzID0gW1xuICAvLyAgICAge1xuICAvLyAgICAgICBzY29wZTogJ3B1dEZpbGVQcmVmaXgnLFxuICAvLyAgICAgICBkb21haW46IGBVc2VyR3JvdXBzLyR7dGhpcy5faWR9L2AsXG4gIC8vICAgICB9LFxuICAvLyAgIF07XG4gIC8vICAgY29uc3QgdXNlclNlc3Npb24gPSByZXF1aXJlVXNlclNlc3Npb24oKTtcbiAgLy8gICBjb25zdCBnYWlhQ29uZmlnID0gYXdhaXQgdXNlclNlc3Npb24uY29ubmVjdFRvR2FpYUh1YihodWJVcmwsIGFwcFByaXZhdGVLZXksIHNjb3Blcyk7XG4gIC8vICAgdGhpcy5hdHRycy5nYWlhQ29uZmlnID0gZ2FpYUNvbmZpZztcbiAgLy8gICByZXR1cm4gZ2FpYUNvbmZpZztcbiAgLy8gfVxuXG4gIHN0YXRpYyBtb2RlbE5hbWUgPSAoKSA9PiAnVXNlckdyb3VwJ1xuXG4gIGFzeW5jIGdldFNpZ25pbmdLZXkoKSB7XG4gICAgY29uc3QgeyB1c2VyR3JvdXBzLCBzaWduaW5nS2V5cyB9ID0gYXdhaXQgdXNlckdyb3VwS2V5cygpO1xuICAgIGNvbnN0IGlkID0gdXNlckdyb3Vwc1t0aGlzLl9pZF07XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IHNpZ25pbmdLZXlzW2lkXTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJpdmF0ZUtleSxcbiAgICAgIGlkLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==