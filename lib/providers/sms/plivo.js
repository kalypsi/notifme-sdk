"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
// Types
var SmsPlivoProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsPlivoProvider(_ref) {
    var authId = _ref.authId,
      authToken = _ref.authToken;
    (0, _classCallCheck2["default"])(this, SmsPlivoProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-plivo-provider');
    this.authId = authId;
    this.apiKey = Buffer.from("".concat(authId, ":").concat(authToken)).toString('base64');
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  return (0, _createClass2["default"])(SmsPlivoProvider, [{
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref2, from, to, text, response, responseBody, _t, _t2, _t3, _t4;
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
              _context.next = 4;
              return (0, _request["default"])("https://api.plivo.com/v1/Account/".concat(this.authId, "/Message/"), {
                method: 'POST',
                headers: {
                  Authorization: "Basic ".concat(this.apiKey),
                  'Content-Type': 'application/json',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])({
                  src: from,
                  dst: to,
                  text: text
                })
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
              responseBody = _context.sent;
              return _context.abrupt("return", responseBody.message_uuid[0]);
            case 6:
              _t2 = Error;
              if (!(response.status === 401)) {
                _context.next = 8;
                break;
              }
              _context.next = 7;
              return response.text();
            case 7:
              _t3 = _context.sent;
              _context.next = 10;
              break;
            case 8:
              _context.next = 9;
              return response.json();
            case 9:
              _t3 = _context.sent.error;
            case 10:
              _t4 = _t3;
              throw new _t2(_t4);
            case 11:
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