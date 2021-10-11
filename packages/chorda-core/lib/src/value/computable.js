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
exports.computable = void 0;
var engine_1 = require("./engine");
var node_1 = require("./node");
var observable_1 = require("./observable");
var utils_1 = require("./utils");
var ComputableNode = /** @class */ (function (_super) {
    __extends(ComputableNode, _super);
    function ComputableNode(computor, initValue, entryUidFunc) {
        var _this = _super.call(this, initValue, undefined, undefined, entryUidFunc) || this;
        _this._computor = computor;
        _this._initialized = false; // отменяем инициализацию
        _this._sources = new Set();
        return _this;
        //this._publishers = []
        //this._touched = false
    }
    ComputableNode.prototype.$compute = function () {
        var _this = this;
        if (this._computing) {
            return this._memoValue;
        }
        this._computing = true;
        var next = undefined;
        // this._publishers.forEach(dep => {
        //     if ((dep.observable as any)._destroyed) {
        //         console.warn('Destroyed dependency detected', dep)
        //         this._destroyed = true
        //     }
        // })
        // if (this._destroyed) {
        //     this._publishers.forEach(dep => {
        //     })
        //     return undefined
        // }
        // this._publishers = []
        //         this._sources.forEach(dep => {
        //             if ((dep as any)._destroyed) {
        //                 // TODO поместить в очередь на удаление
        //                 this._destroyed = true
        //             }
        //         })
        //         if (this._destroyed) {
        //             this._sources.forEach(dep => {
        //                 dep.$unsubscribe(this)
        //             })
        //             this._sources.clear()
        // //            this._destroyed = false
        //             return
        //         }
        var getters = node_1.spyGetters(function () {
            next = observable_1.autoTerminalAware(_this._computor);
        });
        this._computing = false;
        // getters.forEach(dep => {
        //     if ((dep as any)._destroyed) {
        //         console.warn('Destroyed dependency detected', dep)
        //         this._destroyed = true
        //     }
        // })
        // if (!this._destroyed) {
        getters.forEach(function (dep) {
            // автоподписка
            dep.$subscribe(_this);
            _this._sources.add(dep);
        });
        // }
        if (observable_1.isValueSet(next)) {
            next = next.$value;
        }
        return next;
    };
    // $touch(subscriber: Subscriber<T>): void {
    //     let value = undefined
    //     if (!this._touched) {
    //         value = this.$compute()
    //         this._touched = true
    //     }
    //     subscriber.$publish(value, undefined, EMPTY)       
    // }
    ComputableNode.prototype.$publish = function (next, prev, keys) {
        //        console.log('publish computable', next)
        var _this = this;
        if (this._destroyed) {
            console.warn('Publishing to destroyed computable');
            return;
        }
        var computed = undefined;
        try {
            computed = this.$compute();
        }
        catch (err) {
            console.error('Compute error', err);
        }
        if (computed && typeof computed.$at === 'function') {
            computed = computed.$value;
        }
        if (this.$isPrimitive && computed === this._memoValue) {
            //            console.log('No change detected', computed, this._memoValue)
            return;
        }
        var t = engine_1.openTransaction();
        _super.prototype.$publish.call(this, computed, null, utils_1.EMPTY);
        var count = 0;
        engine_1.transactionUpdates(t).forEach(function (upd) {
            // FIXME
            count += upd.node.$subscriptions.length;
        });
        if (count == 0) {
            //            debugger
            this._sources.forEach(function (dep) {
                dep.$unsubscribe(_this);
            });
            this._sources.clear();
            this._initialized = false;
            //            this._destroyed = true
            //            console.log('unsubscribed computable detected [publish]')
        }
        engine_1.closeTransaction(t);
        // this._updateEntries(computed)
        // // у вычисляемых значений нет родителя/источника, поэтому обновляем поддерево только вниз
        // this.$update(UpdateDirection.DESC, computed, null, EMPTY)    
    };
    ComputableNode.prototype.$unsubscribe = function (subscription) {
        var _this = this;
        _super.prototype.$unsubscribe.call(this, subscription);
        // быстрая проверка на отписку
        if (this._subscriptions.length == 0 && Object.keys(this._entries).length == 0) {
            this._sources.forEach(function (dep) {
                dep.$unsubscribe(_this);
            });
            this._sources.clear();
            this._initialized = false;
            //            this._destroyed = true
            //            console.log('unsubscribed computable detected [unsubscribe]')
        }
    };
    ComputableNode.prototype.$get = function () {
        //        console.log('compute')
        return this._initialized ? this._memoValue : this.$compute();
    };
    return ComputableNode;
}(observable_1.ObservableNode));
//const _computeQue: ComputableNode<any>[] = []
var computable = function (compute, initValue, entryUidFunc) {
    var c = observable_1.proxify(null, new ComputableNode(compute, initValue, entryUidFunc));
    // TODO переделать в compute engine?
    // if (_computeQue.length == 0) {
    //     setTimeout(() => {
    //         while(_computeQue.length) {
    //             _computeQue.shift().$publish(null)
    //         }
    //     })    
    // }
    // _computeQue.push(c)
    return c;
};
exports.computable = computable;
//# sourceMappingURL=computable.js.map