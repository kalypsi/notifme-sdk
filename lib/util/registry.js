"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var Registry = /*#__PURE__*/function () {
  function Registry() {
    (0, _classCallCheck2["default"])(this, Registry);
    (0, _defineProperty2["default"])(this, "map", {});
  }
  return (0, _createClass2["default"])(Registry, [{
    key: "getInstance",
    value: function getInstance(key, getValueIfUndefined) {
      if (!(0, _map["default"])(this)[key]) {
        (0, _map["default"])(this)[key] = getValueIfUndefined();
      }
      return (0, _map["default"])(this)[key];
    }
  }]);
}();
var _default = exports["default"] = new Registry();