(function (modules) {
  function require(id) {
    const [fn,mapping] = modules[id];
    const module = {
      exports: {},
    };
    function localRequire(name) {
      return require(mapping[name]);
    }
    fn(localRequire, module, module.exports);
    return module.exports;
  }
  require(0); // 启动入口
})({

  0: [function (require, module, exports) {
    "use strict";

var _foo = require("./foo.js");
(0, _foo.foo)();
console.log("main.js");;
  },{"./foo.js":1}],

  1: [function (require, module, exports) {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;
var _bar = require("./bar.js");
(0, _bar.bar)();
function foo() {
  console.log("foo");
};
  },{"./bar.js":2}],

  2: [function (require, module, exports) {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;
function bar() {
  console.log("bar");
};
  },{}],

});
