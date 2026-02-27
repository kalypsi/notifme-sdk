"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _logger = _interopRequireDefault(require("./util/logger"));
var _logger2 = _interopRequireDefault(require("./providers/logger"));
var _registry = _interopRequireDefault(require("./util/registry"));
var _excluded = ["success", "channel", "providerId"];
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = _filterInstanceProperty2(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context9, _context0; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context9 = ownKeys(Object(t), !0)).call(_context9, function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context0 = ownKeys(Object(t))).call(_context0, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var Sender = exports["default"] = /*#__PURE__*/function () {
  function Sender(channels, providers, strategies) {
    var _context,
      _this = this;
    (0, _classCallCheck2["default"])(this, Sender);
    this.channels = channels;
    this.providers = providers;
    this.strategies = strategies;

    // note : we can do this memoization because we do not allow to add new provider
    this.senders = (0, _reduce["default"])(_context = (0, _keys["default"])(strategies)).call(_context, function (acc, channel) {
      acc[channel] = _this.providers[channel].length > 0 ? strategies[channel](_this.providers[channel]) : (/*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
          var provider, _t, _t2, _t3;
          return _regenerator["default"].wrap(function (_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _logger["default"].warn("No provider registered for channel \"".concat(channel, "\". Using logger."));
                provider = _registry["default"].getInstance("".concat(channel, "-logger-default"), function () {
                  return new _logger2["default"]({}, channel);
                });
                _t = channel;
                _t2 = provider.id;
                _context2.next = 1;
                return provider.send(request);
              case 1:
                _t3 = _context2.sent;
                return _context2.abrupt("return", {
                  success: true,
                  channel: _t,
                  providerId: _t2,
                  id: _t3
                });
              case 2:
              case "end":
                return _context2.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      return acc;
    }, {});
  }
  return (0, _createClass2["default"])(Sender, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(request) {
        var resultsByChannel, result;
        return _regenerator["default"].wrap(function (_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 1;
              return this.sendOnEachChannel(request);
            case 1:
              resultsByChannel = _context3.sent;
              result = (0, _reduce["default"])(resultsByChannel).call(resultsByChannel, function (acc, _ref2) {
                var success = _ref2.success,
                  channel = _ref2.channel,
                  providerId = _ref2.providerId,
                  rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
                return _objectSpread(_objectSpread({}, acc), {}, {
                  channels: _objectSpread(_objectSpread({}, acc.channels || null), {}, (0, _defineProperty2["default"])({}, channel, {
                    id: rest.id,
                    providerId: providerId
                  }))
                }, !success ? {
                  status: 'error',
                  errors: _objectSpread(_objectSpread({}, acc.errors || null), {}, (0, _defineProperty2["default"])({}, channel, rest.error.message))
                } : null);
              }, {
                status: 'success'
              });
              return _context3.abrupt("return", result);
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee2, this);
      }));
      function send(_x2) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "sendOnEachChannel",
    value: function () {
      var _sendOnEachChannel = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(request) {
        var _context4,
          _context5,
          _this2 = this;
        return _regenerator["default"].wrap(function (_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt("return", _promise["default"].all((0, _map["default"])(_context4 = (0, _filter["default"])(_context5 = (0, _keys["default"])(request)).call(_context5, function (channel) {
                var _context6;
                return (0, _includes["default"])(_context6 = _this2.channels).call(_context6, channel);
              })).call(_context4, /*#__PURE__*/function () {
                var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(channel) {
                  var _t4, _t5, _t6, _t7;
                  return _regenerator["default"].wrap(function (_context7) {
                    while (1) switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.prev = 0;
                        _t4 = _objectSpread;
                        _t5 = {
                          success: true,
                          channel: channel
                        };
                        _context7.next = 1;
                        return _this2.senders[channel](_objectSpread(_objectSpread({}, request.metadata), request[channel]));
                      case 1:
                        _t6 = _context7.sent;
                        return _context7.abrupt("return", _t4(_t5, _t6));
                      case 2:
                        _context7.prev = 2;
                        _t7 = _context7["catch"](0);
                        return _context7.abrupt("return", {
                          channel: channel,
                          success: false,
                          error: _t7,
                          providerId: _t7.providerId
                        });
                      case 3:
                      case "end":
                        return _context7.stop();
                    }
                  }, _callee3, null, [[0, 2]]);
                }));
                return function (_x4) {
                  return _ref3.apply(this, arguments);
                };
              }())));
            case 1:
            case "end":
              return _context8.stop();
          }
        }, _callee4);
      }));
      function sendOnEachChannel(_x3) {
        return _sendOnEachChannel.apply(this, arguments);
      }
      return sendOnEachChannel;
    }()
  }]);
}();