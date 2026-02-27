"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = factory;
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _fallback = _interopRequireDefault(require("./fallback"));
var _noFallback = _interopRequireDefault(require("./no-fallback"));
var _roundrobin = _interopRequireDefault(require("./roundrobin"));
// Types
var providerStrategies = {
  fallback: _fallback["default"],
  'no-fallback': _noFallback["default"],
  roundrobin: _roundrobin["default"]
};
var strategies = (0, _keys["default"])(providerStrategies);
function factory(channels) {
  var _context;
  return (0, _reduce["default"])(_context = (0, _keys["default"])(channels)).call(_context, function (acc, key) {
    var optionStrategy = channels[key].multiProviderStrategy;
    if (typeof optionStrategy === 'function') {
      acc[key] = optionStrategy;
    } else if ((0, _includes["default"])(strategies).call(strategies, optionStrategy)) {
      acc[key] = providerStrategies[optionStrategy];
    } else {
      var _context2;
      throw new Error((0, _concat["default"])(_context2 = "\"".concat(optionStrategy, "\" is not a valid strategy. Strategy must be a function or ")).call(_context2, strategies.join('|'), "."));
    }
    return acc;
  }, {});
}