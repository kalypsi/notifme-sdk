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
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
function ownKeys(e, r) { var t = _Object$keys(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context2, _context3; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context2 = ownKeys(Object(t), !0)).call(_context2, function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context3 = ownKeys(Object(t))).call(_context3, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var SmsClickatellProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsClickatellProvider(config) {
    (0, _classCallCheck2["default"])(this, SmsClickatellProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-clickatell-provider');
    // One-way integration API key
    this.apiKey = config.apiKey;
  }

  /*
   * Note: 'from', 'nature', 'messageClass' are not supported.
   */
  return (0, _createClass2["default"])(SmsClickatellProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, id, to, text, type, ttl, response, responseBody, _t, _t2, _t3;
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
              id = _ref.id;
              to = _ref.to;
              text = _ref.text;
              type = _ref.type;
              ttl = _ref.ttl;
              _context.next = 4;
              return (0, _request["default"])('https://platform.clickatell.com/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: this.apiKey,
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(_objectSpread(_objectSpread({
                  // no `from` for one-way integrations
                  to: [to],
                  content: text,
                  charset: type === 'unicode' ? 'UCS2-BE' : 'UTF-8'
                }, ttl ? {
                  validityPeriod: ttl
                } : null), id ? {
                  clientMessageId: id
                } : null))
              });
            case 4:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 8;
                break;
              }
              _context.next = 5;
              return response.json();
            case 5:
              responseBody = _context.sent;
              if (!responseBody.error) {
                _context.next = 6;
                break;
              }
              throw new Error(responseBody.error);
            case 6:
              return _context.abrupt("return", responseBody.messages[0].apiMessageId);
            case 7:
              _context.next = 10;
              break;
            case 8:
              _t2 = Error;
              _context.next = 9;
              return response.text();
            case 9:
              _t3 = _context.sent;
              throw new _t2(_t3);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }())
  }]);
}();