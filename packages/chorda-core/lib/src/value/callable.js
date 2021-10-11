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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallable = exports.callable = void 0;
var node_1 = require("./node");
var observable_1 = require("./observable");
var _Node = /** @class */ (function (_super) {
    __extends(_Node, _super);
    function _Node() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return _Node;
}(node_1.Node));
var CallableNode = /** @class */ (function (_super) {
    __extends(CallableNode, _super);
    function CallableNode(initValue) {
        var _this = _super.call(this) || this;
        _this._memoValue = initValue;
        _this._value = new _Node();
        return _this;
        //this._events = new EventNode()
    }
    CallableNode.prototype.$subscribe = function (subscriber) {
        return this._value.$subscribe(subscriber);
    };
    CallableNode.prototype.$unsubscribe = function (subscription) {
        this._value.$unsubscribe(subscription);
    };
    CallableNode.prototype.$touch = function (subscriber) {
        //throw new Error("Method not implemented.")
    };
    CallableNode.prototype.$untouch = function () {
        //throw new Error("Method not implemented.")
    };
    CallableNode.prototype.$publish = function (next, prev, keys) {
        this._value.$publish(next, prev, keys);
    };
    CallableNode.prototype.$call = function (thisArg, args) {
        var _this = this;
        if (this._memoValue == null) {
            console.warn('Possible uninitialized callable', args);
        }
        var result = this._memoValue != null ? this._memoValue.apply(thisArg, args) : args[0];
        if (observable_1.isValueSet(result)) {
            result = result.$value;
        }
        if (result && result.then) {
            this.$emit('wait');
            result = result.then(function (response) {
                _this.$emit('done', response);
                //                this.$publish(response)
                return response;
            }, function (fail) {
                _this.$emit('fail', fail);
                return fail;
            });
        }
        else {
            this.$emit('done', result);
            //            this.$publish(result)
        }
        return result;
    };
    CallableNode.prototype.$emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._value.$emit.apply(this._value, __spreadArray([name], args));
    };
    CallableNode.prototype.$on = function (name, callback, target) {
        return this._value.$on(name, callback, target);
    };
    CallableNode.prototype.$off = function (callbackOrTargetOrListener) {
        this._value.$off(callbackOrTargetOrListener);
    };
    CallableNode.prototype.$event = function (name) {
        return null;
        //throw new Error("Method not implemented.")
    };
    CallableNode.prototype.$hasEvent = function (name) {
        return false;
        //throw new Error("Method not implemented.")
    };
    Object.defineProperty(CallableNode.prototype, "$value", {
        get: function () {
            return this._memoValue;
        },
        set: function (value) {
            this._memoValue = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CallableNode.prototype, "$uid", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CallableNode.prototype, "$isTerminal", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    // FIXME убрать после проверки наличия событий в Hub
    CallableNode.prototype.$has = function () {
        return false;
    };
    CallableNode.prototype.$at = function () {
        return null;
    };
    return CallableNode;
}(Function));
var callable = function (initValue) {
    //const value = isValueSet(initValue) ? initValue.$value : initValue
    return observable_1.proxify(initValue, new CallableNode(initValue));
};
exports.callable = callable;
var isCallable = function (v) {
    return v && typeof v.$call === 'function';
};
exports.isCallable = isCallable;
//# sourceMappingURL=callable.js.map