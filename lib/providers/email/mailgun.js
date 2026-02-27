"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _formData = _interopRequireDefault(require("form-data"));
var _security = require("../../util/security");
// types
var EmailMailgunProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailMailgunProvider(config) {
    (0, _classCallCheck2["default"])(this, EmailMailgunProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-mailgun-provider');
    this.apiKeyBase64 = Buffer.from("api:".concat(config.apiKey)).toString('base64');
    this.domainName = config.domainName;
    this.host = config.host || 'api.mailgun.net';
    this.version = config.version || 'v3';
  }
  return (0, _createClass2["default"])(EmailMailgunProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context, _context2, _context3;
        var _ref, id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, form, endpoint, response, responseBody, _context4, _t;
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
              form = new _formData["default"]();
              form.append('from', from);
              form.append('to', to);
              form.append('subject', subject);
              if (text) form.append('text', text);
              if (html) form.append('html', html);
              if (replyTo) form.append('h:Reply-To', replyTo);
              if (cc && cc.length > 0) (0, _forEach["default"])(cc).call(cc, function (email) {
                return form.append('cc', email);
              });
              if (bcc && bcc.length > 0) (0, _forEach["default"])(bcc).call(bcc, function (email) {
                return form.append('bcc', email);
              });
              if (attachments && attachments.length > 0) {
                (0, _forEach["default"])(attachments).call(attachments, function (_ref2) {
                  var contentType = _ref2.contentType,
                    filename = _ref2.filename,
                    content = _ref2.content;
                  form.append('attachment', content, {
                    filename: filename,
                    contentType: contentType
                  });
                });
              }
              if (headers) (0, _forEach["default"])(_context = (0, _keys["default"])(headers)).call(_context, function (header) {
                return form.append("h:".concat(header), headers[header]);
              });
              if (id) form.append('v:Notification-Id', id);
              if (userId) form.append('v:User-Id', userId);
              endpoint = (0, _security.assertSafeUrl)((0, _concat["default"])(_context2 = (0, _concat["default"])(_context3 = "https://".concat(this.host, "/")).call(_context3, this.version, "/")).call(_context2, this.domainName, "/messages"), 'Mailgun API');
              _context5.next = 4;
              return (0, _request["default"])(endpoint, {
                method: 'POST',
                headers: {
                  Authorization: "Basic ".concat(this.apiKeyBase64),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: form
              });
            case 4:
              response = _context5.sent;
              _context5.next = 5;
              return response.json();
            case 5:
              responseBody = _context5.sent;
              if (!response.ok) {
                _context5.next = 6;
                break;
              }
              return _context5.abrupt("return", responseBody.id);
            case 6:
              throw new Error((0, _concat["default"])(_context4 = "".concat(response.status, " - ")).call(_context4, responseBody.message));
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