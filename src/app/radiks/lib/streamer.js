"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _wolfy87Eventemitter = _interopRequireDefault(require("wolfy87-eventemitter"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EVENT_NAME = 'RADIKS_STREAM_MESSAGE';

let Streamer =
/*#__PURE__*/
function () {
  function Streamer() {
    _classCallCheck(this, Streamer);
  }

  _createClass(Streamer, null, [{
    key: "init",
    value: function init() {
      if (this.initialized) {
        return this.socket;
      }

      const {
        apiServer
      } = (0, _config.getConfig)();
      // const protocol = document.location.protocol === 'http:' ? 'ws' : 'wss';
      const protocol = 'ws';
      const socket = new WebSocket(`${protocol}://${apiServer.replace(/^https?:\/\//, '')}/radiks/stream/`);
      this.emitter = new _wolfy87Eventemitter.default();
      this.socket = socket;
      this.initialized = true;

      socket.onmessage = event => {
        this.emitter.emit(EVENT_NAME, [event]);
      };

      return socket;
    }
  }, {
    key: "addListener",
    value: function addListener(callback) {
      this.init();
      this.emitter.addListener(EVENT_NAME, callback);
    }
  }, {
    key: "removeListener",
    value: function removeListener(callback) {
      this.init();
      this.emitter.removeListener(EVENT_NAME, callback);
    }
  }]);

  return Streamer;
}();

exports.default = Streamer;

_defineProperty(Streamer, "initialized", void 0);

_defineProperty(Streamer, "socket", void 0);

_defineProperty(Streamer, "emitter", void 0);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJlYW1lci50cyJdLCJuYW1lcyI6WyJFVkVOVF9OQU1FIiwiU3RyZWFtZXIiLCJpbml0aWFsaXplZCIsInNvY2tldCIsImFwaVNlcnZlciIsInByb3RvY29sIiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsIldlYlNvY2tldCIsInJlcGxhY2UiLCJlbWl0dGVyIiwiRXZlbnRFbWl0dGVyIiwib25tZXNzYWdlIiwiZXZlbnQiLCJlbWl0IiwiY2FsbGJhY2siLCJpbml0IiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFFQSxNQUFNQSxVQUFVLEdBQUcsdUJBQW5COztJQUVxQkMsUTs7Ozs7Ozs7OzJCQUtMO0FBQ1osVUFBSSxLQUFLQyxXQUFULEVBQXNCO0FBQ3BCLGVBQU8sS0FBS0MsTUFBWjtBQUNEOztBQUNELFlBQU07QUFBRUMsUUFBQUE7QUFBRixVQUFnQix3QkFBdEI7QUFDQSxZQUFNQyxRQUFRLEdBQUdDLFFBQVEsQ0FBQ0MsUUFBVCxDQUFrQkYsUUFBbEIsS0FBK0IsT0FBL0IsR0FBeUMsSUFBekMsR0FBZ0QsS0FBakU7QUFDQSxZQUFNRixNQUFNLEdBQUcsSUFBSUssU0FBSixDQUFlLEdBQUVILFFBQVMsTUFBS0QsU0FBUyxDQUFDSyxPQUFWLENBQWtCLGNBQWxCLEVBQWtDLEVBQWxDLENBQXNDLGlCQUFyRSxDQUFmO0FBQ0EsV0FBS0MsT0FBTCxHQUFlLElBQUlDLDRCQUFKLEVBQWY7QUFDQSxXQUFLUixNQUFMLEdBQWNBLE1BQWQ7QUFDQSxXQUFLRCxXQUFMLEdBQW1CLElBQW5COztBQUNBQyxNQUFBQSxNQUFNLENBQUNTLFNBQVAsR0FBb0JDLEtBQUQsSUFBVztBQUM1QixhQUFLSCxPQUFMLENBQWFJLElBQWIsQ0FBa0JkLFVBQWxCLEVBQThCLENBQUNhLEtBQUQsQ0FBOUI7QUFDRCxPQUZEOztBQUdBLGFBQU9WLE1BQVA7QUFDRDs7O2dDQUVrQlksUSxFQUFpQztBQUNsRCxXQUFLQyxJQUFMO0FBQ0EsV0FBS04sT0FBTCxDQUFhTyxXQUFiLENBQXlCakIsVUFBekIsRUFBcUNlLFFBQXJDO0FBQ0Q7OzttQ0FFcUJBLFEsRUFBb0I7QUFDeEMsV0FBS0MsSUFBTDtBQUNBLFdBQUtOLE9BQUwsQ0FBYVEsY0FBYixDQUE0QmxCLFVBQTVCLEVBQXdDZSxRQUF4QztBQUNEOzs7Ozs7OztnQkE3QmtCZCxROztnQkFBQUEsUTs7Z0JBQUFBLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJztcblxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5jb25zdCBFVkVOVF9OQU1FID0gJ1JBRElLU19TVFJFQU1fTUVTU0FHRSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbWVyIHtcbiAgc3RhdGljIGluaXRpYWxpemVkOiBib29sZWFuO1xuICBzdGF0aWMgc29ja2V0OiBXZWJTb2NrZXQ7XG4gIHN0YXRpYyBlbWl0dGVyOiBFdmVudEVtaXR0ZXI7XG5cbiAgc3RhdGljIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvY2tldDtcbiAgICB9XG4gICAgY29uc3QgeyBhcGlTZXJ2ZXIgfSA9IGdldENvbmZpZygpO1xuICAgIGNvbnN0IHByb3RvY29sID0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOicgPyAnd3MnIDogJ3dzcyc7XG4gICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldChgJHtwcm90b2NvbH06Ly8ke2FwaVNlcnZlci5yZXBsYWNlKC9eaHR0cHM/OlxcL1xcLy8sICcnKX0vcmFkaWtzL3N0cmVhbS9gKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoRVZFTlRfTkFNRSwgW2V2ZW50XSk7XG4gICAgfTtcbiAgICByZXR1cm4gc29ja2V0O1xuICB9XG5cbiAgc3RhdGljIGFkZExpc3RlbmVyKGNhbGxiYWNrOiAoYXJnczogYW55W10pID0+IHZvaWQpIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgICB0aGlzLmVtaXR0ZXIuYWRkTGlzdGVuZXIoRVZFTlRfTkFNRSwgY2FsbGJhY2spO1xuICB9XG5cbiAgc3RhdGljIHJlbW92ZUxpc3RlbmVyKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMuZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihFVkVOVF9OQU1FLCBjYWxsYmFjayk7XG4gIH1cbn1cbiJdfQ==