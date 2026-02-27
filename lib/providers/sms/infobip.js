"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
// Types
var SmsInfobipProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsInfobipProvider(_ref) {
    var _context;
    var username = _ref.username,
      password = _ref.password;
    (0, _classCallCheck2["default"])(this, SmsInfobipProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-infobip-provider');
    this.apiKey = Buffer.from((0, _concat["default"])(_context = "".concat(username, ":")).call(_context, password)).toString('base64');
  }

  /*
   * Note: 'nature', 'messageClass', 'type', 'ttl' are not supported.
   */
  return (0, _createClass2["default"])(SmsInfobipProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, text, response, responseBody, message, _context2, error, _context4, _error, _message, _t;
        return _regenerator["default"].wrap(function (_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!request.customize) {
                _context6.next = 2;
                break;
              }
              _context6.next = 1;
              return request.customize(this.id, request);
            case 1:
              _t = _context6.sent;
              _context6.next = 3;
              break;
            case 2:
              _t = request;
            case 3:
              _ref2 = _t;
              from = _ref2.from;
              to = _ref2.to;
              text = _ref2.text;
              _context6.next = 4;
              return (0, _request["default"])('https://api.infobip.com/sms/1/text/single', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Basic ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])({
                  from: from,
                  to: to,
                  text: text
                })
              });
            case 4:
              response = _context6.sent;
              _context6.next = 5;
              return response.json();
            case 5:
              responseBody = _context6.sent;
              if (!response.ok) {
                _context6.next = 8;
                break;
              }
              message = responseBody.messages[0];
              if (!(message.status.groupId === 1)) {
                _context6.next = 6;
                break;
              }
              return _context6.abrupt("return", message.messageId);
            case 6:
              error = message.status;
              throw new Error((0, _map["default"])(_context2 = (0, _keys["default"])(error)).call(_context2, function (key) {
                var _context3;
                return (0, _concat["default"])(_context3 = "".concat(key, ": ")).call(_context3, error[key]);
              }).join(', '));
            case 7:
              _context6.next = 10;
              break;
            case 8:
              if (!(responseBody.requestError && responseBody.requestError.serviceException)) {
                _context6.next = 9;
                break;
              }
              _error = responseBody.requestError.serviceException;
              _message = (0, _map["default"])(_context4 = (0, _keys["default"])(_error)).call(_context4, function (key) {
                var _context5;
                return (0, _concat["default"])(_context5 = "".concat(key, ": ")).call(_context5, _error[key]);
              }).join(', ');
              throw new Error(_message);
            case 9:
              throw new Error((0, _stringify["default"])(responseBody));
            case 10:
            case "end":
              return _context6.stop();
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