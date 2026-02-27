"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));
var _toArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/toArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/asyncToGenerator"));
var _logger = _interopRequireDefault(require("../../util/logger"));
// Types
function recursiveTry(_x, _x2) {
  return _recursiveTry.apply(this, arguments);
}
function _recursiveTry() {
  _recursiveTry = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(providers, request) {
    var _providers, current, others, id, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _providers = (0, _toArray2["default"])(providers), current = _providers[0], others = _providers.slice(1);
          _context.prev = 1;
          _context.next = 2;
          return current.send(request);
        case 2:
          id = _context.sent;
          return _context.abrupt("return", {
            providerId: current.id,
            id: id
          });
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          _logger["default"].warn(current.id, _t);
          if (!(others.length === 0)) {
            _context.next = 4;
            break;
          }
          // no more provider to try
          _t.providerId = current.id;
          throw _t;
        case 4:
          return _context.abrupt("return", recursiveTry(others, request));
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 3]]);
  }));
  return _recursiveTry.apply(this, arguments);
}
var strategyProvidersFallback = function strategyProvidersFallback(providers) {
  return function (request) {
    return recursiveTry(providers, request);
  };
};
var _default = exports["default"] = strategyProvidersFallback;