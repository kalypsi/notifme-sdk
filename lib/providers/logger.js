"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _crypto = _interopRequireDefault(require("crypto"));
var _logger = _interopRequireDefault(require("../util/logger"));
var _security = require("../util/security");
// Types
var LoggerProvider = exports["default"] = /*#__PURE__*/function () {
  function LoggerProvider(config, channel) {
    (0, _classCallCheck2["default"])(this, LoggerProvider);
    this.id = "".concat(channel, "-logger-provider");
    this.channel = channel;
  }
  return (0, _createClass2["default"])(LoggerProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _logger["default"].info((0, _concat["default"])(_context = "[".concat(this.channel.toUpperCase(), "] Sent by \"")).call(_context, this.id, "\":"));
              _logger["default"].info((0, _security.redactSensitive)(request));
              return _context2.abrupt("return", "id-".concat(_crypto["default"].randomBytes(16).toString('hex')));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }]);
}();