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
exports.isIterable = exports.iterable = exports.IterableNode = void 0;
var node_1 = require("./node");
var observable_1 = require("./observable");
var IterableNode = /** @class */ (function (_super) {
    __extends(IterableNode, _super);
    function IterableNode(initValue, origin, key) {
        var _this = _super.call(this) || this;
        _this._origin = origin;
        _this._name = key;
        _this._memoValue = {}; // FIXME обманываем isTerminal
        if (!origin) {
            _this._origin = observable_1.observable(initValue);
        }
        // FIXME это не должно быть в конструкторе
        _this._origin.$subscribe(_this);
        return _this;
    }
    Object.defineProperty(IterableNode.prototype, "$name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    // $publish(next: any, prev?: any, keys?: {[key: string]: any}): void {
    // }
    IterableNode.prototype.$each = function (f) {
        //        console.log('each')
        var origin = this._origin; //|| this//(this as ValueSet<T>)
        var v = origin.$value;
        // console.log('each', v)
        // console.log('each', (origin as any)._entries)
        for (var i in v) {
            f(origin.$at(i), i); // FIXME
        }
        //        console.log('each end')
        // if (Array.isArray(v)) {
        //     for (let i = 0; i < v.length; i++) {
        //         f(origin.$at(i))
        //     }
        // }
        // else {
        //     for (let i in v) {
        //         f(origin.$at(i as K))
        //     }    
        // }
        // origin.$ownKeys().forEach(i => {
        //     f(origin.$at(i as K))
        // })
    };
    IterableNode.prototype.$unsubscribe = function (subscription) {
        _super.prototype.$unsubscribe.call(this, subscription);
        if (this._subscriptions.length == 0) {
            this._origin.$unsubscribe(this);
            this._origin = null;
            this._initialized = false;
            console.log('unsubscribed iterable detected [unsubscribe]');
        }
    };
    return IterableNode;
}(node_1.Node));
exports.IterableNode = IterableNode;
var iterable = function (source, key) {
    if (key === void 0) { key = '__it'; }
    return (observable_1.isObservable(source) ? new IterableNode(null, source, key) : new IterableNode(source, null, key));
};
exports.iterable = iterable;
var isIterable = function (v) {
    return v != null && typeof v.$each === 'function';
};
exports.isIterable = isIterable;
//# sourceMappingURL=iterable.js.map