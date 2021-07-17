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
exports.Gear = exports.defaultGearSort = exports.defaultPatchRules = exports.defaultInitRules = exports.defaultGearFactory = void 0;
var mix_1 = require("./mix");
var Hub_1 = require("./Hub");
var rules_1 = require("./rules");
var value_1 = require("./value");
var reconcile_1 = require("./reconcile");
var defaultGearFactory = function (opts, scope, rules) {
    return new Gear(opts, scope);
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
var Gear = /** @class */ (function (_super) {
    __extends(Gear, _super);
    function Gear(options, scope) {
        var _this = _super.call(this, options, scope) || this;
        _this.components = {};
        _this.items = [];
        return _this;
    }
    Gear.prototype.patch = function (optPatch) {
        _super.prototype.patch.call(this, optPatch);
        var o = this.options;
        if (optPatch.templates != null) {
            if (o.components && o.components !== true) {
                // пересоздаем компоненты
                for (var k in optPatch.templates) {
                    // if (this.components[k]) {
                    //     this.updateComponent(k, o.components[k] as B)
                    // }
                    if (o.components[k] === undefined) {
                        this.addKeyed(k, {});
                    }
                }
            }
            else if (o.components == null) {
                // создаем компоненты по умолчанию
                for (var k in optPatch.templates) {
                    this.addKeyed(k, {});
                }
            }
        }
        if (optPatch.components != null) {
            if (o.components === true) {
                for (var k in o.templates) {
                    this.addKeyed(k, {});
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
        if (this.components[key]) {
            console.error('Component already exists', key);
        }
        if (blueprint == null) {
            return;
        }
        if (mix_1.isMixed(blueprint)) {
            console.error('Component should not be of mixed type');
            var last = mix_1.lastEffectiveValue(blueprint);
            if (last === false || last == null) {
                return;
            }
        }
        var _a = this.options, defaultComponent = _a.defaultComponent, templates = _a.templates, componentFactory = _a.componentFactory;
        var template = templates ? templates[key] : undefined;
        //        const templates = this.parent.options.templates
        var compOpts = mix_1.mix(defaultComponent, template, blueprint).build(this.initRules());
        if (compOpts) {
            var comp = (componentFactory || this.scope.$defaultFactory)(compOpts, scope || this.scope);
            comp.key = key;
            comp.parent = this;
            this.components[key] = comp;
            return comp;
        }
    };
    Gear.prototype.removeKeyed = function (key) {
        delete this.components[key];
    };
    Gear.prototype.updateKeyed = function (key, blueprint) {
        this.components[key].destroy();
        this.addKeyed(key, blueprint);
    };
    Gear.prototype.syncKeyed = function (next) {
        var _a;
        if (value_1.isValueIterator(next)) {
            var it = next;
            var key = it.$name;
            var components = __assign({}, this.components);
            var componentsToUpdate = {};
            var componentsToAdd = {};
            var result = it.next();
            while (!result.done) {
                var k = result.value.$uid;
                if (k in components) {
                    componentsToUpdate[k] = components[k];
                }
                else {
                    componentsToAdd[k] = result.value;
                }
                delete components[k];
                result = it.next();
            }
            for (var k in componentsToAdd) {
                // FIXME не бьются типы скоупа и нового элемента
                this.addKeyed(k, {}, __assign(__assign({}, this.scope), (_a = {}, _a[key] = componentsToAdd[k], _a)));
            }
            for (var k in components) {
                this.removeKeyed(k);
            }
            for (var k in componentsToUpdate) {
                console.warn('Component update not yet ready');
                // TODO
            }
        }
        else {
            // свойство аддитивности позволяет обновлять элементы поотдельности
            for (var k in next) {
                var nextComp = next[k].build(this.initRules());
                var comp = this.components[k];
                if (nextComp === false) {
                    if (comp) {
                        comp.destroy();
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
    };
    //-----------------------
    // Indexed
    //-----------------------
    Gear.prototype.addIndexed = function (blueprint, idx, scope) {
        if (blueprint == null) {
            return;
        }
        if (mix_1.isMixed(blueprint)) {
            console.error('Item should not be of mixed type');
            var last = mix_1.lastEffectiveValue(blueprint);
            if (last === false || last == null) {
                return;
            }
        }
        else if (blueprint.addIndexed) {
            //            console.log('gear')
            // FIXME
            this.items.push(blueprint);
            return blueprint;
        }
        var _a = this.options, defaultItem = _a.defaultItem, itemFactory = _a.itemFactory;
        //const template = templates ? templates[templateKey] : undefined
        var itemOpts = mix_1.mix(defaultItem /*, template*/, blueprint).build(this.initRules());
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
            var item = (itemFactory || this.scope.$defaultFactory)(itemOpts, scope || this.scope);
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
    };
    Gear.prototype.syncIndexed = function (next) {
        var _this = this;
        var _a, _b;
        if (value_1.isValueIterator(next)) {
            var it = next;
            var key_1 = it.$name;
            var prevItems_1 = [];
            this.items.forEach(function (item) {
                prevItems_1.push({
                    key: String(item.uid),
                    value: item
                });
            });
            var nextItems = [];
            var result = it.next();
            while (!result.done) {
                nextItems.push({
                    key: result.value.$uid,
                    value: result.value
                });
                result = it.next();
            }
            //            console.log('next items', nextItems)
            var mergedItems = reconcile_1.reconcile(prevItems_1, nextItems);
            //            console.log('merged items', this.key, mergedItems)
            var children_1 = [];
            var i_1 = 0;
            mergedItems.forEach(function (itm) {
                var _a;
                var item = null;
                if (itm.op == reconcile_1.ItemOp.ADD) {
                    var v = itm.value;
                    item = _this.addIndexed({}, i_1, __assign(__assign({}, _this.scope), (_a = {}, _a[key_1] = v, _a)));
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
            console.log(next);
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
            deferred && deferred();
        });
    };
    Object.defineProperty(Gear.prototype, "children", {
        get: function () {
            var children = [].concat(this.items).concat(Object.values(this.components));
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
