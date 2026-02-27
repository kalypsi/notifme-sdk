"use strict";

var _Reflect$construct = require("@babel/runtime-corejs3/core-js-stable/reflect/construct");
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
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));
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
        var _context;
        var _ref, text, _t;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!request.customize) {
                _context2.next = 2;
                break;
              }
              _context2.next = 1;
              return request.customize(this.id, request);
            case 1:
              _t = _context2.sent;
              _context2.next = 3;
              break;
            case 2:
              _t = request;
            case 3:
              _ref = _t;
              text = _ref.text;
              this.sendToCatcher({
                to: 'public.channel@slack',
                from: '-',
                subject: (0, _concat["default"])(_context = "".concat(text.substring(0, 20))).call(_context, text.length > 20 ? '...' : ''),
                text: text,
                headers: {
                  'X-type': 'slack',
                  'X-to': '[slack public channel]'
                }
              });
              return _context2.abrupt("return", '');
            case 4:
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
}(_notificationCatcherProvider["default"]);