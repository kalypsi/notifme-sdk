"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _logger = _interopRequireDefault(require("../../util/logger"));
var _security = require("../../util/security");
// Types
var strategyProvidersNoFallback = function strategyProvidersNoFallback(_ref) {
  var _ref2 = (0, _slicedToArray2["default"])(_ref, 1),
    provider = _ref2[0];
  return /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(request) {
      var id, _context, _t;
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 1;
            return provider.send(request);
          case 1:
            id = _context2.sent;
            return _context2.abrupt("return", {
              providerId: provider.id,
              id: id
            });
          case 2:
            _context2.prev = 2;
            _t = _context2["catch"](0);
            _logger["default"].warn((0, _concat["default"])(_context = "[".concat(provider.id, "] ")).call(_context, (0, _security.sanitizeErrorMessage)(_t)));
            _t.providerId = provider.id;
            throw _t;
          case 3:
          case "end":
            return _context2.stop();
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
};
var _default = exports["default"] = strategyProvidersNoFallback;