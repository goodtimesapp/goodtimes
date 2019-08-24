"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = require("blockstack/lib/keys");

var _model = _interopRequireDefault(require("../model"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let SigningKey =
/*#__PURE__*/
function (_Model) {
  _inherits(SigningKey, _Model);

  function SigningKey(...args) {
    var _this;

    _classCallCheck(this, SigningKey);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SigningKey).call(this, ...args));

    _defineProperty(_assertThisInitialized(_this), "encryptionPrivateKey", () => (0, _helpers.loadUserData)().appPrivateKey);

    return _this;
  }

  _createClass(SigningKey, null, [{
    key: "create",
    value: async function create(attrs = {}) {
      
      const privateKey = (0, _keys.makeECPrivateKey)();
      const publicKey = (0, _keys.getPublicKeyFromPrivate)(privateKey);
      const signingKey = new SigningKey(_objectSpread({}, attrs, {
        publicKey,
        privateKey
      }));
      await signingKey.save.apply(signingKey);
      return signingKey;
    }
  }]);

  return SigningKey;
}(_model.default);

exports.default = SigningKey;

_defineProperty(SigningKey, "className", 'SigningKey');

_defineProperty(SigningKey, "schema", {
  publicKey: {
    type: String,
    decrypted: true
  },
  privateKey: String,
  userGroupId: {
    type: String,
    decrypted: true
  }
});

_defineProperty(SigningKey, "defaults", {
  updatable: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc2lnbmluZy1rZXkudHMiXSwibmFtZXMiOlsiU2lnbmluZ0tleSIsImFwcFByaXZhdGVLZXkiLCJhdHRycyIsInByaXZhdGVLZXkiLCJwdWJsaWNLZXkiLCJzaWduaW5nS2V5Iiwic2F2ZSIsImFwcGx5IiwiTW9kZWwiLCJ0eXBlIiwiU3RyaW5nIiwiZGVjcnlwdGVkIiwidXNlckdyb3VwSWQiLCJ1cGRhdGFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFTcUJBLFU7Ozs7Ozs7Ozs7OzsyRUErQkksTUFBTSw2QkFBZUMsYTs7Ozs7OztpQ0FaeEJDLEtBQUssR0FBRyxFLEVBQUk7QUFDOUIsWUFBTUMsVUFBVSxHQUFHLDZCQUFuQjtBQUNBLFlBQU1DLFNBQVMsR0FBRyxtQ0FBd0JELFVBQXhCLENBQWxCO0FBQ0EsWUFBTUUsVUFBVSxHQUFHLElBQUlMLFVBQUosbUJBQ2RFLEtBRGM7QUFFakJFLFFBQUFBLFNBRmlCO0FBR2pCRCxRQUFBQTtBQUhpQixTQUFuQjtBQUtBLFlBQU1FLFVBQVUsQ0FBQ0MsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0JGLFVBQXRCLENBQU47QUFDQSxhQUFPQSxVQUFQO0FBQ0Q7Ozs7RUE3QnFDRyxjOzs7O2dCQUFuQlIsVSxlQUNBLFk7O2dCQURBQSxVLFlBR0g7QUFDZEksRUFBQUEsU0FBUyxFQUFFO0FBQ1RLLElBQUFBLElBQUksRUFBRUMsTUFERztBQUVUQyxJQUFBQSxTQUFTLEVBQUU7QUFGRixHQURHO0FBS2RSLEVBQUFBLFVBQVUsRUFBRU8sTUFMRTtBQU1kRSxFQUFBQSxXQUFXLEVBQUU7QUFDWEgsSUFBQUEsSUFBSSxFQUFFQyxNQURLO0FBRVhDLElBQUFBLFNBQVMsRUFBRTtBQUZBO0FBTkMsQzs7Z0JBSEdYLFUsY0FlRDtBQUNoQmEsRUFBQUEsU0FBUyxFQUFFO0FBREssQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1ha2VFQ1ByaXZhdGVLZXksIGdldFB1YmxpY0tleUZyb21Qcml2YXRlIH0gZnJvbSAnYmxvY2tzdGFjay9saWIva2V5cyc7XG5cbmltcG9ydCBNb2RlbCBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQgeyBsb2FkVXNlckRhdGEgfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7IEF0dHJzIH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnO1xuXG5pbnRlcmZhY2UgU2lnbmluZ0tleUF0dHJzIGV4dGVuZHMgQXR0cnMge1xuICBwdWJsaWNLZXk/OiBzdHJpbmcsXG4gIHByaXZhdGVLZXk/OiBzdHJpbmcgfCBhbnksXG4gIHVzZXJHcm91cElkPzogc3RyaW5nLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWduaW5nS2V5IGV4dGVuZHMgTW9kZWwge1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ1NpZ25pbmdLZXknO1xuXG4gIHN0YXRpYyBzY2hlbWEgPSB7XG4gICAgcHVibGljS2V5OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWNyeXB0ZWQ6IHRydWUsXG4gICAgfSxcbiAgICBwcml2YXRlS2V5OiBTdHJpbmcsXG4gICAgdXNlckdyb3VwSWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlY3J5cHRlZDogdHJ1ZSxcbiAgICB9LFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRzID0ge1xuICAgIHVwZGF0YWJsZTogZmFsc2UsXG4gIH1cblxuICBzdGF0aWMgYXN5bmMgY3JlYXRlKGF0dHJzID0ge30pIHtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gbWFrZUVDUHJpdmF0ZUtleSgpO1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IGdldFB1YmxpY0tleUZyb21Qcml2YXRlKHByaXZhdGVLZXkpO1xuICAgIGNvbnN0IHNpZ25pbmdLZXkgPSBuZXcgU2lnbmluZ0tleSh7XG4gICAgICAuLi5hdHRycyxcbiAgICAgIHB1YmxpY0tleSxcbiAgICAgIHByaXZhdGVLZXksXG4gICAgfSk7XG4gICAgYXdhaXQgc2lnbmluZ0tleS5zYXZlLmFwcGx5KHNpZ25pbmdLZXkpO1xuICAgIHJldHVybiBzaWduaW5nS2V5O1xuICB9XG5cbiAgZW5jcnlwdGlvblByaXZhdGVLZXkgPSAoKSA9PiBsb2FkVXNlckRhdGEoKS5hcHBQcml2YXRlS2V5XG59XG4iXX0=