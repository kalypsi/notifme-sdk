"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.assertSafeUrl = assertSafeUrl;
exports.redactSensitive = redactSensitive;
exports.sanitizeErrorMessage = sanitizeErrorMessage;
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));
var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));
var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));
var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var SENSITIVE_KEY_REGEX = /(api[-_]?key|auth|authorization|token|secret|password|pass|key|credential|cookie)/i;
function maskString(value) {
  var _context;
  if (value.length <= 8) return '***';
  return (0, _concat["default"])(_context = "".concat((0, _slice["default"])(value).call(value, 0, 2), "***")).call(_context, (0, _slice["default"])(value).call(value, -2));
}
function redactSensitive(value) {
  var _context2;
  if ((0, _isArray["default"])(value)) {
    return (0, _map["default"])(value).call(value, redactSensitive);
  }
  if (!value || (0, _typeof2["default"])(value) !== 'object') {
    return typeof value === 'string' && value.length > 4096 ? "".concat((0, _slice["default"])(value).call(value, 0, 4096), "...[truncated]") : value;
  }
  return (0, _reduce["default"])(_context2 = (0, _keys["default"])(value)).call(_context2, function (acc, key) {
    var item = value[key];
    if (SENSITIVE_KEY_REGEX.test(key)) {
      acc[key] = typeof item === 'string' ? maskString(item) : '***';
      return acc;
    }
    acc[key] = redactSensitive(item);
    return acc;
  }, {});
}
function getAllowedHosts() {
  var _context3, _context4;
  var value = process.env.NOTIFME_ALLOWED_HOSTS || '';
  return (0, _filter["default"])(_context3 = (0, _map["default"])(_context4 = value.split(',')).call(_context4, function (host) {
    return (0, _trim["default"])(host).call(host).toLowerCase();
  })).call(_context3, Boolean);
}
function isAllowedByPattern(hostname, pattern) {
  if ((0, _startsWith["default"])(pattern).call(pattern, '*.')) {
    var suffix = (0, _slice["default"])(pattern).call(pattern, 1);
    return (0, _endsWith["default"])(hostname).call(hostname, suffix);
  }
  return hostname === pattern;
}
function assertSafeUrl(rawUrl, label) {
  var parsed;
  try {
    parsed = new _url["default"](rawUrl);
  } catch (error) {
    throw new Error("Invalid ".concat(label, " URL."));
  }
  var allowInsecure = process.env.NOTIFME_ALLOW_INSECURE_URLS === 'true';
  if (!allowInsecure && parsed.protocol !== 'https:') {
    throw new Error("".concat(label, " URL must use HTTPS."));
  }
  var hostname = parsed.hostname.toLowerCase();
  var allowedHosts = getAllowedHosts();
  if (allowedHosts.length > 0 && !(0, _some["default"])(allowedHosts).call(allowedHosts, function (pattern) {
    return isAllowedByPattern(hostname, pattern);
  })) {
    var _context5;
    throw new Error((0, _concat["default"])(_context5 = "".concat(label, " URL host \"")).call(_context5, hostname, "\" is not in NOTIFME_ALLOWED_HOSTS."));
  }
  return parsed.toString();
}
function sanitizeErrorMessage(error) {
  if (!error) return 'Unknown error';
  var message = error && error.message ? String(error.message) : String(error);
  return message.replace(/(api[-_]?key|token|secret|password)=([^&\s]+)/gi, '$1=***');
}