"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
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
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _security = require("../../util/security");
var _excluded = ["from", "to", "type", "messageId", "text", "mediaUrl", "templateName", "templateData"];
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context5, _context6; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(t), !0)).call(_context5, function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context6 = ownKeys(Object(t))).call(_context6, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var WhatsappInfobipProvider = exports["default"] = /*#__PURE__*/function () {
  function WhatsappInfobipProvider(_ref) {
    var baseUrl = _ref.baseUrl,
      apiKey = _ref.apiKey;
    (0, _classCallCheck2["default"])(this, WhatsappInfobipProvider);
    (0, _defineProperty2["default"])(this, "id", 'whatsapp-infobip-provider');
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  return (0, _createClass2["default"])(WhatsappInfobipProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context;
        var _ref2, from, to, type, messageId, text, mediaUrl, templateName, templateData, rest, payload, endpoint, response, responseBody, _ref3, _ref4, message, _context2, error, _message, _t;
        return _regenerator["default"].wrap(function (_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!request.customize) {
                _context4.next = 2;
                break;
              }
              _context4.next = 1;
              return request.customize(this.id, request);
            case 1:
              _t = _context4.sent;
              _context4.next = 3;
              break;
            case 2:
              _t = request;
            case 3:
              _ref2 = _t;
              from = _ref2.from;
              to = _ref2.to;
              type = _ref2.type;
              messageId = _ref2.messageId;
              text = _ref2.text;
              mediaUrl = _ref2.mediaUrl;
              templateName = _ref2.templateName;
              templateData = _ref2.templateData;
              rest = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
              // Construct the payload
              payload = _objectSpread({
                from: (from || '').replace('+', ''),
                to: (to || '').replace('+', ''),
                messageId: messageId,
                content: {
                  text: text,
                  mediaUrl: mediaUrl,
                  templateName: templateName,
                  templateData: templateData
                }
              }, rest);
              endpoint = (0, _security.assertSafeUrl)((0, _concat["default"])(_context = "".concat(this.baseUrl, "/whatsapp/1/message/")).call(_context, type), 'WhatsApp provider');
              _context4.next = 4;
              return (0, _request["default"])(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "App ".concat(this.apiKey),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(type === 'template' ? [payload] : payload)
              });
            case 4:
              response = _context4.sent;
              _context4.next = 5;
              return response.json();
            case 5:
              responseBody = _context4.sent;
              if (!response.ok) {
                _context4.next = 6;
                break;
              }
              // Handle the potential array or single object response
              _ref3 = (0, _isArray["default"])(responseBody.messages) ? responseBody.messages : [responseBody], _ref4 = (0, _slicedToArray2["default"])(_ref3, 1), message = _ref4[0];
              return _context4.abrupt("return", message.messageId);
            case 6:
              if (!(responseBody.requestError && responseBody.requestError.serviceException)) {
                _context4.next = 7;
                break;
              }
              error = responseBody.requestError.serviceException;
              _message = (0, _map["default"])(_context2 = (0, _keys["default"])(error)).call(_context2, function (key) {
                var _context3;
                return (0, _concat["default"])(_context3 = "".concat(key, ": ")).call(_context3, error[key]);
              }).join(', ');
              throw new Error(_message);
            case 7:
              throw new Error((0, _stringify["default"])(responseBody));
            case 8:
            case "end":
              return _context4.stop();
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