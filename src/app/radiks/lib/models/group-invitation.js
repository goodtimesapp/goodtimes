"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _model = _interopRequireDefault(require("../model"));

var _user = _interopRequireDefault(require("./user"));

var _groupMembership = _interopRequireDefault(require("./group-membership"));

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

let GroupInvitation =
/*#__PURE__*/
function (_Model) {
  _inherits(GroupInvitation, _Model);

  function GroupInvitation(...args) {
    var _this;

    _classCallCheck(this, GroupInvitation);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupInvitation).call(this, ...args));

    _defineProperty(_assertThisInitialized(_this), "userPublicKey", void 0);

    return _this;
  }

  _createClass(GroupInvitation, [{
    key: "activate",
    value: async function activate() {
      const {
        userGroups
      } = await (0, _helpers.userGroupKeys)();
      const groupId = this.attrs.userGroupId;

      if (userGroups[groupId]) {
        return true;
      }

      const groupMembership = new _groupMembership.default({
        userGroupId: this.attrs.userGroupId,
        username: (0, _helpers.loadUserData)().username,
        signingKeyPrivateKey: this.attrs.signingKeyPrivateKey,
        signingKeyId: this.attrs.signingKeyId
      });
      await groupMembership.save();
      await _groupMembership.default.cacheKeys();
      return groupMembership;
    }
  }, {
    key: "encryptionPublicKey",
    value: async function encryptionPublicKey() {
      return this.userPublicKey;
    }
  }, {
    key: "encryptionPrivateKey",
    value: function encryptionPrivateKey() {
      return (0, _helpers.loadUserData)().appPrivateKey;
    }
  }], [{
    key: "makeInvitation",
    value: async function makeInvitation(username, userGroup) {
      const user = new _user.default({
        _id: username
      });
      await user.fetch({
        decrypt: false
      });
      const {
        publicKey
      } = user.attrs;
      const invitation = new this({
        userGroupId: userGroup._id,
        signingKeyPrivateKey: userGroup.privateKey,
        signingKeyId: userGroup.attrs.signingKeyId
      });
      invitation.userPublicKey = publicKey;
      await invitation.save();
      return invitation;
    }
  }]);

  return GroupInvitation;
}(_model.default);

exports.default = GroupInvitation;

_defineProperty(GroupInvitation, "className", 'GroupInvitation');

_defineProperty(GroupInvitation, "schema", {
  userGroupId: String,
  signingKeyPrivateKey: String,
  signingKeyId: String
});

_defineProperty(GroupInvitation, "defaults", {
  updatable: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvZ3JvdXAtaW52aXRhdGlvbi50cyJdLCJuYW1lcyI6WyJHcm91cEludml0YXRpb24iLCJ1c2VyR3JvdXBzIiwiZ3JvdXBJZCIsImF0dHJzIiwidXNlckdyb3VwSWQiLCJncm91cE1lbWJlcnNoaXAiLCJHcm91cE1lbWJlcnNoaXAiLCJ1c2VybmFtZSIsInNpZ25pbmdLZXlQcml2YXRlS2V5Iiwic2lnbmluZ0tleUlkIiwic2F2ZSIsImNhY2hlS2V5cyIsInVzZXJQdWJsaWNLZXkiLCJhcHBQcml2YXRlS2V5IiwidXNlckdyb3VwIiwidXNlciIsIlVzZXIiLCJfaWQiLCJmZXRjaCIsImRlY3J5cHQiLCJwdWJsaWNLZXkiLCJpbnZpdGF0aW9uIiwicHJpdmF0ZUtleSIsIk1vZGVsIiwiU3RyaW5nIiwidXBkYXRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFRcUJBLGU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUNBNEJGO0FBQ2YsWUFBTTtBQUFFQyxRQUFBQTtBQUFGLFVBQWlCLE1BQU0sNkJBQTdCO0FBQ0EsWUFBTUMsT0FBZSxHQUFHLEtBQUtDLEtBQUwsQ0FBV0MsV0FBbkM7O0FBQ0EsVUFBSUgsVUFBVSxDQUFDQyxPQUFELENBQWQsRUFBeUI7QUFDdkIsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsWUFBTUcsZUFBZSxHQUFHLElBQUlDLHdCQUFKLENBQW9CO0FBQzFDRixRQUFBQSxXQUFXLEVBQUUsS0FBS0QsS0FBTCxDQUFXQyxXQURrQjtBQUUxQ0csUUFBQUEsUUFBUSxFQUFFLDZCQUFlQSxRQUZpQjtBQUcxQ0MsUUFBQUEsb0JBQW9CLEVBQUUsS0FBS0wsS0FBTCxDQUFXSyxvQkFIUztBQUkxQ0MsUUFBQUEsWUFBWSxFQUFFLEtBQUtOLEtBQUwsQ0FBV007QUFKaUIsT0FBcEIsQ0FBeEI7QUFNQSxZQUFNSixlQUFlLENBQUNLLElBQWhCLEVBQU47QUFDQSxZQUFNSix5QkFBZ0JLLFNBQWhCLEVBQU47QUFDQSxhQUFPTixlQUFQO0FBQ0Q7OztnREFFMkI7QUFDMUIsYUFBTyxLQUFLTyxhQUFaO0FBQ0Q7OzsyQ0FFc0I7QUFDckIsYUFBTyw2QkFBZUMsYUFBdEI7QUFDRDs7O3lDQXJDMkJOLFEsRUFBa0JPLFMsRUFBc0I7QUFDbEUsWUFBTUMsSUFBSSxHQUFHLElBQUlDLGFBQUosQ0FBUztBQUFFQyxRQUFBQSxHQUFHLEVBQUVWO0FBQVAsT0FBVCxDQUFiO0FBQ0EsWUFBTVEsSUFBSSxDQUFDRyxLQUFMLENBQVc7QUFBRUMsUUFBQUEsT0FBTyxFQUFFO0FBQVgsT0FBWCxDQUFOO0FBQ0EsWUFBTTtBQUFFQyxRQUFBQTtBQUFGLFVBQWdCTCxJQUFJLENBQUNaLEtBQTNCO0FBQ0EsWUFBTWtCLFVBQVUsR0FBRyxJQUFJLElBQUosQ0FBUztBQUMxQmpCLFFBQUFBLFdBQVcsRUFBRVUsU0FBUyxDQUFDRyxHQURHO0FBRTFCVCxRQUFBQSxvQkFBb0IsRUFBRU0sU0FBUyxDQUFDUSxVQUZOO0FBRzFCYixRQUFBQSxZQUFZLEVBQUVLLFNBQVMsQ0FBQ1gsS0FBVixDQUFnQk07QUFISixPQUFULENBQW5CO0FBS0FZLE1BQUFBLFVBQVUsQ0FBQ1QsYUFBWCxHQUEyQlEsU0FBM0I7QUFDQSxZQUFNQyxVQUFVLENBQUNYLElBQVgsRUFBTjtBQUNBLGFBQU9XLFVBQVA7QUFDRDs7OztFQTFCMENFLGM7Ozs7Z0JBQXhCdkIsZSxlQUNBLGlCOztnQkFEQUEsZSxZQUlLO0FBQ3RCSSxFQUFBQSxXQUFXLEVBQUVvQixNQURTO0FBRXRCaEIsRUFBQUEsb0JBQW9CLEVBQUVnQixNQUZBO0FBR3RCZixFQUFBQSxZQUFZLEVBQUVlO0FBSFEsQzs7Z0JBSkx4QixlLGNBVUQ7QUFDaEJ5QixFQUFBQSxTQUFTLEVBQUU7QUFESyxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZGVsIGZyb20gJy4uL21vZGVsJztcbmltcG9ydCBVc2VyIGZyb20gJy4vdXNlcic7XG5pbXBvcnQgR3JvdXBNZW1iZXJzaGlwIGZyb20gJy4vZ3JvdXAtbWVtYmVyc2hpcCc7XG5pbXBvcnQgVXNlckdyb3VwIGZyb20gJy4vdXNlci1ncm91cCc7XG5pbXBvcnQgeyB1c2VyR3JvdXBLZXlzLCBsb2FkVXNlckRhdGEgfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7IFNjaGVtYSwgQXR0cnMgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5cbmludGVyZmFjZSBHcm91cEludml0YXRpb25BdHRycyBleHRlbmRzIEF0dHJzIHtcbiAgdXNlckdyb3VwSWQ/OiBzdHJpbmcgfCBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICBzaWduaW5nS2V5UHJpdmF0ZUtleT86IHN0cmluZyB8IFJlY29yZDxzdHJpbmcsIGFueT4sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyb3VwSW52aXRhdGlvbiBleHRlbmRzIE1vZGVsIHtcbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdHcm91cEludml0YXRpb24nO1xuICB1c2VyUHVibGljS2V5OiBzdHJpbmc7XG5cbiAgc3RhdGljIHNjaGVtYTogU2NoZW1hID0ge1xuICAgIHVzZXJHcm91cElkOiBTdHJpbmcsXG4gICAgc2lnbmluZ0tleVByaXZhdGVLZXk6IFN0cmluZyxcbiAgICBzaWduaW5nS2V5SWQ6IFN0cmluZyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0cyA9IHtcbiAgICB1cGRhdGFibGU6IGZhbHNlLFxuICB9XG5cbiAgc3RhdGljIGFzeW5jIG1ha2VJbnZpdGF0aW9uKHVzZXJuYW1lOiBzdHJpbmcsIHVzZXJHcm91cDogVXNlckdyb3VwKSB7XG4gICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHsgX2lkOiB1c2VybmFtZSB9KTtcbiAgICBhd2FpdCB1c2VyLmZldGNoKHsgZGVjcnlwdDogZmFsc2UgfSk7XG4gICAgY29uc3QgeyBwdWJsaWNLZXkgfSA9IHVzZXIuYXR0cnM7XG4gICAgY29uc3QgaW52aXRhdGlvbiA9IG5ldyB0aGlzKHtcbiAgICAgIHVzZXJHcm91cElkOiB1c2VyR3JvdXAuX2lkLFxuICAgICAgc2lnbmluZ0tleVByaXZhdGVLZXk6IHVzZXJHcm91cC5wcml2YXRlS2V5LFxuICAgICAgc2lnbmluZ0tleUlkOiB1c2VyR3JvdXAuYXR0cnMuc2lnbmluZ0tleUlkLFxuICAgIH0pO1xuICAgIGludml0YXRpb24udXNlclB1YmxpY0tleSA9IHB1YmxpY0tleTtcbiAgICBhd2FpdCBpbnZpdGF0aW9uLnNhdmUoKTtcbiAgICByZXR1cm4gaW52aXRhdGlvbjtcbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IHsgdXNlckdyb3VwcyB9ID0gYXdhaXQgdXNlckdyb3VwS2V5cygpO1xuICAgIGNvbnN0IGdyb3VwSWQ6IHN0cmluZyA9IHRoaXMuYXR0cnMudXNlckdyb3VwSWQgYXMgc3RyaW5nO1xuICAgIGlmICh1c2VyR3JvdXBzW2dyb3VwSWRdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgZ3JvdXBNZW1iZXJzaGlwID0gbmV3IEdyb3VwTWVtYmVyc2hpcCh7XG4gICAgICB1c2VyR3JvdXBJZDogdGhpcy5hdHRycy51c2VyR3JvdXBJZCxcbiAgICAgIHVzZXJuYW1lOiBsb2FkVXNlckRhdGEoKS51c2VybmFtZSxcbiAgICAgIHNpZ25pbmdLZXlQcml2YXRlS2V5OiB0aGlzLmF0dHJzLnNpZ25pbmdLZXlQcml2YXRlS2V5LFxuICAgICAgc2lnbmluZ0tleUlkOiB0aGlzLmF0dHJzLnNpZ25pbmdLZXlJZCxcbiAgICB9KTtcbiAgICBhd2FpdCBncm91cE1lbWJlcnNoaXAuc2F2ZSgpO1xuICAgIGF3YWl0IEdyb3VwTWVtYmVyc2hpcC5jYWNoZUtleXMoKTtcbiAgICByZXR1cm4gZ3JvdXBNZW1iZXJzaGlwO1xuICB9XG5cbiAgYXN5bmMgZW5jcnlwdGlvblB1YmxpY0tleSgpIHtcbiAgICByZXR1cm4gdGhpcy51c2VyUHVibGljS2V5O1xuICB9XG5cbiAgZW5jcnlwdGlvblByaXZhdGVLZXkoKSB7XG4gICAgcmV0dXJuIGxvYWRVc2VyRGF0YSgpLmFwcFByaXZhdGVLZXk7XG4gIH1cbn1cbiJdfQ==