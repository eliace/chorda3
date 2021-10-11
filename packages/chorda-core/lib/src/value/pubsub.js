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
exports.PubSub = exports.spySubscriptions = void 0;
var bus_1 = require("./bus");
// Spies
var _SpySubscriptions = null;
var spySubscriptions = function (fn) {
    var prevSub = _SpySubscriptions;
    _SpySubscriptions = [];
    fn();
    var result = _SpySubscriptions;
    _SpySubscriptions = prevSub;
    return result;
};
exports.spySubscriptions = spySubscriptions;
var PubSub = /** @class */ (function (_super) {
    __extends(PubSub, _super);
    function PubSub(global) {
        var _this = _super.call(this, global) || this;
        _this._subscriptions = [];
        return _this;
    }
    PubSub.prototype.$touch = function (subscriber) {
        throw new Error("Method not implemented.");
    };
    PubSub.prototype.$untouch = function () {
        throw new Error("Method not implemented.");
    };
    PubSub.prototype.$publish = function (next, prev, keys) {
        throw new Error("Method not implemented.");
    };
    PubSub.prototype.$subscribe = function (subscriber) {
        // if (this._destroyed) {
        //     console.error('Cannot subscribe to deleted value')
        //     return null
        // }
        // проверяем, что такая подписка уже есть
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var sub_1 = _a[_i];
            if (sub_1.subscriber == subscriber || sub_1.subscriber.$publish == subscriber) {
                return sub_1;
            }
        }
        if (typeof subscriber === 'function') {
            subscriber = {
                $publish: subscriber
            };
        }
        var sub = {
            subscriber: subscriber,
            observable: this
        };
        this._subscriptions.push(sub);
        if (_SpySubscriptions) {
            _SpySubscriptions.push(sub);
        }
        return sub;
    };
    PubSub.prototype.$unsubscribe = function (subscription) {
        // if (this._destroyed) {
        //     console.error('Cannot unsubscribe from deleted value')
        //     return 
        // }
        this._subscriptions = this._subscriptions.filter(function (sub) { return sub != subscription && sub.subscriber != subscription && sub.subscriber.$publish != subscription; });
    };
    Object.defineProperty(PubSub.prototype, "$subscriptions", {
        // $touch(subscriber: Subscriber<T>): void {
        //     //this._started = true
        //     subscriber.$publish(this.$value, undefined, EMPTY)
        // }
        // $untouch () {
        //     // TODO проверки при отсоединении
        // }
        get: function () {
            return this._subscriptions;
        },
        enumerable: false,
        configurable: true
    });
    return PubSub;
}(bus_1.EventNode));
exports.PubSub = PubSub;
//# sourceMappingURL=pubsub.js.map