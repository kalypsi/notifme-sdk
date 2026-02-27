"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));
var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _request = _interopRequireDefault(require("../../util/request"));
var _crypto = _interopRequireDefault(require("crypto"));
// Types
var SmsOvhProvider = exports["default"] = /*#__PURE__*/function () {
  function SmsOvhProvider(_ref) {
    var appKey = _ref.appKey,
      appSecret = _ref.appSecret,
      consumerKey = _ref.consumerKey,
      account = _ref.account,
      host = _ref.host;
    (0, _classCallCheck2["default"])(this, SmsOvhProvider);
    (0, _defineProperty2["default"])(this, "id", 'sms-ovh-provider');
    this.credentials = {
      appKey: appKey,
      appSecret: appSecret,
      consumerKey: consumerKey,
      account: account,
      host: host
    };
  }
  return (0, _createClass2["default"])(SmsOvhProvider, [{
    key: "signRequest",
    value: function signRequest(httpMethod, url, body, timestamp) {
      var _this$credentials = this.credentials,
        appSecret = _this$credentials.appSecret,
        consumerKey = _this$credentials.consumerKey;
      var signature = [appSecret, consumerKey, httpMethod, url, body, timestamp];
      return '$1$' + _crypto["default"].createHash('sha1').update(signature.join('+')).digest('hex');
    }

    /*
     * Note: read this tutorial to create credentials on Ovh.com:
     * https://www.ovh.com/fr/g1639.envoyer_des_sms_avec_lapi_ovh_en_php
     */
  }, {
    key: "send",
    value: (function () {
      var _send = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
        var _context2;
        var _this$credentials2, appKey, consumerKey, account, host, timestamp, _ref2, from, to, text, type, ttl, messageClass, body, reqBody, url, response, responseBody, _context3, _t;
        return _regenerator["default"].wrap(function (_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _this$credentials2 = this.credentials, appKey = _this$credentials2.appKey, consumerKey = _this$credentials2.consumerKey, account = _this$credentials2.account, host = _this$credentials2.host;
              timestamp = Math.round((0, _now["default"])() / 1000); // Documentation: https://api.ovh.com/console/#/sms/%7BserviceName%7D/jobs#POST
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
              text = _ref2.text;
              type = _ref2.type;
              ttl = _ref2.ttl;
              messageClass = _ref2.messageClass;
              body = (0, _stringify["default"])({
                sender: from,
                message: text,
                receivers: [to],
                charset: 'UTF-8',
                "class": messageClass === 0 ? 'flash' : messageClass === 1 ? 'phoneDisplay' : messageClass === 2 ? 'sim' : messageClass === 3 ? 'toolkit' : null,
                noStopClause: type === 'transactional',
                validityPeriod: ttl
              }); // Escape unicode
              reqBody = body.replace(/[\u0080-\uFFFF]/g, function (m) {
                var _context;
                return "\\u" + (0, _slice["default"])(_context = '0000' + m.charCodeAt(0).toString(16)).call(_context, -4);
              });
              url = (0, _concat["default"])(_context2 = "https://".concat(host, "/1.0/sms/")).call(_context2, account, "/jobs/");
              _context4.next = 4;
              return (0, _request["default"])(url, {
                method: 'POST',
                headers: {
                  'X-Ovh-Timestamp': timestamp,
                  'X-Ovh-Signature': this.signRequest('POST', url, reqBody, timestamp),
                  'X-Ovh-Consumer': consumerKey,
                  'X-Ovh-Application': appKey,
                  'Content-Length': reqBody.length,
                  'Content-Type': 'application/json charset=utf-8',
                  'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                },
                body: body
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
              return _context4.abrupt("return", responseBody.ids[0]);
            case 6:
              throw new Error((0, _concat["default"])(_context3 = "".concat(response.status, " - ")).call(_context3, responseBody.message));
            case 7:
            case "end":
              return _context4.stop();
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