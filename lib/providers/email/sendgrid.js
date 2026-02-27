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
var _crypto = _interopRequireDefault(require("crypto"));
var _request = _interopRequireDefault(require("../../util/request"));
function ownKeys(e, r) { var t = _Object$keys2(e); if (_Object$getOwnPropertySymbols) { var o = _Object$getOwnPropertySymbols(e); r && (o = _filterInstanceProperty(o).call(o, function (r) { return _Object$getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var _context6, _context7; var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? _forEachInstanceProperty(_context6 = ownKeys(Object(t), !0)).call(_context6, function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(e, _Object$getOwnPropertyDescriptors(t)) : _forEachInstanceProperty(_context7 = ownKeys(Object(t))).call(_context7, function (r) { _Object$defineProperty(e, r, _Object$getOwnPropertyDescriptor(t, r)); }); } return e; }
// Types
var EmailSendGridProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailSendGridProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailSendGridProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-sendgrid-provider');
    this.apiKey = config.apiKey;
  }
  return (0, _createClass2["default"])(EmailSendGridProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context;
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, generatedId, response, _context2, _context4, responseBody, _responseBody$errors, firstError, message, _t;
        return _regenerator["default"].wrap(function (_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!request.customize) {
                _context5.next = 2;
                break;
              }
              _context5.next = 1;
              return request.customize(this.id, request);
            case 1:
              _t = _context5.sent;
              _context5.next = 3;
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
              generatedId = id || _crypto["default"].randomBytes(16).toString('hex');
              _context5.next = 4;
              return (0, _request["default"])('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                  Authorization: "Bearer ".concat(this.apiKey),
                  'Content-Type': 'application/json',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: (0, _stringify["default"])(_objectSpread(_objectSpread({
                  personalizations: [_objectSpread(_objectSpread({
                    to: [{
                      email: to
                    }]
                  }, cc && cc.length > 0 ? {
                    cc: (0, _map["default"])(cc).call(cc, function (email) {
                      return {
                        email: email
                      };
                    })
                  } : null), bcc && bcc.length > 0 ? {
                    bcc: (0, _map["default"])(bcc).call(bcc, function (email) {
                      return {
                        email: email
                      };
                    })
                  } : null)],
                  from: {
                    email: from
                  }
                }, replyTo ? {
                  reply_to: {
                    email: replyTo
                  }
                } : null), {}, {
                  subject: subject,
                  content: (0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(text ? [{
                    type: 'text/plain',
                    value: text
                  }] : []), (0, _toConsumableArray2["default"])(html ? [{
                    type: 'text/html',
                    value: html
                  }] : [])),
                  headers: headers,
                  custom_args: {
                    id: generatedId,
                    userId: userId
                  }
                }, attachments && attachments.length > 0 ? {
                  attachments: (0, _map["default"])(attachments).call(attachments, function (_ref2) {
                    var contentType = _ref2.contentType,
                      filename = _ref2.filename,
                      content = _ref2.content;
                    return {
                      type: contentType,
                      filename: filename,
                      content: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                    };
                  })
                } : null))
              });
            case 4:
              response = _context5.sent;
              if (!response.ok) {
                _context5.next = 5;
                break;
              }
              return _context5.abrupt("return", generatedId);
            case 5:
              _context5.next = 6;
              return response.json();
            case 6:
              responseBody = _context5.sent;
              _responseBody$errors = (0, _slicedToArray2["default"])(responseBody.errors, 1), firstError = _responseBody$errors[0];
              message = (0, _map["default"])(_context2 = (0, _keys["default"])(firstError)).call(_context2, function (key) {
                var _context3;
                return (0, _concat["default"])(_context3 = "".concat(key, ": ")).call(_context3, firstError[key]);
              }).join(', ');
              throw new Error((0, _concat["default"])(_context4 = "".concat(response.status, " - ")).call(_context4, message));
            case 7:
            case "end":
              return _context5.stop();
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