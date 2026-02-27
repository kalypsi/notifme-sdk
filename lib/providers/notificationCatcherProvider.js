"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _smtp = _interopRequireDefault(require("./email/smtp"));
function ownKeys(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context2, _context3; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(t), !0)).call(_context2, function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context3 = ownKeys(Object(t))).call(_context3, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var NotificationCatcherProvider = exports["default"] = /*#__PURE__*/function () {
  function NotificationCatcherProvider(channel) {
    (0, _classCallCheck2["default"])(this, NotificationCatcherProvider);
    this.id = "".concat(channel, "-notificationcatcher-provider");
    if (process.env.NODE_ENV === 'production' && process.env.NOTIFME_ALLOW_CATCHER_IN_PROD !== 'true') {
      throw new Error('Notification catcher is disabled in production. Set NOTIFME_ALLOW_CATCHER_IN_PROD=true to override.');
    }
    var options = process.env.NOTIFME_CATCHER_OPTIONS || {
      host: '127.0.0.1',
      port: 1025,
      ignoreTLS: true
    };
    this.provider = new _smtp["default"](options);
  }
  return (0, _createClass2["default"])(NotificationCatcherProvider, [{
    key: "sendToCatcher",
    value: function () {
      var _sendToCatcher = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this.provider.send(request));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function sendToCatcher(_x) {
        return _sendToCatcher.apply(this, arguments);
      }
      return sendToCatcher;
    }()
  }], [{
    key: "getConfig",
    value: function getConfig(channels) {
      return (0, _reduce["default"])(channels).call(channels, function (config, channel) {
        return _objectSpread(_objectSpread({}, config), {}, (0, _defineProperty2["default"])({}, channel, {
          providers: [{
            type: 'notificationcatcher'
          }],
          multiProviderStrategy: 'no-fallback'
        }));
      }, {});
    }
  }]);
}();