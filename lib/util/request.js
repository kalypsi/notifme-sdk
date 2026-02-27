"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectDestructuringEmpty"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _isFinite = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-finite"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _httpsProxyAgent = _interopRequireDefault(require("https-proxy-agent"));
/* global AbortController */
var DEFAULT_TIMEOUT_MS = 10000;
var DEFAULT_RETRY_DELAY_MS = 250;
function getTimeoutMs() {
  var raw = Number(process.env.NOTIFME_HTTP_TIMEOUT_MS);
  return (0, _isFinite["default"])(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}
function getRetryCount() {
  var raw = Number(process.env.NOTIFME_HTTP_RETRIES);
  return (0, _isFinite["default"])(raw) && raw >= 0 ? Math.floor(raw) : 0;
}
function getRetryDelayMs() {
  var raw = Number(process.env.NOTIFME_HTTP_RETRY_DELAY_MS);
  return (0, _isFinite["default"])(raw) && raw > 0 ? raw : DEFAULT_RETRY_DELAY_MS;
}
function sleep(ms) {
  return new _promise["default"](function (resolve) {
    return (0, _setTimeout2["default"])(resolve, ms);
  });
}
function isRetryableError(error) {
  if (!error) return false;
  if (error.name === 'AbortError') return true;
  var retryableCodes = ['ECONNRESET', 'EAI_AGAIN', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED'];
  return (0, _includes["default"])(retryableCodes).call(retryableCodes, error.code);
}
var _default = exports["default"] = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
    var _ref2,
      options,
      retries,
      attempt,
      _loop,
      _ret,
      _args2 = arguments;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _ref2 = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {}, options = (0, _extends2["default"])({}, ((0, _objectDestructuringEmpty2["default"])(_ref2), _ref2));
          if (!options.agent && process.env.NOTIFME_HTTP_PROXY) {
            options.agent = new _httpsProxyAgent["default"](process.env.NOTIFME_HTTP_PROXY);
          }
          retries = getRetryCount();
          attempt = 0;
          _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
            var controller, timeout, _t, _t2, _t3, _t4;
            return _regenerator["default"].wrap(function (_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (options.signal) {
                    _context.next = 6;
                    break;
                  }
                  // $FlowIgnore - AbortController is a global in Node 16+
                  controller = new AbortController();
                  timeout = (0, _setTimeout2["default"])(function () {
                    return controller.abort();
                  }, getTimeoutMs());
                  options.signal = controller.signal;
                  _context.prev = 1;
                  _context.next = 2;
                  return (0, _nodeFetch["default"])(url, options);
                case 2:
                  _t = _context.sent;
                  return _context.abrupt("return", {
                    v: _t
                  });
                case 3:
                  _context.prev = 3;
                  _t2 = _context["catch"](1);
                  if (!(attempt >= retries || !isRetryableError(_t2))) {
                    _context.next = 4;
                    break;
                  }
                  throw _t2;
                case 4:
                  _context.prev = 4;
                  clearTimeout(timeout);
                  delete options.signal;
                  return _context.finish(4);
                case 5:
                  _context.next = 9;
                  break;
                case 6:
                  _context.prev = 6;
                  _context.next = 7;
                  return (0, _nodeFetch["default"])(url, options);
                case 7:
                  _t3 = _context.sent;
                  return _context.abrupt("return", {
                    v: _t3
                  });
                case 8:
                  _context.prev = 8;
                  _t4 = _context["catch"](6);
                  if (!(attempt >= retries || !isRetryableError(_t4))) {
                    _context.next = 9;
                    break;
                  }
                  throw _t4;
                case 9:
                  attempt += 1;
                  _context.next = 10;
                  return sleep(getRetryDelayMs() * attempt);
                case 10:
                case "end":
                  return _context.stop();
              }
            }, _loop, null, [[1, 3, 4, 5], [6, 8]]);
          });
        case 1:
          if (!(attempt <= retries)) {
            _context2.next = 4;
            break;
          }
          return _context2.delegateYield(_loop(), "t0", 2);
        case 2:
          _ret = _context2.t0;
          if (!_ret) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", _ret.v);
        case 3:
          _context2.next = 1;
          break;
        case 4:
          return _context2.abrupt("return", (0, _nodeFetch["default"])(url, options));
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();