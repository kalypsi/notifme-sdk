"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _excluded = ["customize"];
// Types
var EmailSendmailProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailSendmailProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailSendmailProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-sendmail-provider');
    this.transporter = _nodemailer["default"].createTransport(config);
  }
  return (0, _createClass2["default"])(EmailSendmailProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, customize, rest, result, _t;
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
              customize = _ref.customize;
              rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
              _context.next = 4;
              return this.transporter.sendMail(rest);
            case 4:
              result = _context.sent;
              return _context.abrupt("return", result.messageId);
            case 5:
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
}();