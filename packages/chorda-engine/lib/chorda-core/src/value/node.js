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
exports.ObservableNode = exports.spyGetters = exports.spySubscriptions = exports.EMPTY = exports.UpdateDirection = void 0;
var utils_1 = require("./utils");
var bus_1 = require("./bus");
var UpdateDirection;
(function (UpdateDirection) {
    UpdateDirection[UpdateDirection["ASC"] = 0] = "ASC";
    UpdateDirection[UpdateDirection["DESC"] = 1] = "DESC";
    UpdateDirection[UpdateDirection["BOTH"] = 2] = "BOTH";
})(UpdateDirection = exports.UpdateDirection || (exports.UpdateDirection = {}));
exports.EMPTY = Object.seal({});
// Spies
var _SpyGetters = null;
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
var spyGetters = function (fn) {
    var prevGetters = _SpyGetters;
    _SpyGetters = [];
    fn();
    var result = _SpyGetters;
    _SpyGetters = prevGetters;
    return result;
};
exports.spyGetters = spyGetters;
var _Session = null;
var ObservableNode = /** @class */ (function (_super) {
    __extends(ObservableNode, _super);
    function ObservableNode(initValue, source, key, entryUidFunc) {
        var _this = _super.call(this) || this;
        _this._memoValue = initValue;
        _this._source = source;
        _this._key = key;
        _this._subscriptions = [];
        _this._entries = {};
        _this._uidFunc = entryUidFunc || utils_1.defaultUidFunc;
        _this._session = undefined;
        _this._uid = undefined;
        return _this;
    }
    Object.defineProperty(ObservableNode.prototype, "$key", {
        get: function () {
            return this._key;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservableNode.prototype, "$source", {
        get: function () {
            return this._source;
        },
        enumerable: false,
        configurable: true
    });
    ObservableNode.prototype.toString = function () {
        return String(this.$value);
    };
    ObservableNode.prototype.valueOf = function () {
        return this.$value;
    };
    ObservableNode.prototype[Symbol.toPrimitive] = function () {
        return this.$value;
    };
    Object.defineProperty(ObservableNode.prototype, "$uid", {
        get: function () {
            return this._uid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservableNode.prototype, "$isTerminal", {
        get: function () {
            var v = this._memoValue;
            return (v == null || (typeof v == 'string') || (typeof v == 'number') || (typeof v == 'symbol') || (typeof v == 'boolean') || (typeof v == 'function'));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservableNode.prototype, "$value", {
        get: function () {
            if (_SpyGetters) {
                _SpyGetters.push(this);
            }
            return this._memoValue;
        },
        set: function (newValue) {
            this.$publish(newValue, this._memoValue, exports.EMPTY);
            // if (newValue != null) {
            //     if ((newValue as ValueNode<any>).$at) {
            //         newValue = (newValue as Value<any>).$value
            //     }
            //     this._updateEntries(newValue)
            // }
            // this.$update(UpdateDirection.BOTH, newValue, null, EMPTY)
        },
        enumerable: false,
        configurable: true
    });
    ObservableNode.prototype.$hasFunction = function (key) {
        return this._memoValue != null && typeof this._memoValue[key] == 'function';
    };
    ObservableNode.prototype.$has = function (key) {
        var v = this._memoValue;
        return v != null && v[key] != null;
    };
    // -----------------
    // Pub/Sub
    // -----------------
    ObservableNode.prototype.$publish = function (next, prev, keys) {
        if (next != null) {
            if (next.$at) {
                next = next.$value;
            }
            this._updateEntries(next);
        }
        this.$update(UpdateDirection.BOTH, next, null, exports.EMPTY);
    };
    ObservableNode.prototype.$subscribe = function (subscriber) {
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
            target: this
        };
        this._subscriptions.push(sub);
        if (_SpySubscriptions) {
            _SpySubscriptions.push(sub);
        }
        return sub;
    };
    ObservableNode.prototype.$unsubscribe = function (subscription) {
        this._subscriptions = this._subscriptions.filter(function (sub) { return sub != subscription && sub.subscriber != subscription && sub.subscriber.$publish != subscription; });
    };
    ObservableNode.prototype.$touch = function (subscriber) {
        //this._started = true
        subscriber.$publish(this._memoValue, undefined, exports.EMPTY);
    };
    // ----------------
    // Node
    // ----------------
    ObservableNode.prototype.$at = function (k, creator) {
        var entry = this._entries[String(k)];
        if (!entry) {
            var value = this._memoValue ? this._memoValue[k] : null;
            entry = creator ? creator(this, k) : this._createEntry(value, k);
            // FIXME
            entry._uid = this._uidFunc(value);
            //            entry = proxify(entry.$value, entry)
            this._entries[String(k)] = entry;
        }
        return entry;
    };
    ObservableNode.prototype.$each = function (f) {
        for (var i in this._memoValue) {
            f(this.$at(i));
        }
    };
    ObservableNode.prototype.$update = function (direction, value, key, keyInfo) {
        var _a;
        var _this = this;
        if (!_Session) {
            _Session = {
                nodes: new Set(),
                head: this
            };
        }
        else {
            if (_Session.nodes.has(this)) {
                return;
            }
        }
        _Session.nodes.add(this);
        //        this._session = _Session
        var prev = this._memoValue;
        if (direction == UpdateDirection.ASC) {
            this._memoValue[key] = value;
        }
        else {
            this._memoValue = value;
        }
        // уведомление дочерних элементов
        if (direction == UpdateDirection.DESC || direction == UpdateDirection.BOTH) {
            for (var i in this._entries) {
                this._entries[i].$update(UpdateDirection.DESC, this._memoValue == null ? undefined : this._memoValue[i]);
            }
        }
        // уведомление родительского элемента
        if (direction == UpdateDirection.ASC || direction == UpdateDirection.BOTH) {
            if (this._source) {
                this._source.$update(UpdateDirection.ASC, this._memoValue, this._key, (_a = {}, _a[this._key] = keyInfo, _a));
            }
        }
        // публикация изменений на всех подписчиков
        this._subscriptions.forEach(function (sub) { return sub.subscriber.$publish(_this._memoValue, prev, exports.EMPTY); });
        if (_Session.head == this) {
            _Session = null;
        }
    };
    // ----------------
    // internal
    // ----------------
    ObservableNode.prototype._updateEntries = function (newValue) {
        var _this = this;
        var nextEntries = {};
        if (Array.isArray(newValue)) {
            //            const uidFunc = this._uidFunc || defaultUidFunc
            var prevMap_1 = {};
            for (var k in this._entries) {
                var uid = this._entries[k].$uid; // (this._entries[k] as Axle<any>)._uid// uidFunc(this._entries[k].$value) //(this._entries[k] as Value<any>).$uid
                if (uid === undefined) {
                    uid = this._uidFunc(this._entries[k].$value);
                    if (uid === undefined) {
                        uid = k;
                    }
                }
                prevMap_1[uid] = this._entries[k];
            }
            //            const nextMap: {[key: string]: any} = {}
            newValue.forEach(function (v, i) {
                var uid = _this._uidFunc(v);
                if (uid === undefined) {
                    uid = String(i);
                }
                var entry = prevMap_1[uid];
                if (entry) {
                    nextEntries[i] = entry;
                    entry._key = i;
                    entry._uid = uid;
                    entry._memoValue = v;
                }
                else {
                }
                //                nextMap[uid] = v
            });
        }
        else if (newValue && newValue.constructor === Object) {
            for (var k in newValue) {
                // const v = newValue[k]
                // const uid = k//uidFunc(v)
                var entry = this._entries[k]; // prevMap[uid]
                if (entry) {
                    nextEntries[k] = entry;
                    entry._key = k;
                    entry._uid = k;
                }
                else {
                }
            }
        }
        this._entries = nextEntries;
    };
    ObservableNode.prototype._createEntry = function (value, key) {
        return new ObservableNode(value, this, key);
    };
    return ObservableNode;
}(bus_1.EventNode));
exports.ObservableNode = ObservableNode;
