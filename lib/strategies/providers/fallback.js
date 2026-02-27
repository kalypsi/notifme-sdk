"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _toArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _logger = _interopRequireDefault(require("../../util/logger"));
var _security = require("../../util/security");
// Types
function recursiveTry(_x, _x2) {
  return _recursiveTry.apply(this, arguments);
}
function _recursiveTry() {
  _recursiveTry = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(providers, request) {
    var _providers, current, others, id, _context, _t;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _providers = (0, _toArray2["default"])(providers), current = _providers[0], others = (0, _slice["default"])(_providers).call(_providers, 1);
          _context2.prev = 1;
          _context2.next = 2;
          return current.send(request);
        case 2:
          id = _context2.sent;
          return _context2.abrupt("return", {
            providerId: current.id,
            id: id
          });
        case 3:
          _context2.prev = 3;
          _t = _context2["catch"](1);
          _logger["default"].warn((0, _concat["default"])(_context = "[".concat(current.id, "] ")).call(_context, (0, _security.sanitizeErrorMessage)(_t)));
          if (!(others.length === 0)) {
            _context2.next = 4;
            break;
          }
          // no more provider to try
          _t.providerId = current.id;
          throw _t;
        case 4:
          return _context2.abrupt("return", recursiveTry(others, request));
        case 5:
        case "end":
          return _context2.stop();
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