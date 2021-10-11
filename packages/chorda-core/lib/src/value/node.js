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
exports.Node = exports.spyGetters = exports.IsCheck = exports.HasCheck = exports.UpdateDirection = void 0;
var utils_1 = require("./utils");
var engine_1 = require("./engine");
var pubsub_1 = require("./pubsub");
var UpdateDirection;
(function (UpdateDirection) {
    UpdateDirection[UpdateDirection["ASC"] = 0] = "ASC";
    UpdateDirection[UpdateDirection["DESC"] = 1] = "DESC";
    UpdateDirection[UpdateDirection["BOTH"] = 2] = "BOTH";
})(UpdateDirection = exports.UpdateDirection || (exports.UpdateDirection = {}));
var HasCheck;
(function (HasCheck) {
    HasCheck[HasCheck["PROPERTY"] = 0] = "PROPERTY";
    HasCheck[HasCheck["METHOD"] = 1] = "METHOD";
})(HasCheck = exports.HasCheck || (exports.HasCheck = {}));
var IsCheck;
(function (IsCheck) {
    IsCheck[IsCheck["ARRAY"] = 0] = "ARRAY";
})(IsCheck = exports.IsCheck || (exports.IsCheck = {}));
// Spies
var _SpyGetters = null;
// let _SpySubscriptions : Subscription[] = null
// export const spySubscriptions = (fn: Function) : Subscription[] => {
//     const prevSub = _SpySubscriptions
//     _SpySubscriptions = []
//     fn()
//     const result = _SpySubscriptions
//     _SpySubscriptions = prevSub
//     return result
// }
var spyGetters = function (fn) {
    var prevGetters = _SpyGetters;
    _SpyGetters = [];
    fn();
    var result = _SpyGetters;
    _SpyGetters = prevGetters;
    return result;
};
exports.spyGetters = spyGetters;
// const transactionAware = (fn: Function) => {
//     if (_Session) {
//         debugger
//     }
//     _Session = {
//         nodes: new Set(),
//         head: this,
//         deleted: [],
//         updated: []
//     }
//     fn()
//     if (_Session.updated.length > 0 || _Session.deleted.length > 0) {
//         _update_engine.addSession(_Session)
//     }
//     _Session = null
// }
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node(initValue, source, key, entryUidFunc) {
        var _this = _super.call(this) || this;
        _this._memoValue = initValue;
        _this._source = source;
        _this._key = key;
        _this._subscriptions = [];
        _this._entries = {};
        _this._uidFunc = entryUidFunc || utils_1.defaultUidFunc;
        //        this._session = undefined
        _this._uid = undefined;
        _this._initialized = source == null;
        _this._destroyed = false;
        return _this;
    }
    Object.defineProperty(Node.prototype, "$key", {
        get: function () {
            return this._key;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "$source", {
        get: function () {
            return this._source;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.toString = function () {
        return String(this.$value);
    };
    Node.prototype.toJSON = function () {
        console.log('to json');
        return this.$value;
    };
    Node.prototype.valueOf = function () {
        return this.$value;
    };
    Object.defineProperty(Node.prototype, Symbol.toStringTag, {
        get: function () {
            var v = Object.prototype.toString.call(this.$value);
            return v.substring(8, v.length - 1);
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype[Symbol.toPrimitive] = function () {
        var v = this.$value;
        if (typeof v === 'object') {
            return String(v);
        }
        return v; // this.$value//[Symbol.toPrimitive]
    };
    Object.defineProperty(Node.prototype, Symbol.isConcatSpreadable, {
        get: function () {
            return Array.isArray(this.$value); //this._memoValue && this._memoValue[Symbol.isConcatSpreadable]
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "$uid", {
        get: function () {
            if (_SpyGetters) {
                _SpyGetters.push(this);
            }
            return this._uid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "$isTerminal", {
        get: function () {
            var v = this.$value;
            return (v == null || (typeof v == 'string') || (typeof v == 'number') || (typeof v == 'symbol') || (typeof v == 'boolean') || (typeof v == 'function')); // || Array.isArray(v))
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "$isPrimitive", {
        get: function () {
            var v = this.$value;
            return (v == null || (typeof v == 'string') || (typeof v == 'number') || (typeof v == 'symbol') || (typeof v == 'boolean') || (typeof v == 'function'));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "$value", {
        get: function () {
            if (_SpyGetters) {
                _SpyGetters.push(this);
            }
            if (this._destroyed) {
                console.error('Value in destroyed state', this);
                return undefined;
                //            debugger
            }
            if (!this._initialized) {
                this._memoValue = this.$get();
                // if (this._memoValue && typeof this._memoValue.$at === 'function') {
                //     this._memoValue = this._memoValue.$value
                // }
                this._initialized = true;
            }
            if (this._memoValue && typeof this._memoValue.$at === 'function') {
                debugger;
            }
            return this._memoValue;
        },
        set: function (newValue) {
            if (this._destroyed) {
                console.error('Value drop destroyed state', this);
                this._destroyed = false;
            }
            // если новое значение является наблюдаемым, то берем только его значение
            // сейчас эта проверка дублирует аналогичную в publish
            if (newValue && typeof newValue.$at === 'function') {
                newValue = newValue.$value;
            }
            if (this.$isPrimitive && newValue === this._memoValue) {
                //            console.log('No change detected', newValue, this._memoValue)
                return;
            }
            //        transactionAware(() => {
            this.$publish(newValue, this._memoValue, utils_1.EMPTY);
            //        })
            // // обновляем дерево значений
            // if (_Session) {
            //     debugger
            // }
            // _Session = {
            //     nodes: new Set(),
            //     head: this,
            //     deleted: [],
            //     updated: []
            // }
            // // const prevSession = _Session
            // // _Session = null
            //  // _Session = prevSession
            // _update_engine.addSession(_Session)
            // _Session = null
            engine_1.commitEngine().commit();
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
    Node.prototype.$hasFunction = function (key) {
        var v = this.$value;
        return v != null && typeof v[key] == 'function';
    };
    // -----------------
    // Pub/Sub
    // -----------------
    Node.prototype.$publish = function (next, prev, keys) {
        //       console.log('publish')
        if (!this._initialized) {
            console.warn('Value is not initialized', this);
            this._initialized = true; // FIXME насколько это корректно?
        }
        // if (this._destroyed) {
        //     console.warn('Value destroyed', this)
        //     return
        // }
        var t = engine_1.openTransaction();
        //         let session = null
        //         if (!_Session) {
        //             _Session = {
        //                 nodes: new Set(),
        //                 head: this,
        //                 deleted: [],
        //                 updated: []
        //             }
        //             session = _Session
        // //            console.log('Session start', this)
        //         }
        //         else {
        //             if (this._source == null) {
        // //                console.log('Root node detected', next, this)
        //             }    
        //         }
        //         if (_Session.nodes.has(this)) {
        // //            console.log('Already in session', this)
        //             return
        //         }
        if (next != null) {
            if (typeof next.$update === 'function') {
                next = next.$value;
            }
            //            this._updateEntries(next)
        }
        this.$update(UpdateDirection.BOTH, next, null, utils_1.EMPTY);
        engine_1.closeTransaction(t);
        //         if (session) {
        //             _Session = null
        //             _update_engine.addSession(session)
        //             // session.deferred.forEach(node => {
        //             //     node._subscriptions.forEach(sub => sub.subscriber.$publish(node._memoValue, prev, EMPTY))
        //             // })
        // //            console.log(_Session.deleted)
        // //            session.deleted.forEach(node => node.$destroy())
        // //            console.log('Session end', this)
        //         }
    };
    Node.prototype.$touch = function (subscriber) {
        //this._started = true
        subscriber.$publish(this.$value, undefined, utils_1.EMPTY);
    };
    Node.prototype.$untouch = function () {
        // TODO проверки при отсоединении
    };
    // ----------------
    // Node
    // ----------------
    // abstract $at <I=T[K]>(key: K, factory?: Function): ValueSet<I>
    Node.prototype.$update = function (direction, value, key, keyInfo) {
        var _a;
        if (this._destroyed) {
            console.error('Value destroyed and should not be updated', this);
            return;
        }
        // if (this._key == 'filter') {
        //     console.log('update filter', value)
        // }
        //        console.log('update', this._key, this._memoValue, this._entries)
        // else {
        //     if (_Session.nodes.has(this)) {
        //         return
        //     }
        // }
        //        _Session.nodes.add(this)
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
            this._updateEntries(value);
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
        var t = engine_1.currentTransaction();
        if (t) {
            t.updated.push({
                node: this,
                next: this._memoValue,
                prev: prev
            });
        }
        //        console.log('notify', this._key, this._memoValue)
    };
    // ----------------
    // internal
    // ----------------
    Node.prototype._updateEntries = function (newValue) {
        var _this = this;
        var nextEntries = {};
        var reuseMap = {};
        if (Array.isArray(newValue)) {
            for (var k in this._entries) {
                var uid = this._entries[k].$uid;
                if (uid == undefined) {
                    uid = this._uidFunc(this._entries[k].$value);
                    if (uid === undefined) {
                        uid = String(k);
                    }
                }
                reuseMap[uid] = this._entries[k];
            }
            //            Object.assign(reuseMap, this._entries)
            //            const uidFunc = this._uidFunc || defaultUidFunc
            // prevMap составляем только на основе индексированных значений, чтобы значения свойтв (length)
            // не перекрывали ключи
            // newValue.forEach((v, k) => {
            //     if (k in this._entries) {
            //         let uid = this._entries[k].$uid// (this._entries[k] as Axle<any>)._uid// uidFunc(this._entries[k].$value) //(this._entries[k] as Value<any>).$uid
            //         if (uid === undefined) {
            //             uid = this._uidFunc(this._entries[k].$value)
            //             if (uid === undefined) {
            //                 uid = String(k)
            //             }
            //         }
            //         reuseMap[uid] = this._entries[k]
            //     }
            // })
            // for (let k in this._entries) {
            //     let uid = this._entries[k].$uid// (this._entries[k] as Axle<any>)._uid// uidFunc(this._entries[k].$value) //(this._entries[k] as Value<any>).$uid
            //     if (uid === undefined) {
            //         uid = this._uidFunc(this._entries[k].$value)
            //         if (uid === undefined) {
            //             uid = k
            //         }
            //     }
            //     prevMap[uid] = this._entries[k]
            // }
            //            console.log(this._key, Object.keys(reuseMap))
            //            const nextMap: {[key: string]: any} = {}
            newValue.forEach(function (v, i) {
                var uid = _this._uidFunc(v);
                if (uid === undefined) {
                    uid = String(i);
                }
                var entry = reuseMap[uid];
                if (entry) {
                    //                    console.log('reuse entry', [entry._key, entry._uid], [i, uid])
                    nextEntries[i] = entry;
                    entry._key = String(i);
                    entry._uid = uid;
                    entry._memoValue = v;
                    delete reuseMap[uid];
                }
                else {
                }
                //                nextMap[uid] = v
            });
            //            console.log('rest reuse map', this._key, reuseMap)
            //            console.log(this._key, nextEntries)
        }
        else if (newValue && newValue.constructor === Object) {
            Object.assign(reuseMap, this._entries);
            for (var k in newValue) {
                // const v = newValue[k]
                // const uid = k//uidFunc(v)
                var entry = this._entries[k]; // prevMap[uid]
                if (entry) {
                    nextEntries[k] = entry;
                    entry._key = k;
                    entry._uid = k;
                    delete reuseMap[k];
                    // ?
                    if (entry._destroyed) {
                        console.log('Entry restored', entry);
                        entry._subscriptions.length > 0 && console.error('Restored entry has subscriptions', entry);
                        entry._destroyed = false;
                    }
                }
                else {
                }
            }
        }
        // else {
        //     Object.assign(prevMap, this._entries)
        // }
        this._entries = nextEntries;
        for (var i in reuseMap) {
            var removed = reuseMap[i];
            // замененные элементы
            if (i in nextEntries) {
                console.log('replaced', reuseMap[i]);
            }
            else {
                if (i != removed._key) {
                    console.warn('removed and changed key', i, removed._key, removed.$uid); //, removed)
                    //console.log(prevMap)
                }
                if (removed._subscriptions.length > 0) {
                    if (this._entries[String(removed._key)]) {
                        debugger;
                    }
                    else {
                        this._entries[String(removed._key)] = removed;
                    }
                    //                    removed._destroyed = true
                    continue;
                }
                console.log('removed', removed._key, removed._memoValue);
            }
            var t = engine_1.currentTransaction();
            if (t) {
                t.deleted.push(reuseMap[i]);
            }
            //            if (!(i in nextEntries)) {
            // этот элемент идет на удаление
            //                console.log('delete', i)
            //                if (!_Sess)
            //                prevMap[i]._destroy()
            //            }
        }
    };
    // _createEntry (value: T, key: ValueKey) : Node<T> {
    //     return null// new Node(value, this, key)
    // }
    Node.prototype.$get = function () {
        if (this._initialized) {
            return this._memoValue;
        }
        var v = this._source.$get();
        return v == null ? v : v[this._key];
        //        return this._initialized ? this._memoValue : (this._source.$get() as any)[this._key]
    };
    Node.prototype.$destroy = function () {
        console.log('destroy', this._key, this._memoValue, this._subscriptions.length);
        this._destroyed = true;
        for (var i in this._entries) {
            //            console.log('destroy', i)
            this._entries[i].$destroy();
        }
        this._memoValue = undefined;
        // ?
        // this._subscriptions.forEach(sub => {
        //     sub.subscriber.$publish(undefined, this._memoValue, EMPTY)
        // })
        // this._subscriptions = []
        // this._entries = null
        // this._source = null
        //        console.log('deleted', this._key)
        // FIXME здесь нужно каскадное обновление
        //        this.$update(UpdateDirection.DESC, undefined, this._memoValue, EMPTY)
        //        this._subscriptions.forEach(sub => sub.subscriber.$publish(undefined, this._memoValue, EMPTY))
    };
    return Node;
}(pubsub_1.PubSub));
exports.Node = Node;
//# sourceMappingURL=node.js.map