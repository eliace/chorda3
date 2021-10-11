"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNode = exports.spyHandlers = void 0;
var _SpyHandlers = null;
var spyHandlers = function (fn) {
    var prevHandlers = _SpyHandlers;
    _SpyHandlers = [];
    fn();
    var result = _SpyHandlers;
    _SpyHandlers = prevHandlers;
    return result;
};
exports.spyHandlers = spyHandlers;
var EventNode = /** @class */ (function () {
    function EventNode(global) {
        this._global = global;
        this._events = {};
        this._handlers = [];
    }
    EventNode.prototype.$on = function (name, callback, target) {
        var h = { name: name, callback: callback, target: target, bus: this };
        this._handlers.push(h);
        if (_SpyHandlers) {
            _SpyHandlers.push(h);
        }
        return h;
    };
    EventNode.prototype.$off = function (ctl) {
        this._handlers = this._handlers.filter(function (l) { return l != ctl && l.callback != ctl && l.target != ctl; });
    };
    EventNode.prototype.$emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        //        console.log('emit', name, args, this._handlers)
        // TODO возможно, сообщения стоит здесь только помещать в очередь
        this._handlers.forEach(function (h) {
            if (h.name == name) {
                //                console.log('call handler')
                h.callback.apply(h.target, args);
            }
        });
    };
    EventNode.prototype.$event = function (name) {
        var _this = this;
        this._events[name] = true;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.$emit.apply(_this, __spreadArray([name], args));
        };
    };
    EventNode.prototype.$hasEvent = function (name) {
        return !!this._events[name] || (this._global != null && this._global[name]);
    };
    return EventNode;
}());
exports.EventNode = EventNode;
//# sourceMappingURL=bus.js.map