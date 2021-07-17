"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomNode = void 0;
var DomNode = /** @class */ (function () {
    function DomNode() {
    }
    // get $value() : D {
    //     return null
    // }
    // set $value
    // get $uid() : string {
    //     return null
    // }
    // get $isTerminal() : boolean {
    //     return true
    // }
    DomNode.prototype.$subscribe = function (subscriber) {
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$unsubscribe = function (subscription) {
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$touch = function (subscriber) {
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$on = function (name, callback, target) {
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$off = function (callbackOrTargetOrListener) {
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$event = function (name) {
        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$hasEvent = function (name) {
        return false;
    };
    return DomNode;
}());
exports.DomNode = DomNode;
