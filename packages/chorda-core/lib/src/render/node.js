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
exports.DomNode = void 0;
var value_1 = require("../value");
var pubsub_1 = require("../value/pubsub");
//export type DomEvents = GlobalEventHandlersEventMap
// const DOM_EVENTS: Keyed<boolean> = {
//     click: true,
//     change: true,
//     input: true,
//     focus: true,
//     blur: true
// }
var DomNode = /** @class */ (function (_super) {
    __extends(DomNode, _super);
    function DomNode(renderer) {
        var _this = _super.call(this, renderer.events) || this;
        //        this._subscriptions = []
        _this._effects = [];
        return _this;
    }
    Object.defineProperty(DomNode.prototype, "$eventHandlers", {
        // get $ref () {
        //     return this._ref
        // }
        get: function () {
            var _this = this;
            var result = {};
            this._handlers.forEach(function (h) {
                result[h.name] = function (e) {
                    _this.$emit(h.name, e);
                };
            });
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomNode.prototype, "$isSubscribed", {
        get: function () {
            return this._subscriptions.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomNode.prototype, "$value", {
        get: function () {
            return this._el;
        },
        enumerable: false,
        configurable: true
    });
    // set $value
    // get $uid() : string {
    //     return null
    // }
    // get $isTerminal() : boolean {
    //     return true
    // }
    // $subscribe(subscriber: Subscriber<T>|PublishFunc<T>): Subscription {
    //     // проверяем, что такая подписка уже есть
    //     for (let sub of this._subscriptions) {
    //         if (sub.subscriber == subscriber || sub.subscriber.$publish == subscriber) {
    //             return sub
    //         }
    //     }    
    //     if (typeof subscriber === 'function') {
    //         subscriber = {
    //             $publish: subscriber
    //         }
    //     }
    //     const sub: Subscription = {
    //         subscriber,
    //         observable: this
    //     }
    //     this._subscriptions.push(sub)
    //     return sub
    // }
    // $unsubscribe(subscription: Subscription|Subscriber<T>|PublishFunc<T>): void {
    //     this._subscriptions = this._subscriptions.filter(sub => sub != subscription && sub.subscriber != subscription && sub.subscriber.$publish != subscription)
    // }
    DomNode.prototype.$publish = function (next, prev, keys) {
        this._el = next;
        this._subscriptions.forEach(function (sub) { return sub.subscriber.$publish(next); });
    };
    DomNode.prototype.$touch = function (subscriber) {
        //        console.log('dom value', this._el)
        subscriber.$publish(this._el, undefined, value_1.EMPTY);
        // if (this._el) {
        //     console.log('dom value already initialized')
        // }
        //        throw new Error("Method not implemented.");
    };
    DomNode.prototype.$untouch = function () {
    };
    return DomNode;
}(pubsub_1.PubSub));
exports.DomNode = DomNode;
//# sourceMappingURL=node.js.map