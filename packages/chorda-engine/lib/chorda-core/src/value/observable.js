"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxify = exports.observable = exports.ProxyObservableNode = exports.autoTerminal = void 0;
var node_1 = require("./node");
var _AutoTerminal = false;
var autoTerminal = function (fn) {
    var prevAutoTermial = _AutoTerminal;
    _AutoTerminal = true;
    var result = fn();
    _AutoTerminal = prevAutoTermial;
    return result;
};
exports.autoTerminal = autoTerminal;
var ProxyObservableNode = /** @class */ (function (_super) {
    __extends(ProxyObservableNode, _super);
    function ProxyObservableNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProxyObservableNode.prototype._createEntry = function (value, key) {
        return exports.proxify(value, new ProxyObservableNode(value, this, key));
    };
    return ProxyObservableNode;
}(node_1.ObservableNode));
exports.ProxyObservableNode = ProxyObservableNode;
var observable = function (initValue, uidFunc) {
    if (initValue != null && initValue.$subscribe) {
        return initValue;
    }
    else {
        return exports.proxify(initValue, new ProxyObservableNode(initValue, null, null, uidFunc));
    }
};
exports.observable = observable;
// const ownProps: Set<string|number|symbol> = new Set(['$key', '$value', '$uid', '$source'])
// console.log(Object.getOwnPropertyNames(new ProxyObservableNode()))
var proxify = function (obj, node) {
    var proxy = new Proxy(node, {
        get: function (target, name) {
            // собственные свойства
            if (name in target) {
                return target[name];
            }
            var entry = target.$at(name);
            if (_AutoTerminal && entry.$isTerminal) {
                return entry.$value;
            }
            return entry;
        },
        set: function (target, name, v) {
            if (name in target) {
                target[name] = v;
            }
            else {
                target.$at(name).$value = v;
            }
            return true;
        }
    });
    return proxy;
};
exports.proxify = proxify;
