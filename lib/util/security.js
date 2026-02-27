"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.assertSafeUrl = assertSafeUrl;
exports.redactSensitive = redactSensitive;
exports.sanitizeErrorMessage = sanitizeErrorMessage;
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/typeof"));
var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));
var SENSITIVE_KEY_REGEX = /(api[-_]?key|auth|authorization|token|secret|password|pass|key|credential|cookie)/i;
function maskString(value) {
  if (value.length <= 8) return '***';
  return "".concat(value.slice(0, 2), "***").concat(value.slice(-2));
}
function redactSensitive(value) {
  if ((0, _isArray["default"])(value)) {
    return value.map(redactSensitive);
  }
  if (!value || (0, _typeof2["default"])(value) !== 'object') {
    return typeof value === 'string' && value.length > 4096 ? "".concat(value.slice(0, 4096), "...[truncated]") : value;
  }
  return (0, _keys["default"])(value).reduce(function (acc, key) {
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
  var value = process.env.NOTIFME_ALLOWED_HOSTS || '';
  return value.split(',').map(function (host) {
    return host.trim().toLowerCase();
  }).filter(Boolean);
}
function isAllowedByPattern(hostname, pattern) {
  if (pattern.startsWith('*.')) {
    var suffix = pattern.slice(1);
    return hostname.endsWith(suffix);
  }
  return hostname === pattern;
}
function assertSafeUrl(rawUrl, label) {
  var parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (error) {
    throw new Error("Invalid ".concat(label, " URL."));
  }
  var allowInsecure = process.env.NOTIFME_ALLOW_INSECURE_URLS === 'true';
  if (!allowInsecure && parsed.protocol !== 'https:') {
    throw new Error("".concat(label, " URL must use HTTPS."));
  }
  var hostname = parsed.hostname.toLowerCase();
  var allowedHosts = getAllowedHosts();
  if (allowedHosts.length > 0 && !allowedHosts.some(function (pattern) {
    return isAllowedByPattern(hostname, pattern);
  })) {
    throw new Error("".concat(label, " URL host \"").concat(hostname, "\" is not in NOTIFME_ALLOWED_HOSTS."));
  }
  return parsed.toString();
}
function sanitizeErrorMessage(error) {
  if (!error) return 'Unknown error';
  var message = error && error.message ? String(error.message) : String(error);
  return message.replace(/(api[-_]?key|token|secret|password)=([^&\s]+)/gi, '$1=***');
}