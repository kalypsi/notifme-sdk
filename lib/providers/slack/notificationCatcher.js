"use strict";

var _Reflect$construct = require("@babel/runtime-corejs2/core-js/reflect/construct");
var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));
var _notificationCatcherProvider = _interopRequireDefault(require("../notificationCatcherProvider"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? _Reflect$construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
// Types
var SlackCatcherProvider = exports["default"] = /*#__PURE__*/function (_NotificationCatcherP) {
  function SlackCatcherProvider() {
    (0, _classCallCheck2["default"])(this, SlackCatcherProvider);
    return _callSuper(this, SlackCatcherProvider, arguments);
  }
  (0, _inherits2["default"])(SlackCatcherProvider, _NotificationCatcherP);
  return (0, _createClass2["default"])(SlackCatcherProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, text, _t;
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!request.customize) {
                _context.next = 2;
                break;
              }
              _context.next = 1;
              return request.customize(this.id, request);
            case 1:
              _t = _context.sent;
              _context.next = 3;
              break;
            case 2:
              _t = request;
            case 3:
              _ref = _t;
              text = _ref.text;
              this.sendToCatcher({
                to: 'public.channel@slack',
                from: '-',
                subject: "".concat(text.substring(0, 20)).concat(text.length > 20 ? '...' : ''),
                text: text,
                headers: {
                  'X-type': 'slack',
                  'X-to': '[slack public channel]'
                }
              });
              return _context.abrupt("return", '');
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }]);
}(_notificationCatcherProvider["default"]);