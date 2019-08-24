"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keys = require("blockstack/lib/keys");

var _encryption = require("blockstack/lib/encryption");

var _model = _interopRequireDefault(require("../model"));

var _signingKey = _interopRequireDefault(require("./signing-key"));

var _groupMembership = _interopRequireDefault(require("./group-membership"));

var _helpers = require("../helpers");

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

const decrypted = true;

let BlockstackUser =
/*#__PURE__*/
function (_Model) {
  _inherits(BlockstackUser, _Model);

  function BlockstackUser() {
    _classCallCheck(this, BlockstackUser);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockstackUser).apply(this, arguments));
  }

  _createClass(BlockstackUser, [{
    key: "createSigningKey",
    value: async function createSigningKey() {
      const key = await _signingKey.default.create();
      this.attrs.personalSigningKeyId = key._id;
      return key;
    }
  }, {
    key: "sign",
    value: async function sign() {
      this.attrs.signingKeyId = 'personal';
      const {
        appPrivateKey
      } = (0, _helpers.loadUserData)();
      const contentToSign = [this._id];

      if (this.attrs.updatedAt) {
        contentToSign.push(this.attrs.updatedAt);
      }

      const {
        signature
      } = (0, _encryption.signECDSA)(appPrivateKey, contentToSign.join('-'));
      this.attrs.radiksSignature = signature;
      return this;
    }
  }], [{
    key: "currentUser",
    value: function currentUser() {
      if (typeof window === 'undefined') {
        return null;
      }

      const userData = (0, _helpers.loadUserData)();

      if (!userData) {
        return null;
      }

      const {
        username,
        profile,
        appPrivateKey
      } = userData;
      const publicKey = (0, _keys.getPublicKeyFromPrivate)(appPrivateKey);
      const Clazz = this;
      const user = new Clazz({
        _id: username,
        username,
        publicKey,
        profile
      });
      return user;
    }
  }, {
    key: "createWithCurrentUser",
    value: function createWithCurrentUser() {
      return new Promise((resolve, reject) => {

        const resolveUser = (user, _resolve) => {
          user.save().then(() => {
            
            _groupMembership.default.cacheKeys().then(() => {
              _resolve(user);
            });
          });
        };

        try {
          const user = this.currentUser();
          user.fetch().catch(() => {// console.error('caught error', e);
          }).finally(() => {
            // console.log(user.attrs);
            const userData = (0, _helpers.loadUserData)();
            const {
              username,
              profile,
              appPrivateKey
            } = userData;
            const publicKey = (0, _keys.getPublicKeyFromPrivate)(appPrivateKey);
            user.update({
              username,
              profile,
              publicKey
            });
        
            //if (!user.attrs.personalSigningKeyId) {
              user.createSigningKey().then(key => {
                (0, _helpers.addPersonalSigningKey)(key);
                resolveUser(user, resolve);
              });
            //} else {
            //   _signingKey.default.findById(user.attrs.personalSigningKeyId).then(key => {
            //     (0, _helpers.addPersonalSigningKey)(key);
            //     resolveUser(user, resolve);
            //   });
            // }
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  }]);

  return BlockstackUser;
}(_model.default);

exports.default = BlockstackUser;

_defineProperty(BlockstackUser, "className", 'BlockstackUser');

_defineProperty(BlockstackUser, "schema", {
  username: {
    type: String,
    decrypted
  },
  publicKey: {
    type: String,
    decrypted
  },
  profile: {
    type: String,
    decrypted
  },
  personalSigningKeyId: String
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvdXNlci50cyJdLCJuYW1lcyI6WyJkZWNyeXB0ZWQiLCJCbG9ja3N0YWNrVXNlciIsImtleSIsIlNpZ25pbmdLZXkiLCJjcmVhdGUiLCJhdHRycyIsInBlcnNvbmFsU2lnbmluZ0tleUlkIiwiX2lkIiwic2lnbmluZ0tleUlkIiwiYXBwUHJpdmF0ZUtleSIsImNvbnRlbnRUb1NpZ24iLCJ1cGRhdGVkQXQiLCJwdXNoIiwic2lnbmF0dXJlIiwiam9pbiIsInJhZGlrc1NpZ25hdHVyZSIsIndpbmRvdyIsInVzZXJEYXRhIiwidXNlcm5hbWUiLCJwcm9maWxlIiwicHVibGljS2V5IiwiQ2xhenoiLCJ1c2VyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXNvbHZlVXNlciIsIl9yZXNvbHZlIiwic2F2ZSIsInRoZW4iLCJHcm91cE1lbWJlcnNoaXAiLCJjYWNoZUtleXMiLCJjdXJyZW50VXNlciIsImZldGNoIiwiY2F0Y2giLCJmaW5hbGx5IiwidXBkYXRlIiwiY3JlYXRlU2lnbmluZ0tleSIsImZpbmRCeUlkIiwiZXJyb3IiLCJNb2RlbCIsInR5cGUiLCJTdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU1BLFNBQVMsR0FBRyxJQUFsQjs7SUFFcUJDLGM7Ozs7Ozs7Ozs7Ozs7NkNBMENNO0FBQ3ZCLFlBQU1DLEdBQUcsR0FBRyxNQUFNQyxvQkFBV0MsTUFBWCxFQUFsQjtBQUNBLFdBQUtDLEtBQUwsQ0FBV0Msb0JBQVgsR0FBa0NKLEdBQUcsQ0FBQ0ssR0FBdEM7QUFDQSxhQUFPTCxHQUFQO0FBQ0Q7OztpQ0FtRFk7QUFDWCxXQUFLRyxLQUFMLENBQVdHLFlBQVgsR0FBMEIsVUFBMUI7QUFDQSxZQUFNO0FBQUVDLFFBQUFBO0FBQUYsVUFBb0IsNEJBQTFCO0FBQ0EsWUFBTUMsYUFBa0MsR0FBRyxDQUFDLEtBQUtILEdBQU4sQ0FBM0M7O0FBQ0EsVUFBSSxLQUFLRixLQUFMLENBQVdNLFNBQWYsRUFBMEI7QUFDeEJELFFBQUFBLGFBQWEsQ0FBQ0UsSUFBZCxDQUFtQixLQUFLUCxLQUFMLENBQVdNLFNBQTlCO0FBQ0Q7O0FBQ0QsWUFBTTtBQUFFRSxRQUFBQTtBQUFGLFVBQWdCLDJCQUFVSixhQUFWLEVBQXlCQyxhQUFhLENBQUNJLElBQWQsQ0FBbUIsR0FBbkIsQ0FBekIsQ0FBdEI7QUFDQSxXQUFLVCxLQUFMLENBQVdVLGVBQVgsR0FBNkJGLFNBQTdCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztrQ0F4Rm9CO0FBQ25CLFVBQUksT0FBT0csTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxlQUFPLElBQVA7QUFDRDs7QUFFRCxZQUFNQyxRQUFRLEdBQUcsNEJBQWpCOztBQUNBLFVBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2IsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsWUFBTTtBQUFFQyxRQUFBQSxRQUFGO0FBQVlDLFFBQUFBLE9BQVo7QUFBcUJWLFFBQUFBO0FBQXJCLFVBQXVDUSxRQUE3QztBQUNBLFlBQU1HLFNBQVMsR0FBRyxtQ0FBd0JYLGFBQXhCLENBQWxCO0FBQ0EsWUFBTVksS0FBSyxHQUFHLElBQWQ7QUFDQSxZQUFNQyxJQUFJLEdBQUcsSUFBSUQsS0FBSixDQUFVO0FBQ3JCZCxRQUFBQSxHQUFHLEVBQUVXLFFBRGdCO0FBRXJCQSxRQUFBQSxRQUZxQjtBQUdyQkUsUUFBQUEsU0FIcUI7QUFJckJELFFBQUFBO0FBSnFCLE9BQVYsQ0FBYjtBQU9BLGFBQU9HLElBQVA7QUFDRDs7OzRDQVE4QjtBQUM3QixhQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsY0FBTUMsV0FBVyxHQUFHLENBQ2xCSixJQURrQixFQUVsQkssUUFGa0IsS0FHZjtBQUNITCxVQUFBQSxJQUFJLENBQUNNLElBQUwsR0FBWUMsSUFBWixDQUFpQixNQUFNO0FBQ3JCQyxxQ0FBZ0JDLFNBQWhCLEdBQTRCRixJQUE1QixDQUFpQyxNQUFNO0FBQ3JDRixjQUFBQSxRQUFRLENBQUNMLElBQUQsQ0FBUjtBQUNELGFBRkQ7QUFHRCxXQUpEO0FBS0QsU0FURDs7QUFVQSxZQUFJO0FBQ0YsZ0JBQU1BLElBQUksR0FBRyxLQUFLVSxXQUFMLEVBQWI7QUFDQVYsVUFBQUEsSUFBSSxDQUNEVyxLQURILEdBRUdDLEtBRkgsQ0FFUyxNQUFNLENBQ1g7QUFDRCxXQUpILEVBS0dDLE9BTEgsQ0FLVyxNQUFNO0FBQ2I7QUFDQSxrQkFBTWxCLFFBQVEsR0FBRyw0QkFBakI7QUFDQSxrQkFBTTtBQUFFQyxjQUFBQSxRQUFGO0FBQVlDLGNBQUFBLE9BQVo7QUFBcUJWLGNBQUFBO0FBQXJCLGdCQUF1Q1EsUUFBN0M7QUFDQSxrQkFBTUcsU0FBUyxHQUFHLG1DQUF3QlgsYUFBeEIsQ0FBbEI7QUFDQWEsWUFBQUEsSUFBSSxDQUFDYyxNQUFMLENBQVk7QUFDVmxCLGNBQUFBLFFBRFU7QUFFVkMsY0FBQUEsT0FGVTtBQUdWQyxjQUFBQTtBQUhVLGFBQVo7O0FBS0EsZ0JBQUksQ0FBQ0UsSUFBSSxDQUFDakIsS0FBTCxDQUFXQyxvQkFBaEIsRUFBc0M7QUFDcENnQixjQUFBQSxJQUFJLENBQUNlLGdCQUFMLEdBQXdCUixJQUF4QixDQUE4QjNCLEdBQUQsSUFBUztBQUNwQyxvREFBc0JBLEdBQXRCO0FBQ0F3QixnQkFBQUEsV0FBVyxDQUFDSixJQUFELEVBQU9FLE9BQVAsQ0FBWDtBQUNELGVBSEQ7QUFJRCxhQUxELE1BS087QUFDTHJCLGtDQUFXbUMsUUFBWCxDQUFvQmhCLElBQUksQ0FBQ2pCLEtBQUwsQ0FBV0Msb0JBQS9CLEVBQXFEdUIsSUFBckQsQ0FDRzNCLEdBQUQsSUFBcUI7QUFDbkIsb0RBQXNCQSxHQUF0QjtBQUNBd0IsZ0JBQUFBLFdBQVcsQ0FBQ0osSUFBRCxFQUFPRSxPQUFQLENBQVg7QUFDRCxlQUpIO0FBTUQ7QUFDRixXQTVCSDtBQTZCRCxTQS9CRCxDQStCRSxPQUFPZSxLQUFQLEVBQWM7QUFDZGQsVUFBQUEsTUFBTSxDQUFDYyxLQUFELENBQU47QUFDRDtBQUNGLE9BN0NNLENBQVA7QUE4Q0Q7Ozs7RUEvRnlDQyxjOzs7O2dCQUF2QnZDLGMsZUFDQSxnQjs7Z0JBREFBLGMsWUFHSztBQUN0QmlCLEVBQUFBLFFBQVEsRUFBRTtBQUNSdUIsSUFBQUEsSUFBSSxFQUFFQyxNQURFO0FBRVIxQyxJQUFBQTtBQUZRLEdBRFk7QUFLdEJvQixFQUFBQSxTQUFTLEVBQUU7QUFDVHFCLElBQUFBLElBQUksRUFBRUMsTUFERztBQUVUMUMsSUFBQUE7QUFGUyxHQUxXO0FBU3RCbUIsRUFBQUEsT0FBTyxFQUFFO0FBQ1BzQixJQUFBQSxJQUFJLEVBQUVDLE1BREM7QUFFUDFDLElBQUFBO0FBRk8sR0FUYTtBQWF0Qk0sRUFBQUEsb0JBQW9CLEVBQUVvQztBQWJBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRQdWJsaWNLZXlGcm9tUHJpdmF0ZSB9IGZyb20gJ2Jsb2Nrc3RhY2svbGliL2tleXMnO1xuaW1wb3J0IHsgc2lnbkVDRFNBIH0gZnJvbSAnYmxvY2tzdGFjay9saWIvZW5jcnlwdGlvbic7XG5cbmltcG9ydCBNb2RlbCBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQgU2lnbmluZ0tleSBmcm9tICcuL3NpZ25pbmcta2V5JztcbmltcG9ydCBHcm91cE1lbWJlcnNoaXAgZnJvbSAnLi9ncm91cC1tZW1iZXJzaGlwJztcbmltcG9ydCB7IGFkZFBlcnNvbmFsU2lnbmluZ0tleSwgbG9hZFVzZXJEYXRhIH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5cbmNvbnN0IGRlY3J5cHRlZCA9IHRydWU7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsb2Nrc3RhY2tVc2VyIGV4dGVuZHMgTW9kZWwge1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ0Jsb2Nrc3RhY2tVc2VyJztcblxuICBzdGF0aWMgc2NoZW1hOiBTY2hlbWEgPSB7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlY3J5cHRlZCxcbiAgICB9LFxuICAgIHB1YmxpY0tleToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVjcnlwdGVkLFxuICAgIH0sXG4gICAgcHJvZmlsZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVjcnlwdGVkLFxuICAgIH0sXG4gICAgcGVyc29uYWxTaWduaW5nS2V5SWQ6IFN0cmluZyxcbiAgfTtcblxuICBzdGF0aWMgY3VycmVudFVzZXIoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGxvYWRVc2VyRGF0YSgpO1xuICAgIGlmICghdXNlckRhdGEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIHByb2ZpbGUsIGFwcFByaXZhdGVLZXkgfSA9IHVzZXJEYXRhO1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IGdldFB1YmxpY0tleUZyb21Qcml2YXRlKGFwcFByaXZhdGVLZXkpO1xuICAgIGNvbnN0IENsYXp6ID0gdGhpcztcbiAgICBjb25zdCB1c2VyID0gbmV3IENsYXp6KHtcbiAgICAgIF9pZDogdXNlcm5hbWUsXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHB1YmxpY0tleSxcbiAgICAgIHByb2ZpbGUsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZVNpZ25pbmdLZXkoKSB7XG4gICAgY29uc3Qga2V5ID0gYXdhaXQgU2lnbmluZ0tleS5jcmVhdGUoKTtcbiAgICB0aGlzLmF0dHJzLnBlcnNvbmFsU2lnbmluZ0tleUlkID0ga2V5Ll9pZDtcbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZVdpdGhDdXJyZW50VXNlcigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZVVzZXIgPSAoXG4gICAgICAgIHVzZXI6IEJsb2Nrc3RhY2tVc2VyLFxuICAgICAgICBfcmVzb2x2ZTogKHZhbHVlPzoge30gfCBQcm9taXNlTGlrZTx7fT4pID0+IHZvaWQsXG4gICAgICApID0+IHtcbiAgICAgICAgdXNlci5zYXZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgR3JvdXBNZW1iZXJzaGlwLmNhY2hlS2V5cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgX3Jlc29sdmUodXNlcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVzZXIgPSB0aGlzLmN1cnJlbnRVc2VyKCk7XG4gICAgICAgIHVzZXJcbiAgICAgICAgICAuZmV0Y2goKVxuICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKCdjYXVnaHQgZXJyb3InLCBlKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXIuYXR0cnMpO1xuICAgICAgICAgICAgY29uc3QgdXNlckRhdGEgPSBsb2FkVXNlckRhdGEoKTtcbiAgICAgICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIHByb2ZpbGUsIGFwcFByaXZhdGVLZXkgfSA9IHVzZXJEYXRhO1xuICAgICAgICAgICAgY29uc3QgcHVibGljS2V5ID0gZ2V0UHVibGljS2V5RnJvbVByaXZhdGUoYXBwUHJpdmF0ZUtleSk7XG4gICAgICAgICAgICB1c2VyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgIHVzZXJuYW1lLFxuICAgICAgICAgICAgICBwcm9maWxlLFxuICAgICAgICAgICAgICBwdWJsaWNLZXksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghdXNlci5hdHRycy5wZXJzb25hbFNpZ25pbmdLZXlJZCkge1xuICAgICAgICAgICAgICB1c2VyLmNyZWF0ZVNpZ25pbmdLZXkoKS50aGVuKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBhZGRQZXJzb25hbFNpZ25pbmdLZXkoa2V5KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlVXNlcih1c2VyLCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBTaWduaW5nS2V5LmZpbmRCeUlkKHVzZXIuYXR0cnMucGVyc29uYWxTaWduaW5nS2V5SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgKGtleTogU2lnbmluZ0tleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgYWRkUGVyc29uYWxTaWduaW5nS2V5KGtleSk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlVXNlcih1c2VyLCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHNpZ24oKSB7XG4gICAgdGhpcy5hdHRycy5zaWduaW5nS2V5SWQgPSAncGVyc29uYWwnO1xuICAgIGNvbnN0IHsgYXBwUHJpdmF0ZUtleSB9ID0gbG9hZFVzZXJEYXRhKCk7XG4gICAgY29uc3QgY29udGVudFRvU2lnbjogKHN0cmluZyB8IG51bWJlcilbXSA9IFt0aGlzLl9pZF07XG4gICAgaWYgKHRoaXMuYXR0cnMudXBkYXRlZEF0KSB7XG4gICAgICBjb250ZW50VG9TaWduLnB1c2godGhpcy5hdHRycy51cGRhdGVkQXQpO1xuICAgIH1cbiAgICBjb25zdCB7IHNpZ25hdHVyZSB9ID0gc2lnbkVDRFNBKGFwcFByaXZhdGVLZXksIGNvbnRlbnRUb1NpZ24uam9pbignLScpKTtcbiAgICB0aGlzLmF0dHJzLnJhZGlrc1NpZ25hdHVyZSA9IHNpZ25hdHVyZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19