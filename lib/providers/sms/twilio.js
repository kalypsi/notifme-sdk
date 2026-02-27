"use strict";

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
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _formData = _interopRequireDefault(require("form-data"));
// Types
var SmsTwilioProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsTwilioProvider(_ref) {
    var accountSid = _ref.accountSid,
      authToken = _ref.authToken;
    (0, _classCallCheck2["default"])(this, SmsTwilioProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-twilio-provider');
    this.accountSid = accountSid;
    this.apiKey = Buffer.from("".concat(accountSid, ":").concat(authToken)).toString('base64');
  }

  /*
   * Note: 'type', 'nature', 'messageClass' are not supported.
   */
  return (0, _createClass2["default"])(SmsTwilioProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, text, ttl, form, response, responseBody, _t;
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
              to = _ref2.to;
              text = _ref2.text;
              ttl = _ref2.ttl;
              form = new _formData["default"]();
              form.append('From', from);
              form.append('To', to);
              form.append('Body', text);
              if (ttl) form.append('ValidityPeriod', ttl);
              _context.next = 4;
              return (0, _request["default"])("https://api.twilio.com/2010-04-01/Accounts/".concat(this.accountSid, "/Messages.json"), {
                method: 'POST',
                headers: {
                  Authorization: "Basic ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: form
              });
            case 4:
              response = _context.sent;
              _context.next = 5;
              return response.json();
            case 5:
              responseBody = _context.sent;
              if (!response.ok) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", responseBody.sid);
            case 6:
              throw new Error("".concat(response.status, " - ").concat(responseBody.message));
            case 7:
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