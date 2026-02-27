"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/objectWithoutProperties"));
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));
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
        var region, host, raw, body, apiRequest, signer, response, responseText, _t, _t2, _t3;
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(request.text && typeof request.text !== 'string' && !(request.text instanceof Buffer) && !(request.text instanceof Uint8Array))) {
                _context.next = 1;
                break;
              }
              throw new Error('The "chunk" argument must be of type string or an instance of Buffer or Uint8Array.');
            case 1:
              region = this.credentials.region;
              host = "email.".concat(region, ".amazonaws.com");
              _t = this;
              if (!request.customize) {
                _context.next = 3;
                break;
              }
              _context.next = 2;
              return request.customize(this.id, request);
            case 2:
              _t2 = _context.sent;
              _context.next = 4;
              break;
            case 3:
              _t2 = request;
            case 4:
              _t3 = _t2;
              _context.next = 5;
              return _t.getRaw.call(_t, _t3);
            case 5:
              raw = _context.sent.toString('base64');
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
              _context.next = 6;
              return (0, _request["default"])("https://".concat(host).concat(apiRequest.path), apiRequest);
            case 6:
              response = _context.sent;
              _context.next = 7;
              return response.text();
            case 7:
              responseText = _context.sent;
              if (!(response.ok && responseText.includes('<MessageId>'))) {
                _context.next = 8;
                break;
              }
              return _context.abrupt("return", responseText.match(/<MessageId>(.*)<\/MessageId>/)[1]);
            case 8:
              throw new Error("".concat(response.status, " - ").concat(responseText));
            case 9:
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
  }, {
    key: "getRaw",
    value: function () {
      var _getRaw = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
        var customize, request, email;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              customize = _ref2.customize, request = (0, _objectWithoutProperties2["default"])(_ref2, _excluded);
              email = new _mailComposer["default"](request).compile();
              email.keepBcc = true;
              return _context2.abrupt("return", email.build());
            case 1:
            case "end":
              return _context2.stop();
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