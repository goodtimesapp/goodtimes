"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _encryption = require("blockstack/lib/encryption");

var _config = require("./config");

var _api = require("./api");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

let Central =
/*#__PURE__*/
function () {
  function Central() {
    _classCallCheck(this, Central);
  }

  _createClass(Central, null, [{
    key: "save",
    value: function save(key, value) {
      const {
        username,
        signature
      } = this.makeSignature(key);
      return (0, _api.saveCentral)({
        username,
        key,
        value,
        signature
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      const {
        username,
        signature
      } = this.makeSignature(key);
      return (0, _api.fetchCentral)(key, username, signature);
    }
  }, {
    key: "makeSignature",
    value: function makeSignature(key) {
      const {
        userSession
      } = (0, _config.getConfig)();
      const {
        appPrivateKey,
        username
      } = userSession.loadUserData();
      const message = `${username}-${key}`;
      const {
        signature
      } = (0, _encryption.signECDSA)(appPrivateKey, message);
      return {
        username,
        signature
      };
    }
  }]);

  return Central;
}();

var _default = Central;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jZW50cmFsLnRzIl0sIm5hbWVzIjpbIkNlbnRyYWwiLCJrZXkiLCJ2YWx1ZSIsInVzZXJuYW1lIiwic2lnbmF0dXJlIiwibWFrZVNpZ25hdHVyZSIsInVzZXJTZXNzaW9uIiwiYXBwUHJpdmF0ZUtleSIsImxvYWRVc2VyRGF0YSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7SUFFTUEsTzs7Ozs7Ozs7O3lCQUNRQyxHLEVBQWFDLEssRUFBNEI7QUFDbkQsWUFBTTtBQUFFQyxRQUFBQSxRQUFGO0FBQVlDLFFBQUFBO0FBQVosVUFBMEIsS0FBS0MsYUFBTCxDQUFtQkosR0FBbkIsQ0FBaEM7QUFDQSxhQUFPLHNCQUFZO0FBQ2pCRSxRQUFBQSxRQURpQjtBQUVqQkYsUUFBQUEsR0FGaUI7QUFHakJDLFFBQUFBLEtBSGlCO0FBSWpCRSxRQUFBQTtBQUppQixPQUFaLENBQVA7QUFNRDs7O3dCQUVVSCxHLEVBQWE7QUFDdEIsWUFBTTtBQUFFRSxRQUFBQSxRQUFGO0FBQVlDLFFBQUFBO0FBQVosVUFBMEIsS0FBS0MsYUFBTCxDQUFtQkosR0FBbkIsQ0FBaEM7QUFFQSxhQUFPLHVCQUFhQSxHQUFiLEVBQWtCRSxRQUFsQixFQUE0QkMsU0FBNUIsQ0FBUDtBQUNEOzs7a0NBRW9CSCxHLEVBQWE7QUFDaEMsWUFBTTtBQUFFSyxRQUFBQTtBQUFGLFVBQWtCLHdCQUF4QjtBQUNBLFlBQU07QUFBRUMsUUFBQUEsYUFBRjtBQUFpQkosUUFBQUE7QUFBakIsVUFBOEJHLFdBQVcsQ0FBQ0UsWUFBWixFQUFwQztBQUNBLFlBQU1DLE9BQU8sR0FBSSxHQUFFTixRQUFTLElBQUdGLEdBQUksRUFBbkM7QUFFQSxZQUFNO0FBQUVHLFFBQUFBO0FBQUYsVUFBZ0IsMkJBQVVHLGFBQVYsRUFBeUJFLE9BQXpCLENBQXRCO0FBRUEsYUFBTztBQUNMTixRQUFBQSxRQURLO0FBQ0tDLFFBQUFBO0FBREwsT0FBUDtBQUdEOzs7Ozs7ZUFHWUosTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNpZ25FQ0RTQSB9IGZyb20gJ2Jsb2Nrc3RhY2svbGliL2VuY3J5cHRpb24nO1xuXG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBzYXZlQ2VudHJhbCwgZmV0Y2hDZW50cmFsIH0gZnJvbSAnLi9hcGknO1xuXG5jbGFzcyBDZW50cmFsIHtcbiAgc3RhdGljIHNhdmUoa2V5OiBzdHJpbmcsIHZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgY29uc3QgeyB1c2VybmFtZSwgc2lnbmF0dXJlIH0gPSB0aGlzLm1ha2VTaWduYXR1cmUoa2V5KTtcbiAgICByZXR1cm4gc2F2ZUNlbnRyYWwoe1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBrZXksXG4gICAgICB2YWx1ZSxcbiAgICAgIHNpZ25hdHVyZSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBzaWduYXR1cmUgfSA9IHRoaXMubWFrZVNpZ25hdHVyZShrZXkpO1xuXG4gICAgcmV0dXJuIGZldGNoQ2VudHJhbChrZXksIHVzZXJuYW1lLCBzaWduYXR1cmUpO1xuICB9XG5cbiAgc3RhdGljIG1ha2VTaWduYXR1cmUoa2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCB7IHVzZXJTZXNzaW9uIH0gPSBnZXRDb25maWcoKTtcbiAgICBjb25zdCB7IGFwcFByaXZhdGVLZXksIHVzZXJuYW1lIH0gPSB1c2VyU2Vzc2lvbi5sb2FkVXNlckRhdGEoKTtcbiAgICBjb25zdCBtZXNzYWdlID0gYCR7dXNlcm5hbWV9LSR7a2V5fWA7XG5cbiAgICBjb25zdCB7IHNpZ25hdHVyZSB9ID0gc2lnbkVDRFNBKGFwcFByaXZhdGVLZXksIG1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJuYW1lLCBzaWduYXR1cmUsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDZW50cmFsO1xuIl19