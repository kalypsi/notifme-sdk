"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _excluded = ["webhookUrl"];
// Types
var SlackProvider = exports["default"] = /*#__PURE__*/function () {
  function SlackProvider(config) {
    (0, _classCallCheck2["default"])(this, SlackProvider);
    (0, _defineProperty2["default"])(this, "id", 'slack-provider');
    this.webhookUrl = config.webhookUrl;
  }
  return (0, _createClass2["default"])(SlackProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _ref, webhookUrl, rest, apiRequest, response, responseText, _t;
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
              webhookUrl = _ref.webhookUrl;
              rest = (0, _objectWithoutProperties2["default"])(_ref, _excluded);
              apiRequest = {
                method: 'POST',
                body: (0, _stringify["default"])(rest)
              };
              _context.next = 4;
              return (0, _request["default"])(webhookUrl || this.webhookUrl, apiRequest);
            case 4:
              response = _context.sent;
              if (!response.ok) {
                _context.next = 5;
                break;
              }
              return _context.abrupt("return", '');
            case 5:
              _context.next = 6;
              return response.text();
            case 6:
              responseText = _context.sent;
              throw new Error("".concat(response.status, " - ").concat(responseText));
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
    }()
  }]);
}();