"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _v = _interopRequireDefault(require("../../util/aws/v4"));
var _crypto = require("../../util/crypto");
var _request = _interopRequireDefault(require("../../util/request"));
var _mailComposer = _interopRequireDefault(require("nodemailer/lib/mail-composer"));
var _querystring = _interopRequireDefault(require("querystring"));
var _excluded = ["customize"];
// types
var EmailSesProvider = exports["default"] = /*#__PURE__*/function () {
  function EmailSesProvider(_ref) {
    var region = _ref.region,
      accessKeyId = _ref.accessKeyId,
      secretAccessKey = _ref.secretAccessKey,
      sessionToken = _ref.sessionToken;
    (0, _classCallCheck2["default"])(this, EmailSesProvider);
    (0, _defineProperty2["default"])(this, "id", 'email-ses-provider');
    this.credentials = {
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken
    };
  }
  return (0, _createClass2["default"])(EmailSesProvider, [{
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context;
        var region, host, raw, body, apiRequest, signer, response, responseText, _context2, _t, _t2, _t3;
        return _regenerator["default"].wrap(function (_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!(request.text && typeof request.text !== 'string' && !(request.text instanceof Buffer) && !(request.text instanceof Uint8Array))) {
                _context3.next = 1;
                break;
              }
              throw new Error('The "chunk" argument must be of type string or an instance of Buffer or Uint8Array.');
            case 1:
              region = this.credentials.region;
              host = "email.".concat(region, ".amazonaws.com");
              _t = this;
              if (!request.customize) {
                _context3.next = 3;
                break;
              }
              _context3.next = 2;
              return request.customize(this.id, request);
            case 2:
              _t2 = _context3.sent;
              _context3.next = 4;
              break;
            case 3:
              _t2 = request;
            case 4:
              _t3 = _t2;
              _context3.next = 5;
              return _t.getRaw.call(_t, _t3);
            case 5:
              raw = _context3.sent.toString('base64');
              body = _querystring["default"].stringify({
                Action: 'SendRawEmail',
                Version: '2010-12-01',
                'RawMessage.Data': raw
              });
              apiRequest = {
                method: 'POST',
                path: '/',
                headers: {
                  Host: host,
                  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                  'X-Amz-Content-Sha256': (0, _crypto.sha256)(body, 'hex'),
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: body,
                region: region
              };
              signer = new _v["default"](apiRequest, 'ses');
              signer.addAuthorization(this.credentials, new Date());
              _context3.next = 6;
              return (0, _request["default"])((0, _concat["default"])(_context = "https://".concat(host)).call(_context, apiRequest.path), apiRequest);
            case 6:
              response = _context3.sent;
              _context3.next = 7;
              return response.text();
            case 7:
              responseText = _context3.sent;
              if (!(response.ok && (0, _includes["default"])(responseText).call(responseText, '<MessageId>'))) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", responseText.match(/<MessageId>(.*)<\/MessageId>/)[1]);
            case 8:
              throw new Error((0, _concat["default"])(_context2 = "".concat(response.status, " - ")).call(_context2, responseText));
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee, this);
      }));
      function send(_x) {
        return _send.apply(this, arguments);
      }
      return send;
    }()
  }, {
    key: "getRaw",
    value: function () {
      var _getRaw = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
        var customize, request, email;
        return _regenerator["default"].wrap(function (_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              customize = _ref2.customize, request = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
              email = new _mailComposer["default"](request).compile();
              email.keepBcc = true;
              return _context4.abrupt("return", email.build());
            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee2);
      }));
      function getRaw(_x2) {
        return _getRaw.apply(this, arguments);
      }
      return getRaw;
    }()
  }]);
}();