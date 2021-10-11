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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gear = exports.isGear = exports.defaultGearSort = exports.defaultPatchRules = exports.defaultInitRules = exports.defaultGearFactory = void 0;
var mix_1 = require("./mix");
var Hub_1 = require("./Hub");
var rules_1 = require("./rules");
var value_1 = require("./value");
var reconcile_1 = require("./reconcile");
var defaultGearFactory = function (opts, context, scope, rules) {
    return new Gear(opts, context, scope);
};
exports.defaultGearFactory = defaultGearFactory;
exports.defaultInitRules = {
    defaultItem: rules_1.DefaultRules.Option,
    defaultComponent: rules_1.DefaultRules.Option,
    components: rules_1.DefaultRules.OptionCollection,
    templates: rules_1.DefaultRules.OptionCollection,
};
exports.defaultPatchRules = {
    defaultItem: rules_1.DefaultRules.OptionCollectionOverlap,
    defaultComponent: rules_1.DefaultRules.OptionCollectionOverlap,
    components: rules_1.DefaultRules.OptionCollectionOverlap,
    templates: rules_1.DefaultRules.OptionCollectionOverlap,
    items: rules_1.DefaultRules.Overlap,
};
function defaultGearSort(a, b) {
    var w1 = (a.options && a.options.weight) || 0;
    var w2 = (b.options && b.options.weight) || 0;
    if (w1 == w2) {
        var i1 = a.index || 0;
        var i2 = b.index || 0;
        return i1 - i2;
    }
    return w1 - w2;
}
exports.defaultGearSort = defaultGearSort;
var isGear = function (obj) {
    return obj != null && obj.addIndexed != null;
};
exports.isGear = isGear;
var Gear = /** @class */ (function (_super) {
    __extends(Gear, _super);
    function Gear(options, context, scope) {
        var _this = _super.call(this, options, context, scope) || this;
        _this.components = {};
        _this.items = [];
        return _this;
    }
    Gear.prototype.patch = function (optPatch) {
        _super.prototype.patch.call(this, optPatch);
        var o = this.options;
        // console.log(optPatch)
        // console.log(o)
        if (optPatch.templates != null) {
            if (o.components && o.components !== true) {
                // пересоздаем компоненты
                for (var k in optPatch.templates) {
                    // if (this.components[k]) {
                    //     this.updateComponent(k, o.components[k] as B)
                    // }
                    //                    console.log('template component', k, o.components[k])
                    if (o.components[k] === undefined) {
                        this.addKeyed(k, null);
                    }
                }
            }
            else if (o.components == null) {
                // создаем компоненты по умолчанию
                for (var k in optPatch.templates) {
                    this.addKeyed(k, null);
                }
            }
        }
        if (optPatch.components != null) {
            if (o.components === true) {
                for (var k in o.templates) {
                    this.addKeyed(k, null);
                }
            }
            else if (o.components === false) {
                // TODO здесь мы должны выключать все компоненты
            }
            else {
                this.syncKeyed(o.components);
            }
        }
        if (optPatch.items) {
            if (o.items === true) {
            }
            else if (o.items === false) {
            }
            else {
                this.syncIndexed(o.items);
            }
        }
    };
    Gear.prototype.initRules = function () {
        return exports.defaultInitRules;
    };
    Gear.prototype.patchRules = function () {
        return exports.defaultPatchRules;
    };
    //-----------------------
    // Keyed
    //-----------------------
    Gear.prototype.addKeyed = function (key, blueprint, scope) {
        var _a, _b;
        if (this.components[key]) {
            console.error('Component already exists', key);
        }
        // if (blueprint == null) {
        //     return
        // }
        if (mix_1.isMixed(blueprint)) {
            console.error('Component should not be of mixed type');
            var last = mix_1.lastEffectiveValue(blueprint);
            if (last === false || last == null) {
                return;
            }
        }
        else if (exports.isGear(blueprint)) {
            // FIXME
            // if (blueprint.parent) {
            //     // FIXME это надо заменить на removeChild
            //     blueprint.key ? blueprint.parent.removeKeyed(blueprint.key) : blueprint.parent.removeIndexed(blueprint.index)
            // }
            blueprint.parent = this;
            blueprint.key = key;
            this.components[key] = blueprint;
            return blueprint;
        }
        var _c = this.options, defaultComponent = _c.defaultComponent, templates = _c.templates, componentFactory = _c.componentFactory;
        var template = templates ? templates[key] : undefined;
        //        const templates = this.parent.options.templates
        var compOpts = mix_1.mixin(defaultComponent, template, blueprint).build(this.initRules());
        if (compOpts) {
            //            console.log('addKeyed', key, compOpts)
            //            console.log(scope)
            var comp = (componentFactory || this.scope.$defaultFactory)(compOpts, this.scope, scope);
            comp.key = key;
            comp.parent = this;
            this.components[key] = comp;
            (_b = (_a = this.events).afterAddKeyed) === null || _b === void 0 ? void 0 : _b.call(_a, comp, this.scope);
            return comp;
        }
    };
    Gear.prototype.removeKeyed = function (key) {
        var _a, _b;
        (_b = (_a = this.events).beforeRemoveKeyed) === null || _b === void 0 ? void 0 : _b.call(_a, key, this.scope);
        delete this.components[key];
    };
    Gear.prototype.updateKeyed = function (key, blueprint) {
        this.components[key].destroy();
        this.addKeyed(key, blueprint);
    };
    Gear.prototype.syncKeyed = function (next) {
        //        console.log('sync-keyed', this.key, next)
        var _a;
        var _b, _c;
        if (value_1.isIterable(next)) {
            var it_1 = next;
            var key = it_1.$name;
            var components_1 = __assign({}, this.components);
            var componentsToUpdate_1 = {};
            var componentsToAdd_1 = {};
            next.$each(function (result) {
                var k = result.$uid;
                if (k in components_1) {
                    componentsToUpdate_1[k] = components_1[k];
                }
                else {
                    componentsToAdd_1[k] = result;
                }
                delete components_1[k];
            });
            // let result = it.next()
            // while (!result.done) {
            //     const k = result.value.$uid
            //     if (k in components) {
            //         componentsToUpdate[k] = components[k]
            //     }
            //     else {
            //         componentsToAdd[k] = result.value
            //     }
            //     delete components[k]
            //     result = it.next()
            // }
            for (var k in componentsToAdd_1) {
                // FIXME не бьются типы скоупа и нового элемента
                this.addKeyed(k, {}, (_a = {}, _a[key] = componentsToAdd_1[k], _a));
            }
            for (var k in components_1) {
                this.removeKeyed(k);
            }
            for (var k in componentsToUpdate_1) {
                console.warn('Component update not yet ready');
                // TODO
            }
        }
        else {
            // свойство аддитивности позволяет обновлять элементы поотдельности
            for (var k in next) {
                var nextComp = next[k].build(this.initRules());
                //                console.log('Next comp', k, nextComp, next[k])
                var comp = this.components[k];
                if (nextComp === false) {
                    if (comp) {
                        if (comp.parent == this) {
                            // для собственных компонентов начинаем процедуру удаления
                            comp.destroy();
                        }
                        else {
                            // компонент-кукушку просто убираем из списка
                            this.removeKeyed(k);
                        }
                    }
                }
                else if (nextComp === true) {
                    if (!comp) {
                        this.addKeyed(k, {});
                    }
                    else if (comp.state == Hub_1.State.Destroying) {
                        console.log('stop destroying', k);
                        comp.reset();
                    }
                    else {
                        if (comp.state == Hub_1.State.Destroyed) {
                            console.warn('component already destroyed', k);
                        }
                    }
                }
                else if (nextComp != null) {
                    if (!comp) {
                        this.addKeyed(k, nextComp);
                    }
                    else {
                        // FIXME здесь мы предполагаем, что в next именно options
                        comp.reset(nextComp);
                    }
                }
                else {
                    // игнорируем пустые компоненты
                }
            }
        }
        (_c = (_b = this.events).afterSyncKeyed) === null || _c === void 0 ? void 0 : _c.call(_b, this.components, this.scope);
    };
    //-----------------------
    // Indexed
    //-----------------------
    Gear.prototype.addIndexed = function (blueprint, idx, scope) {
        if (blueprint == null) {
            return;
        }
        if (mix_1.isMixed(blueprint)) {
            //            console.error('Item should not be of mixed type')
            var last = mix_1.lastEffectiveValue(blueprint);
            if (last === false || last == null) {
                return;
            }
        }
        else if (exports.isGear(blueprint)) {
            // FIXME
            this.items.push(blueprint);
            return blueprint;
        }
        var _a = this.options, defaultItem = _a.defaultItem, itemFactory = _a.itemFactory;
        //const template = templates ? templates[templateKey] : undefined
        var itemOpts = mix_1.mixin(defaultItem /*, template*/, blueprint).build(this.initRules());
        //        console.log(itemOpts)
        if (itemOpts) {
            var index = idx;
            if (index == null) {
                index = this.items.length;
            }
            else {
                for (var i = index; i < this.items.length; i++) {
                    this.items[i].index++;
                }
            }
            var item = (itemFactory || this.scope.$defaultFactory)(itemOpts, this.scope, scope);
            item.index = index;
            item.parent = this;
            this.items.splice(index, 0, item);
            return item;
        }
    };
    Gear.prototype.updateIndexed = function (idx, blueprint) {
        // TODO
    };
    Gear.prototype.removeIndexed = function (idx) {
        this.items.splice(idx, 1);
        this.items.forEach(function (itm) {
            if (itm.index > idx) {
                itm.index--;
            }
        });
    };
    Gear.prototype.syncIndexed = function (next) {
        //        console.log('sync indexed', this.key, next)
        var _this = this;
        var _a, _b;
        if (value_1.isIterable(next)) {
            var it_2 = next;
            var key_1 = it_2.$name;
            //            console.log('iterable', key, it)
            var prevItems_1 = [];
            this.items.forEach(function (item) {
                prevItems_1.push({
                    key: String(item.uid),
                    value: item
                });
            });
            var nextItems_1 = [];
            next.$each(function (result, key) {
                nextItems_1.push({
                    key: result.$uid === undefined ? key : result.$uid,
                    value: result
                });
            });
            // let result = it.next()
            // while (!result.done) {
            //     nextItems.push({
            //         key: result.value.$uid,
            //         value: result.value
            //     })
            //     result = it.next()
            // }
            //            console.log('next items', nextItems, prevItems)
            //            console.log('reconcile')
            var mergedItems = reconcile_1.reconcile(prevItems_1, nextItems_1);
            //            console.log('reconcile end')
            //            console.log('merged items', this.key, mergedItems)
            var children_1 = [];
            var i_1 = 0;
            mergedItems.forEach(function (itm) {
                var _a;
                var item = null;
                if (itm.op == reconcile_1.ItemOp.ADD) {
                    var v = itm.value;
                    item = _this.addIndexed({}, i_1, key_1 ? (_a = {}, _a[key_1] = v, _a) : v);
                    item.uid = itm.key; // v.$uid
                    //                        console.log('add', i, itm.key)//v.$uid)
                }
                else if (itm.op == reconcile_1.ItemOp.DELETE) {
                    item = itm.value;
                    item.parent = null;
                    item.destroy();
                    item.parent = _this;
                    if (item.state == Hub_1.State.Destroyed) {
                        i_1--;
                        item = null;
                    }
                    // else {
                    //     debugger
                    // }
                    //                        console.log('del', i, itm.key)
                }
                else {
                    item = itm.value;
                    item.index = i_1;
                    //                        console.log('upd', i, itm.key, itm.value)
                }
                item && children_1.push(item);
                i_1++;
            });
            this.items = children_1;
            //            console.log(this.items)
        }
        else {
            //            console.log(next)
            if (!Array.isArray(next)) {
                console.error('Items must be array like value', next);
            }
            // у индексированных элементов нет свойства аддитивности, поэтому пересоздаем все элементы
            this.items.forEach(function (item) {
                delete item.parent;
                item.destroy();
            });
            this.items = [];
            for (var _i = 0, next_1 = next; _i < next_1.length; _i++) {
                var o = next_1[_i];
                this.addIndexed(o);
            }
        }
        (_b = (_a = this.events).afterSyncIndexed) === null || _b === void 0 ? void 0 : _b.call(_a, this.items, this.scope);
    };
    Gear.prototype.destroy = function (deferred) {
        var _this = this;
        _super.prototype.destroy.call(this, function () {
            deferred && deferred();
            if (_this.parent) {
                if (_this.key) {
                    _this.parent.removeKeyed(_this.key);
                }
                else {
                    _this.parent.removeIndexed(_this.index);
                }
            }
            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                var child = _a[_i];
                delete child.parent;
                child.destroy();
            }
            for (var k in _this.components) {
                var child = _this.components[k];
                delete child.parent;
                child.destroy();
            }
            delete _this.parent;
            delete _this.key;
            delete _this.index;
            _this.items = [];
            _this.components = {};
        });
    };
    Object.defineProperty(Gear.prototype, "children", {
        get: function () {
            var _this = this;
            var children = [].concat(this.items).concat(Object.values(this.components)).filter(function (c) { return c.parent == _this; });
            if (this.options.childFilter) {
                children = children.filter(this.options.childFilter);
            }
            return children.sort(this.options.childSorter || defaultGearSort);
        },
        enumerable: false,
        configurable: true
    });
    Gear.prototype.visit = function (visitor) {
        if (visitor(this) !== false) {
            this.children.forEach(visitor);
        }
    };
    return Gear;
}(Hub_1.Hub));
exports.Gear = Gear;
//# sourceMappingURL=Gear.js.map