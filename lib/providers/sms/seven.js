"use strict";

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
// Types
var SmsSevenProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsSevenProvider(_ref) {
    var apiKey = _ref.apiKey;
    (0, _classCallCheck2["default"])(this, SmsSevenProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-seven-provider');
    this.apiKey = apiKey;
  }

  /*
   * Note: 'nature' is not supported.
   */
  return (0, _createClass2["default"])(SmsSevenProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, text, to, type, ttl, messageClass, params, response, _yield$response$json, messages, message, _t, _t2, _t3;
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
              _ref2 = _t;
              from = _ref2.from;
              text = _ref2.text;
              to = _ref2.to;
              type = _ref2.type;
              ttl = _ref2.ttl;
              messageClass = _ref2.messageClass;
              params = {
                flash: messageClass === 0 ? 1 : 0,
                from: from,
                text: text,
                to: to,
                ttl: ttl,
                unicode: type === 'unicode' ? 1 : 0
              };
              _context.next = 4;
              return (0, _request["default"])('https://gateway.seven.io/api/sms', {
                body: (0, _stringify["default"])(params),
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  SentWith: 'Notifme',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)',
                  'X-Api-Key': this.apiKey
                },
                method: 'POST'
              });
            case 4:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 6;
                break;
              }
              _context.next = 5;
              return response.json();
            case 5:
              _yield$response$json = _context.sent;
              messages = _yield$response$json.messages;
              message = messages[0];
              return _context.abrupt("return", message.id);
            case 6:
              _t2 = Error;
              _context.next = 7;
              return response.text();
            case 7:
              _t3 = _context.sent;
              throw new _t2(_t3);
            case 8:
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