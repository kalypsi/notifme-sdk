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
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context9, _context0; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context9 = ownKeys(Object(t), !0)).call(_context9, function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context0 = ownKeys(Object(t))).call(_context0, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// types
var EmailSparkPostProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailSparkPostProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailSparkPostProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-sparkpost-provider');
    this.apiKey = config.apiKey;
  }
  return (0, _createClass2["default"])(EmailSparkPostProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context, _context2, _context3, _context4;
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, response, responseBody, _context5, _context7, _responseBody$errors, firstError, message, _t;
        return _regenerator["default"].wrap(function (_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (!request.customize) {
                _context8.next = 2;
                break;
              }
              _context8.next = 1;
              return request.customize(this.id, request);
            case 1:
              _t = _context8.sent;
              _context8.next = 3;
              break;
            case 2:
              _t = request;
            case 3:
              _ref = _t;
              id = _ref.id;
              userId = _ref.userId;
              from = _ref.from;
              replyTo = _ref.replyTo;
              subject = _ref.subject;
              html = _ref.html;
              text = _ref.text;
              headers = _ref.headers;
              to = _ref.to;
              cc = _ref.cc;
              bcc = _ref.bcc;
              attachments = _ref.attachments;
              _context8.next = 4;
              return (0, _request["default"])('https://api.sparkpost.com/api/v1/transmissions', {
                method: 'POST',
                headers: {
                  Authorization: this.apiKey,
                  'Content-Type': 'application/json',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])({
                  options: {
                    transactional: true
                  },
                  content: {
                    from: from,
                    reply_to: replyTo,
                    subject: subject,
                    html: html,
                    text: text,
                    headers: _objectSpread(_objectSpread({}, headers), cc && cc.length > 0 ? {
                      CC: cc.join(',')
                    } : null),
                    attachments: (0, _map["default"])(_context = attachments || []).call(_context, function (_ref2) {
                      var contentType = _ref2.contentType,
                        filename = _ref2.filename,
                        content = _ref2.content;
                      return {
                        type: contentType,
                        name: filename,
                        data: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                      };
                    })
                  },
                  recipients: (0, _concat["default"])(_context2 = [{
                    address: {
                      email: to
                    }
                  }]).call(_context2, (0, _toConsumableArray2["default"])((0, _map["default"])(_context3 = cc || []).call(_context3, function (email) {
                    return {
                      address: {
                        email: email,
                        header_to: to
                      }
                    };
                  })), (0, _toConsumableArray2["default"])((0, _map["default"])(_context4 = bcc || []).call(_context4, function (email) {
                    return {
                      address: {
                        email: email,
                        header_to: to
                      }
                    };
                  }))),
                  metadata: {
                    id: id,
                    userId: userId
                  }
                })
              });
            case 4:
              response = _context8.sent;
              _context8.next = 5;
              return response.json();
            case 5:
              responseBody = _context8.sent;
              if (!response.ok) {
                _context8.next = 6;
                break;
              }
              return _context8.abrupt("return", responseBody.results.id);
            case 6:
              _responseBody$errors = (0, _slicedToArray2["default"])(responseBody.errors, 1), firstError = _responseBody$errors[0];
              message = (0, _map["default"])(_context5 = (0, _keys["default"])(firstError)).call(_context5, function (key) {
                var _context6;
                return (0, _concat["default"])(_context6 = "".concat(key, ": ")).call(_context6, firstError[key]);
              }).join(', ');
              throw new Error((0, _concat["default"])(_context7 = "".concat(response.status, " - ")).call(_context7, message));
            case 7:
            case "end":
              return _context8.stop();
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