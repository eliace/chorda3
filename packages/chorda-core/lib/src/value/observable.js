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
exports.proxify = exports.__isValue = exports.__isProxy = exports.isValueIterator = exports.isValueSet = exports.isObservable = exports.reactive = exports.observable = exports.ObservableNode = exports.isAutoTerminal = exports.noAutoTerminal = exports.autoTerminalAware = void 0;
var node_1 = require("./node");
var _AutoTerminal = false;
var autoTerminalAware = function (fn) {
    var prevAutoTermial = _AutoTerminal;
    _AutoTerminal = true;
    try {
        var result = fn();
        return result;
    }
    finally {
        _AutoTerminal = prevAutoTermial;
    }
};
exports.autoTerminalAware = autoTerminalAware;
var noAutoTerminal = function (fn) {
    var prevAutoTermial = _AutoTerminal;
    _AutoTerminal = false;
    try {
        var result = fn();
        return result;
    }
    finally {
        _AutoTerminal = prevAutoTermial;
    }
};
exports.noAutoTerminal = noAutoTerminal;
var isAutoTerminal = function () { return _AutoTerminal; };
exports.isAutoTerminal = isAutoTerminal;
var ObservableNode = /** @class */ (function (_super) {
    __extends(ObservableNode, _super);
    function ObservableNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObservableNode.prototype.$at = function (k, creator) {
        var entry = this._entries[String(k)];
        if (!entry) {
            var value = this._memoValue ? this._memoValue[k] : null;
            // if (value && typeof value.$at === 'function') {
            //     value = value.$value
            // }
            entry = creator ? creator(this, k) : this._createEntry(value, k);
            // FIXME
            entry._uid = this._uidFunc(value);
            //            entry = proxify(entry.$value, entry)
            this._entries[String(k)] = entry;
        }
        return entry; // FIXME
    };
    ObservableNode.prototype.$has = function (key, check) {
        var v = this.$value;
        if (v != null && v[key] != null) {
            if (check == node_1.HasCheck.METHOD) {
                return typeof v[key] === 'function';
            }
            return true;
        }
        return false;
    };
    ObservableNode.prototype.$is = function (check) {
        if (check == node_1.IsCheck.ARRAY && Array.isArray(this._memoValue)) {
            return true;
        }
        return false;
    };
    ObservableNode.prototype.$ownKeys = function () {
        var v = this.$value;
        return typeof v == 'object' ? Reflect.ownKeys(v) : [];
    };
    ObservableNode.prototype.$getOwnPropertyDescriptor = function (name) {
        var v = this.$value;
        return (typeof v == 'object') ? Reflect.getOwnPropertyDescriptor(v, name) : undefined;
    };
    ObservableNode.prototype._createEntry = function (value, key) {
        return exports.proxify(value, new ObservableNode(value, this, key));
    };
    return ObservableNode;
}(node_1.Node));
exports.ObservableNode = ObservableNode;
var observable = function (initValue, uidFunc) {
    var value = exports.isValueSet(initValue) ? initValue.$value : initValue;
    return exports.proxify(value, new ObservableNode(value, null, null, uidFunc));
};
exports.observable = observable;
var reactive = function (initValue, uidFunc) {
    var value = exports.isValueSet(initValue) ? initValue.$value : initValue;
    return exports.proxify(value, new ObservableNode(value, null, null, uidFunc));
};
exports.reactive = reactive;
// export const iterable = <T>(initValue: ObservableValueSet<T>|T, uidFunc: UidFunc) : ObservableValueSet<T>&T => {
//     return observable(initValue, uidFunc)
// }
var isObservable = function (v) {
    return v != null && typeof v.$subscribe === 'function';
    // if (v != null) {
    //     if (v[__isProxy]) {
    //         return '$subscribe' in v
    //     }
    //     else {
    //         return v.$subscribe != null
    //     }
    // }
    // return false
    //    return v != null && (v as Observable<any>).$subscribe != undefined
};
exports.isObservable = isObservable;
var isValueSet = function (v) {
    return v != null && typeof v.$at === 'function';
    // if (v != null) {
    //     if (v[__isProxy]) {
    //         return '$at' in v
    //     }
    //     else {
    //         return v.$at != null
    //     }
    // }
    return false;
};
exports.isValueSet = isValueSet;
var isValueIterator = function (v) {
    if (v != null) {
        if (v[exports.__isProxy]) {
            return 'next' in v;
        }
        else {
            return v.next != null;
        }
    }
    return false;
};
exports.isValueIterator = isValueIterator;
// const ownProps: Set<string|number|symbol> = new Set(['$key', '$value', '$uid', '$source'])
// console.log(Object.getOwnPropertyNames(new ProxyObservableNode()))
exports.__isProxy = Symbol('__isProxy');
exports.__isValue = Symbol('__isValue');
var proxify = function (obj, node) {
    var proxy = new Proxy(node, {
        get: function (target, name) {
            // if (name == __isProxy) {
            //     return true
            // }
            if (name == '_raw') {
                debugger;
            }
            //            console.log(name, name in target)
            // собственные свойства
            if (name in target) {
                var v = target[name];
                if (v && typeof v === 'function') {
                    return v.bind(target);
                }
                return v;
            }
            //             if (target.$is(IsCheck.ARRAY)) {
            // //                console.log('array', target.$value, name)
            //                 return (target.$value as any)[name]
            //             }
            if (target.$is(node_1.IsCheck.ARRAY)) {
                if (name == 'splice') {
                    var v_1 = target.$value;
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        //                        debugger
                        var out = v_1[name].apply(v_1, args);
                        target.$value = v_1;
                        return out;
                    };
                }
            }
            if (target.$has(name, node_1.HasCheck.METHOD)) {
                var v = target.$value;
                return v[name].bind(v); //proxy)
            }
            // if (!target.$has(name)) {
            //     return undefined
            // }
            var entry = target.$at(name);
            if (_AutoTerminal && entry.$isTerminal) {
                //                console.log('terminal', name, target)
                return entry.$value;
            }
            //            console.log('ENTRY')
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
        },
        ownKeys: function (target) {
            //            console.log('KEYS')
            //            const v = target.$value
            // if (v == null) {
            //     return []
            // }
            return target.$ownKeys(); //.concat(Object.keys(target))
        },
        has: function (target, name) {
            //            const v = target.$value
            //            console.log('HAS', v, name)
            // if (v == null) {
            //     return false
            // }
            // if (typeof v === 'number') {
            //     return name in Number.prototype
            // }
            // if (typeof v === 'boolean') {
            //     return name in Boolean.prototype
            // }
            return Reflect.has(target, name) || target.$has(name); // Reflect.has(v as any, name)
            //return target.$value != null && (name in target.$value)
            //return true
        },
        getOwnPropertyDescriptor: function (target, name) {
            //            console.log(name, target)
            // if (target.$value == null) {
            //     return {}
            // }
            var pd = Reflect.getOwnPropertyDescriptor(target, name) || target.$getOwnPropertyDescriptor(name); // Reflect.getOwnPropertyDescriptor(target.$value as any, name)
            pd.configurable = true;
            return pd;
        },
        apply: function (target, thisArg, args) {
            return target.$call(thisArg, args);
            // const f = (target.$value as any)
            // f.$emit('before', args)
            // return (target.$value as any).apply(thisArg, args)
        }
        // getPrototypeOf: (target) : object => {
        //     console.log('get prototype of')
        //     return Reflect.getPrototypeOf(target.$value as any)
        //     // console.log('prototype of')
        //     // if (typeof target.$value === 'number') {
        //     //     return Number.prototype
        //     // }
        //     // return Object.getPrototypeOf(target.$value)
        // }
    });
    return proxy;
};
exports.proxify = proxify;
//# sourceMappingURL=observable.js.map