"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _email = _interopRequireDefault(require("./email"));
var _push = _interopRequireDefault(require("./push"));
var _sms = _interopRequireDefault(require("./sms"));
var _voice = _interopRequireDefault(require("./voice"));
var _webpush = _interopRequireDefault(require("./webpush"));
var _slack = _interopRequireDefault(require("./slack"));
var _whatsapp = _interopRequireDefault(require("./whatsapp"));
// Types
function factory(channels) {
  var _context;
  return (0, _reduce["default"])(_context = (0, _keys["default"])(channels)).call(_context, function (acc, key) {
    var _context2;
    acc[key] = (0, _map["default"])(_context2 = channels[key].providers).call(_context2, function (config) {
      switch (key) {
        case 'email':
          return (0, _email["default"])(config);
        case 'sms':
          return (0, _sms["default"])(config);
        case 'voice':
          return (0, _voice["default"])(config);
        case 'push':
          return (0, _push["default"])(config);
        case 'webpush':
          return (0, _webpush["default"])(config);
        case 'slack':
          return (0, _slack["default"])(config);
        case 'whatsapp':
          return (0, _whatsapp["default"])(config);
        default:
          return config;
      }
    });
    return acc;
  }, {});
}