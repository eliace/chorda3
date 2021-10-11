(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Chorda"] = factory();
	else
		root["Chorda"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Blueprint.ts":
/*!**************************!*\
  !*** ./src/Blueprint.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var _this = this;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.attach = exports.createHtmlContext = exports.createHtmlOptions = exports.mix = void 0;
var Html_1 = __webpack_require__(/*! ./Html */ "./src/Html.ts");
var mix_1 = __webpack_require__(/*! ./mix */ "./src/mix/index.ts");
var pipe_1 = __webpack_require__(/*! ./pipe */ "./src/pipe/index.ts");
var mix = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return mix_1.mixin.apply(_this, args);
};
exports.mix = mix;
// export const mix2 = <T, X>(a: HtmlBlueprint<T>, b?: HtmlBlueprint<X>) : Mixed<HtmlBlueprint<T&X>> => {
//     return mixin(b as any, a as any) as Mixed<HtmlBlueprint<T&X>>
// }
var createHtmlOptions = function (blueprint) {
    var b = mix_1.mixin(blueprint).build(Html_1.defaultHtmlInitRules);
    if (typeof b === 'boolean') {
        return null;
    }
    return b;
};
exports.createHtmlOptions = createHtmlOptions;
var createHtmlContext = function (patcher, renderer) {
    return {
        $defaultFactory: Html_1.defaultHtmlFactory,
        $defaultLayout: Html_1.defaultLayout,
        $engine: patcher,
        $renderer: renderer,
        $pipe: pipe_1.pipe(patcher, renderer)
    };
};
exports.createHtmlContext = createHtmlContext;
var attach = function (html, el) {
    document.addEventListener('DOMContentLoaded', function () {
        html.attach(el());
    });
};
exports.attach = attach;


/***/ }),

/***/ "./src/Gear.ts":
/*!*********************!*\
  !*** ./src/Gear.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Gear = exports.isGear = exports.defaultGearSort = exports.defaultPatchRules = exports.defaultInitRules = exports.defaultGearFactory = void 0;
var mix_1 = __webpack_require__(/*! ./mix */ "./src/mix/index.ts");
var Hub_1 = __webpack_require__(/*! ./Hub */ "./src/Hub.ts");
var rules_1 = __webpack_require__(/*! ./rules */ "./src/rules.ts");
var value_1 = __webpack_require__(/*! ./value */ "./src/value/index.ts");
var reconcile_1 = __webpack_require__(/*! ./reconcile */ "./src/reconcile.ts");
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


/***/ }),

/***/ "./src/Html.ts":
/*!*********************!*\
  !*** ./src/Html.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Html = exports.defaultLayout = exports.passthruLayout = exports.defaultRender = exports.defaultHtmlFactory = exports.defaultHtmlPatchRules = exports.defaultHtmlInitRules = void 0;
var _1 = __webpack_require__(/*! . */ "./src/index.ts");
var Gear_1 = __webpack_require__(/*! ./Gear */ "./src/Gear.ts");
var render_1 = __webpack_require__(/*! ./render */ "./src/render/index.ts");
var rules_1 = __webpack_require__(/*! ./rules */ "./src/rules.ts");
exports.defaultHtmlInitRules = __assign({ css: rules_1.DefaultRules.StringArray }, Gear_1.defaultInitRules);
exports.defaultHtmlPatchRules = __assign({ css: rules_1.DefaultRules.StringArray }, Gear_1.defaultPatchRules);
var defaultHtmlFactory = function (opts, context, scope, rules) {
    return new Html(opts, context, scope);
};
exports.defaultHtmlFactory = defaultHtmlFactory;
var defaultRender = function (html) { return (html.render) ? html.render() : html; };
exports.defaultRender = defaultRender;
var passthruLayout = function (factory, key, props, dom, children) {
    return children && children.map(exports.defaultRender);
};
exports.passthruLayout = passthruLayout;
var defaultLayout = function (factory, key, props, dom, children) {
    return factory.createVNode(key, props, dom, children && children.map(exports.defaultRender));
};
exports.defaultLayout = defaultLayout;
var Html = /** @class */ (function (_super) {
    __extends(Html, _super);
    //    ext: HtmlProps
    function Html(options, context, scope) {
        var _this = _super.call(this, options, context, scope) || this;
        _this.scope.$dom = new render_1.DomNode(_this.scope.$renderer);
        return _this;
        //        this.ext = {}
        //        this.dirty = true
    }
    Html.prototype.patch = function (optPatch) {
        _super.prototype.patch.call(this, optPatch);
        var o = this.options;
        // TODO
        var dom = this.scope.$dom;
        if (optPatch.classes) {
            dom.className = render_1.buildClassName(dom.className, o.classes);
        }
        if (optPatch.css) {
            dom.className = render_1.buildClassName(dom.className, o.css);
        }
        if (optPatch.styles) {
            dom.styles = __assign(__assign({}, dom.styles), o.styles);
        }
        if (optPatch.html) {
            dom.html = o.html;
        }
        if (optPatch.tag != null) {
            dom.tag = o.tag;
        }
        // помечаем путь до корня "грязным"
        var html = this;
        while (html && !html.dirty) {
            html.dirty = true;
            //            if (!html.parent) {
            if (html.isRoot) {
                //                debugger
                // планируем перерисовку в свой такт (после всех патчей)
                html.scope.$pipe.push(html.scope.$renderer.task(null));
                //                break
            }
            html = html.parent;
        }
        // this.visit((h) => {
        //     if (h.dirty) return false
        //     h.dirty = true
        // })
    };
    Html.prototype.initRules = function () {
        return exports.defaultHtmlInitRules;
    };
    Html.prototype.patchRules = function () {
        return exports.defaultHtmlPatchRules;
    };
    Html.prototype.attach = function (root) {
        this.scope.$renderer.attach(root, this);
        this.attached = true;
    };
    Html.prototype.detach = function () {
        this.scope.$renderer.detach(this);
        this.attached = false;
    };
    Object.defineProperty(Html.prototype, "isRoot", {
        get: function () {
            return this.parent ? (this.parent.scope.$renderer != this.scope.$renderer) : true;
        },
        enumerable: false,
        configurable: true
    });
    Html.prototype.render = function (asRoot) {
        if (this.state == _1.State.Destroyed) {
            return null;
        }
        if (!asRoot && this.isRoot) {
            return null;
        }
        if (this.options.render === false) {
            return null;
        }
        if (!this.dirty) {
            return this.vnode;
        }
        var o = this.options;
        var layout = o.layout || this.scope.$defaultLayout;
        //        const renderer: Renderer = this.scope.$renderer
        var factory = this.scope.$renderer; //.$vnodeFactory
        var dom = this.scope.$dom;
        var text = o.text;
        var children = this.children;
        var key = this.uid || this.key || this.index;
        // if (key != null) {
        //     ext.key = key
        // }
        if (text || children.length > 0) {
            var childrenAndText = children;
            if (text) {
                childrenAndText = __spreadArray([], children);
                var i = children.findIndex(function (c) { return c.options.weight && c.options.weight > 0; });
                if (i == -1) {
                    childrenAndText.push(text);
                }
                else {
                    childrenAndText.splice(i, 0, text);
                }
            }
            this.vnode = layout(factory, key, this.options.dom, dom, childrenAndText);
        }
        else {
            this.vnode = layout(factory, key, this.options.dom, dom);
        }
        //        (dom as any).$applyEffects(this.scope.$renderer)
        this.dirty = false;
        return this.vnode;
    };
    Html.prototype.destroy = function (defer) {
        var _this = this;
        _super.prototype.destroy.call(this, function () {
            if (_this.attached) {
                _this.detach();
            }
            else {
                // помечаем путь до корня "грязным"
                var html = _this;
                while (html && !html.dirty) {
                    html.dirty = true;
                    //            if (!html.parent) {
                    if (html.isRoot) {
                        if (_this.state == _1.State.Destroying) {
                            // отложенное удаление планируем в ближайший кадр, чтобы удаленный элемент как можно скорее пропал из VDOM
                            html.scope.$renderer.publish(html.scope.$renderer.task(null));
                        }
                        else {
                            // немедленное удаление синхронизируем с патчами, чтобы избежать "моргания"
                            html.scope.$engine.publish(html.scope.$renderer.task(null));
                        }
                        //                debugger
                        //                break
                    }
                    html = html.parent;
                }
            }
            defer && defer();
        });
    };
    return Html;
}(Gear_1.Gear));
exports.Html = Html;


/***/ }),

/***/ "./src/Hub.ts":
/*!********************!*\
  !*** ./src/Hub.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Hub = exports.patch = exports.State = void 0;
var value_1 = __webpack_require__(/*! ./value */ "./src/value/index.ts");
var mix_1 = __webpack_require__(/*! ./mix */ "./src/mix/index.ts");
var pipe_1 = __webpack_require__(/*! ./pipe */ "./src/pipe/index.ts");
var State;
(function (State) {
    State[State["Initializing"] = 0] = "Initializing";
    State[State["Initialized"] = 1] = "Initialized";
    State[State["Destroying"] = 2] = "Destroying";
    State[State["Destroyed"] = 3] = "Destroyed";
})(State = exports.State || (exports.State = {}));
var _PatchingHub = undefined;
var patch = function (o) {
    _PatchingHub.scope.$engine.publish(pipe_1.ownTask(_PatchingHub.patch, o, _PatchingHub));
    //_PatchingHub.scope.$pipe.push(ownTask(_PatchingHub.patch, o, _PatchingHub))
};
exports.patch = patch;
var _ScopeKey;
var scopeKeyAware = function (key, fn) {
    var prevScopeKey = _ScopeKey;
    _ScopeKey = key;
    fn();
    _ScopeKey = prevScopeKey;
};
var createMonitoredThenable = function (thenable) {
    var monitored = thenable.then(function (v) {
        mt.isDone = true;
        mt.isPending = false;
        return v;
    }, function (v) {
        mt.isFailed = true;
        mt.isPending = false;
        return v;
    });
    var mt = {
        isPending: true,
        isFailed: false,
        isDone: false,
        then: function (resolve, reject) { return monitored.then(resolve, reject); }
    };
    return mt;
};
var isMonitoredThenable = function (v) {
    return v.then != null;
};
// export const _iterator = <T extends []|{}>(source: T) : ValueIterator<T> => {
//     if (_ScopeKey == null) {
//         console.warn('Scope key not detected')
//     }
//     return iterator(source, String(_ScopeKey))
// }
// export const _next = <T extends {}|[], K extends keyof T=keyof T>(value: Value<T>) : T[K] => {
//     if (_ScopeKey == null) {
//         console.warn('Scope key not detected')
//     }
//     return value as any
// }
var Hub = /** @class */ (function () {
    //    _context: any
    // initialized: boolean
    // destroyed: boolean
    //    _Injectors: Injectors<any> = null
    function Hub(options, context, initScope) {
        var _this = this;
        if (context === void 0) { context = null; }
        if (initScope === void 0) { initScope = null; }
        this.options = {};
        //        this.context = context
        //        this.scope = Object.assign({}, context as any)
        this._local = {};
        //        this._context = {...context}
        //let _InjectProp: string|symbol = null
        var _InjectProps = {};
        var PropState;
        (function (PropState) {
            PropState[PropState["None"] = 0] = "None";
            PropState[PropState["Injector"] = 1] = "Injector";
            PropState[PropState["Initial"] = 2] = "Initial";
            PropState[PropState["Default"] = 3] = "Default";
            PropState[PropState["Context"] = 4] = "Context";
        })(PropState || (PropState = {}));
        // injector -> initial -> default -> context
        this.scope = new Proxy(this._local, {
            get: function (target, p) {
                if (p == '$context') {
                    return context;
                }
                //                console.log('get', p)
                var isInjected = false;
                var prop = _InjectProps[String(p)] || PropState.None;
                var prevPropState = _InjectProps[String(p)];
                var prevProp = target[p];
                //                if () {
                if ( /*!isInjected && this.state != State.Initializing &&*/(p in target)) {
                    isInjected = true;
                    //                        return (target[p] && isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p]
                }
                // if (this.state == State.Initializing) {
                //     isInjected = false
                //     prop = PropState.None
                //     target[p] = undefined
                // }
                // if (this.options.injections && (this.options.injections as any)['$engine']) {
                //     console.log('$engine', p, isInjected, prop)
                // }
                if (!isInjected && prop < PropState.Injector && _this.options.injections) {
                    var injector_1 = _this.options.injections[p];
                    if (injector_1 !== undefined) {
                        if (typeof injector_1 === 'function') {
                            _InjectProps[String(p)] = PropState.Injector;
                            scopeKeyAware(p, function () {
                                value_1.noAutoTerminal(function () {
                                    // const entry = injector(this.scope)
                                    // if (entry !== undefined) {
                                    //     target[p] = entry
                                    // }
                                    target[p] = injector_1(_this.scope);
                                });
                            });
                        }
                        else if (injector_1 != null) {
                            console.warn('Injector must be a function', p, injector_1);
                            return;
                        }
                        isInjected = true;
                        //                            return target[p]
                    }
                }
                //                }
                if (!isInjected && prop < PropState.Initial && initScope) {
                    //                    console.log('--- check initial ---', p)
                    var hasProp = false;
                    if (value_1.isValueSet(initScope)) {
                        hasProp = initScope.$has(p) && initScope.$at(p).$value != null;
                    }
                    else if (initScope[p] != null) {
                        hasProp = true;
                    }
                    if (hasProp) {
                        _InjectProps[String(p)] = PropState.Initial;
                        target[p] = initScope[p];
                        isInjected = true;
                    }
                }
                if (!isInjected && prop < PropState.Default && _this.options.initials) {
                    var injector_2 = _this.options.initials[p];
                    if (injector_2 !== undefined) {
                        if (typeof injector_2 === 'function') {
                            _InjectProps[String(p)] = PropState.Default;
                            scopeKeyAware(p, function () {
                                value_1.noAutoTerminal(function () {
                                    target[p] = injector_2(_this.scope);
                                });
                            });
                        }
                        else if (injector_2 != null) {
                            console.warn('Injector must be a function', p, injector_2);
                            return;
                        }
                        isInjected = true;
                        //                        return target[p]
                    }
                }
                if (!isInjected && prop < PropState.Context) {
                    _InjectProps[String(p)] = PropState.Context;
                    value_1.noAutoTerminal(function () {
                        target[p] = context[p];
                    });
                    isInjected = true;
                    // if (this.state == State.Initializing) {
                    //     isInjected = false
                    //     //_InjectProps[String(p)] = PropState.None
                    // }
                }
                if (_this.state == State.Initializing && (p == '$engine' || p == '$renderer' || p == '$pipe')) {
                    var out = (target[p] && value_1.isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p];
                    delete target[p];
                    _InjectProps[String(p)] = PropState.None;
                    isInjected = false;
                    return out;
                }
                //                return target[p]
                return (target[p] && value_1.isAutoTerminal() && target[p].$isTerminal) ? target[p].$value : target[p];
            },
            set: function (target, p, value) {
                // if (p == 'current') {
                //     debugger
                // }
                //                console.log('set scope value', p, value, p in target)
                // FIXME заменить на инжектирование
                if (!(p in target)) {
                    target[p] = _this.scope[String(p)]; // неявно инжектируем
                }
                // isObservable
                if (target[p] != null && (typeof target[p].$at === 'function')) {
                    target[p].$value = value;
                }
                else {
                    //                    console.error('Inject not an observable into scope', p, value)
                    target[p] = value;
                }
                return true;
            },
            has: function (target, p) {
                return Reflect.has(target, p) || Reflect.has(context, p) || (_this.options.injections && Reflect.has(_this.options.injections, p));
            },
            ownKeys: function (target) {
                var keys = __assign(__assign(__assign({}, context), target), _this.options.injections);
                return Object.keys(keys);
            },
            getOwnPropertyDescriptor: function (target, p) {
                return Reflect.getOwnPropertyDescriptor(target, p)
                    || Reflect.getOwnPropertyDescriptor(context, p)
                    || (_this.options.injections && Reflect.getOwnPropertyDescriptor(_this.options.injections, p));
            },
        });
        this.subscriptions = [];
        this.handlers = [];
        this.events = {};
        this.bindings = {};
        this.joints = [];
        this.state = State.Initializing;
        // добавляем патч в очередь задач
        this.scope.$engine.publish(pipe_1.ownTask(this.patch, options, this));
    }
    Hub.prototype.patch = function (optPatch) {
        var _this = this;
        var _a, _b;
        if (this.state == State.Destroying || this.state == State.Destroyed) {
            //            console.error('Try to patch destroyed hub')
            throw new Error('Try to patch destroyed object');
        }
        var opts = mix_1.mixin(this.options, optPatch).build(this.state == State.Initialized ? this.patchRules() : this.initRules());
        if (opts === true || opts === false) {
            throw new Error('Invalid patch option mix');
        }
        //        console.log(this.options, optPatch)
        var o = this.options = opts;
        var newSubscriptions = [];
        var newHandlers = [];
        // // Injectors
        // if (optPatch.injections) {
        //     // здесь мы должны обновлять измененные инжекторы
        //     // this._Injectors = o.injections
        //     // for (let k in o.injections) {
        //     //     this.scope[k]
        //     //     // const injector: Injector<any> = o.injections[k]
        //     //     // if (injector !== undefined) {
        //     //     //     let entry = null
        //     //     //     if (typeof injector === 'function') {
        //     //     //         entry = injector(this.scope)
        //     //     //     }
        //     //     //     else if (injector != null) {
        //     //     //         console.warn('Injector must be a function', k, injector)
        //     //     //         continue
        //     //     //     }
        //     //     //     if (this.scope[k] != entry) {
        //     //     //         // TODO здесь нужно отписываться от элемента скоупа 
        //     //     //         this.scope[k] = entry
        //     //     //     }
        //     //     // }
        //     // }
        //     // this._Injectors = null
        // }
        // Joints
        //TODO joints не должны обновляться динамически, но все равно нужно сделать обработку
        if (optPatch.joints) {
            var subscriptions = value_1.spySubscriptions(function () {
                value_1.noAutoTerminal(function () {
                    for (var k in o.joints) {
                        var joint = o.joints[k].call(_this, _this.scope);
                        if (joint && joint.then) {
                            joint = createMonitoredThenable(joint);
                        }
                        _this.joints.push(joint);
                        // for (let i in o.joints[k]) {
                        //     if (o.joints[k][i]) {
                        //         const joint = o.joints[k][i].call(this, this.scope[k], this.scope)
                        //         this.joints.push(joint)    
                        //     }
                        // }
                    }
                });
            });
            newSubscriptions = newSubscriptions.concat(subscriptions);
        }
        // Reactors
        if (optPatch.reactions) {
            var _loop_1 = function (k) {
                if (o.reactions[k] && !this_1.bindings[k]) {
                    this_1.bindings[k] = this_1.patchAware(o.reactions[k]); //scopeKeyAware.bind(this, k, this.patchAware(o.reactions[k])) 
                    var entry_1 = this_1.scope[k];
                    var binding_1 = this_1.bindings[k];
                    if (value_1.isObservable(entry_1)) {
                        var sub = entry_1.$subscribe(function (next, prev) {
                            value_1.autoTerminalAware(function () {
                                scopeKeyAware(k, function () {
                                    binding_1(entry_1.$isTerminal ? next : entry_1, prev);
                                });
                            });
                        });
                        newSubscriptions.push(sub);
                    }
                    else {
                        binding_1(entry_1, undefined);
                    }
                }
            };
            var this_1 = this;
            for (var k in o.reactions) {
                _loop_1(k);
            }
        }
        // Events
        if (optPatch.events) {
            var _loop_2 = function (i) {
                if (o.events[i] && !this_2.events[i]) {
                    this_2.events[i] = o.events[i]; // FIXME
                    var _loop_3 = function (k) {
                        var bus = this_2.scope[k];
                        var callback = this_2.events[i];
                        if (value_1.isEventBus(bus) && bus.$hasEvent(i)) {
                            var handler = bus.$on(i, function (evt) {
                                value_1.noAutoTerminal(function () {
                                    callback(evt, _this.scope);
                                });
                            }, this_2);
                            newHandlers.push(handler); // FIXME
                        }
                    };
                    for (var k in this_2.scope) {
                        _loop_3(k);
                    }
                    var events = o.events[i];
                    if (typeof events === 'function') {
                        if (value_1.isCallable(this_2.scope[i])) {
                            var bus = this_2.scope[i];
                            var callback_1 = events;
                            var handler = bus.$on('done', function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                value_1.noAutoTerminal(function () {
                                    callback_1.apply(null, __spreadArray(__spreadArray([], args), [_this.scope]));
                                });
                            }, this_2);
                            newHandlers.push(handler); // FIXME
                        }
                    }
                    else if (typeof events === 'object') {
                        var bus = this_2.scope[i];
                        var _loop_4 = function (k) {
                            // FIXME добавить регистрацию событий
                            var callback = events[k];
                            if (callback && value_1.isEventBus(bus) /*&& bus.$hasEvent(i)*/) {
                                var handler = bus.$on(k, function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    value_1.noAutoTerminal(function () {
                                        callback.apply(null, __spreadArray(__spreadArray([], args), [_this.scope]));
                                    });
                                }, this_2);
                                newHandlers.push(handler); // FIXME
                            }
                        };
                        for (var k in events) {
                            _loop_4(k);
                        }
                    }
                }
            };
            var this_2 = this;
            for (var i in o.events) {
                _loop_2(i);
            }
        }
        // освежаем реакции
        //        noAutoTerminal(() => {
        // if (newSubscriptions.length) {
        //     console.log('new subscriptions', newSubscriptions)
        // }
        for (var _i = 0, newSubscriptions_1 = newSubscriptions; _i < newSubscriptions_1.length; _i++) {
            var sub = newSubscriptions_1[_i];
            if (sub == null) {
                console.error('Undefined subscription');
            }
            else {
                sub.observable.$touch(sub.subscriber);
            }
        }
        //        })
        // TODO предполагается, что повторов подписок нет
        this.subscriptions = this.subscriptions.concat(newSubscriptions);
        this.handlers = this.handlers.concat(newHandlers);
        if (this.state == State.Initializing) {
            this.state = State.Initialized;
            (_b = (_a = this.events).afterInit) === null || _b === void 0 ? void 0 : _b.call(_a, this, this.scope);
        }
        // if (this.events['patch']) {
        //     this.events['patch'](this.options, this.scope)
        // }
    };
    Hub.prototype.destroy = function (deferred) {
        var _this = this;
        // исключаем повторное удаление
        if (this.state == State.Destroying || this.state == State.Destroyed) {
            return;
        }
        // обрабатываем хуки отключения скоупа
        var disjointPromise = null;
        if (this.joints.length > 0) {
            var promises = [];
            for (var _i = 0, _a = this.joints; _i < _a.length; _i++) {
                var disjoint = _a[_i];
                if (disjoint) {
                    if (isMonitoredThenable(disjoint)) {
                        debugger;
                        disjoint.isPending && promises.push(disjoint);
                    }
                    else if (typeof disjoint === 'function') {
                        var eff = disjoint();
                        if (eff && eff.then) {
                            promises.push(eff);
                        }
                    }
                }
            }
            this.joints = [];
            if (promises.length > 0) {
                disjointPromise = Promise.all(promises);
            }
        }
        // удаляем подписки на изменения
        for (var _b = 0, _c = this.subscriptions; _b < _c.length; _b++) {
            var sub = _c[_b];
            if (sub == null) {
                console.error('Undefined subscription');
            }
            else {
                sub.observable.$unsubscribe(sub);
            }
        }
        // удаляем подписки на события
        for (var _d = 0, _e = this.handlers; _d < _e.length; _d++) {
            var h = _e[_d];
            h.bus.$off(h);
        }
        //        this.bindings = {}
        this.events = {};
        //        this.subscriptions = []
        this.handlers = [];
        if (disjointPromise) {
            this.state = State.Destroying;
            disjointPromise.then(function () {
                // завершаем удаление, только если статус на удалении
                if (_this.state == State.Destroying) {
                    deferred && deferred();
                    _this.scope = null;
                    _this.state = State.Destroyed;
                    console.log('Delayed destroy done');
                }
            }, function (err) {
                console.log('Delayed destroy fail', err);
            });
        }
        else {
            deferred && deferred();
            this.scope = null;
            this.state = State.Destroyed;
        }
        // // отложенное удаление
        // if (promise) {
        //     this.state = State.Destroying
        //     promise.then(() => {
        //         // продолжаем удаление, если оно не отменено
        //         if (this.state == State.Destroying) {
        //             //this.state = State.Initialized // ?
        //             this.destroy()
        //             //this.scope.$engine.immediate(this) // ?
        //         }
        //      }, (err) => {
        //         console.log('Delayed destroy fail', err)
        //      })
        //     return
        // }
        // if (disjointPromise) {
        //     this.state = State.Destroying
        //     disjointPromise.then(() => {
        //         // продолжаем удаление, если оно не отменено
        //         // if (this.state == State.Destroying) {
        //         //     //this.state = State.Initialized // ?
        //         //     this.destroy()
        //         //     //this.scope.$engine.immediate(this) // ?
        //         // }
        //      }, (err) => {
        //         console.log('Delayed destroy fail', err)
        //      })            
        // }
        // else {
        //     this.state = State.Destroyed
        // }
    };
    Hub.prototype.patchAware = function (callback) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var prevPatchingTarget = _PatchingHub;
            _PatchingHub = _this;
            callback.apply(_this, args);
            _PatchingHub = prevPatchingTarget;
        };
    };
    // emit (name: string, event: any) {
    //     this.events[name](event, this.scope)
    // }
    Hub.prototype.initRules = function () {
        return {};
    };
    Hub.prototype.patchRules = function () {
        return {};
    };
    Hub.prototype.reset = function (nextOpts) {
        this.state = State.Initializing;
        if (nextOpts != null) {
            console.warn('component update not yet ready', nextOpts, this);
            this.patch(nextOpts);
            return;
        }
        // FIXME возможно, необходимо сначала почистить хаб
        this.patch(this.options);
    };
    return Hub;
}());
exports.Hub = Hub;


/***/ }),

/***/ "./src/engine/index.ts":
/*!*****************************!*\
  !*** ./src/engine/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Hub */ "./src/Hub.ts"), exports);
__exportStar(__webpack_require__(/*! ./Html */ "./src/Html.ts"), exports);
__exportStar(__webpack_require__(/*! ./Gear */ "./src/Gear.ts"), exports);
__exportStar(__webpack_require__(/*! ./Hub */ "./src/Hub.ts"), exports);
__exportStar(__webpack_require__(/*! ./Blueprint */ "./src/Blueprint.ts"), exports);
__exportStar(__webpack_require__(/*! ./value */ "./src/value/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./engine */ "./src/engine/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./render */ "./src/render/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./mix */ "./src/mix/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./pipe */ "./src/pipe/index.ts"), exports);


/***/ }),

/***/ "./src/mix/Mixin.ts":
/*!**************************!*\
  !*** ./src/mix/Mixin.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isMixed = exports.mixin = exports.lastEffectiveValue = exports.Mixin = void 0;
var value_1 = __webpack_require__(/*! ../value */ "./src/value/index.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/mix/utils.ts");
var Mixin = /** @class */ (function () {
    function Mixin() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._raw = [];
        for (var i = 0; i < args.length; i++) {
            this.mix(args[i]); //FIXME  потенциальная потеря производительности
        }
    }
    Mixin.prototype.mixins = function () {
        return this._raw;
    };
    Mixin.prototype.mix = function (nextOpts) {
        if (nextOpts != null) {
            if (typeof nextOpts.mixins === 'function') {
                //                console.log(nextOpts.mixins())
                this._raw = this._raw.concat(nextOpts.mixins()); //(nextOpts as any)._raw)
            }
            else {
                this._raw.push(nextOpts);
            }
        }
        return this;
    };
    Mixin.prototype.mergeBefore = function (prevOpts) {
        if (prevOpts != null) {
            if (prevOpts.mix !== undefined) {
                debugger;
                this._raw = prevOpts._raw.concat(this._raw);
            }
            else {
                this._raw.unshift(prevOpts);
            }
        }
        return this;
    };
    Mixin.prototype.build = function (rules) {
        if (this._raw.length == 0) {
            return undefined;
        }
        // немножко эвристики для кейсов, когда опции отключаются последним сегментом
        if (this._raw[this._raw.length - 1] === false) {
            return false;
        }
        if (this._raw[0] === true && this._raw.length == 1) {
            return true;
        }
        var o = {};
        var clear = false;
        for (var i = 0; i < this._raw.length; i++) {
            if (this._raw[i] === true) {
                clear = false;
                //        continue
            }
            else if (this._raw[i] === false) {
                clear = true;
                //        continue
            }
            else {
                if (clear) {
                    o = {};
                }
                o = utils_1.buildOpts(o, this._raw[i], rules);
                clear = false;
            }
        }
        return clear ? {} : o;
    };
    Object.defineProperty(Mixin.prototype, "entries", {
        get: function () {
            return this._raw;
        },
        enumerable: false,
        configurable: true
    });
    return Mixin;
}());
exports.Mixin = Mixin;
var lastEffectiveValue = function (o) {
    var last = undefined;
    for (var _i = 0, _a = o.entries; _i < _a.length; _i++) {
        var value = _a[_i];
        if (value === true || value === false) {
            last = (last === !value || last == null) ? value : last;
        }
        else if (value != null) {
            last = value;
        }
    }
    return last;
};
exports.lastEffectiveValue = lastEffectiveValue;
var mixin = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (Function.prototype.bind.apply(Mixin, __spreadArray([null], args)));
};
exports.mixin = mixin;
var isMixed = function (obj) {
    if (obj) {
        if (false) {}
        else {
            return typeof obj.mix === 'function';
        }
    }
    return false;
    //    return !!(obj && (obj as Mixed<T>).mix)
};
exports.isMixed = isMixed;


/***/ }),

/***/ "./src/mix/index.ts":
/*!**************************!*\
  !*** ./src/mix/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Mixin */ "./src/mix/Mixin.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils */ "./src/mix/utils.ts"), exports);


/***/ }),

/***/ "./src/mix/utils.ts":
/*!**************************!*\
  !*** ./src/mix/utils.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildOpts = exports.deepClone = void 0;
var value_1 = __webpack_require__(/*! ../value */ "./src/value/index.ts");
var deepClone = function (o) {
    if (o != null) {
        if (o.constructor === Object) {
            var copy = {};
            for (var i in o) {
                copy[i] = exports.deepClone(o[i]);
            }
            o = copy;
        }
        else if (o instanceof Array) {
            var copy = [];
            for (var i = 0; i < o.length; i++) {
                copy[i] = exports.deepClone(o[i]);
            }
            o = copy;
        }
    }
    return o;
    //  return JSON.parse(JSON.stringify(o))
};
exports.deepClone = deepClone;
var buildProp = function (prop, nextProp, rule) {
    if (nextProp && value_1.isValueSet(nextProp)) {
        nextProp = nextProp.$value;
    }
    if (rule) {
        prop = rule(prop, nextProp);
    }
    else {
        if (prop && nextProp !== undefined && (prop.constructor === Object || prop.constructor === Array)) {
            prop = exports.buildOpts(prop, nextProp);
        }
        else if (nextProp !== undefined) {
            if (nextProp != null && (nextProp.constructor === Object || nextProp.constructor === Array)) {
                prop = exports.deepClone(nextProp);
                //        console.log('deep', nextProp, prop)
            }
            else {
                prop = nextProp;
            }
        }
    }
    return prop;
};
var buildOpts = function (opts, nextOpts, rules) {
    if (nextOpts && value_1.isValueSet(nextOpts)) {
        console.warn('Resolve observable opts', nextOpts);
        nextOpts = nextOpts.$value;
    }
    if (typeof nextOpts == 'function') {
        //    console.log('resolve func mix', nextOpts, opts)
        nextOpts = nextOpts();
    }
    else if (typeof nextOpts == 'string') {
        console.warn('string opts', nextOpts);
    }
    else if (typeof nextOpts == 'number') {
        console.warn('number opts', nextOpts);
    }
    // TODO возможно, здесь нужен цикл до тех пор, пока не исчезнет примесь
    if (nextOpts && typeof nextOpts.mix === 'function' /*isMixed(nextOpts)*/) {
        nextOpts = nextOpts.build(rules);
    }
    // если nextOpts является объектом
    if (nextOpts === undefined) {
        // 
    }
    else if (nextOpts === null) {
        opts = null;
    }
    else if (nextOpts.constructor === Object) {
        for (var i in nextOpts) {
            // if (i[0] == '!') {
            //   opts[i.substr(1)] = nextOpts[i]
            // }
            // else if (i[0] == '+') {
            //   // TODO
            // }
            // else if (i[0] == '-') {
            //   // TODO
            // }
            // else {
            opts[i] = buildProp(opts[i], nextOpts[i], rules && (rules[i] || rules[i[0]]));
            // }
        }
    }
    // если nextOpts является массивом
    else if (nextOpts.constructor === Array) {
        for (var i = 0; i < nextOpts.length; i++) {
            opts[i] = buildProp(opts[i], nextOpts[i], rules && (rules[i] /* || rules[i[0]]*/));
        }
    }
    else if (nextOpts instanceof Promise) {
        return Promise.all([opts, nextOpts]).then(function (o) {
            return exports.buildOpts(o[0], o[1], rules);
        });
    }
    else { //if (nextOpts !== undefined) {
        opts = nextOpts;
    }
    return opts;
};
exports.buildOpts = buildOpts;


/***/ }),

/***/ "./src/pipe/async.ts":
/*!***************************!*\
  !*** ./src/pipe/async.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AsyncEngine = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/pipe/utils.ts");
var avgTimeInterval = function (t0, t1, total) {
    return Number((Math.round(t1 - t0) / total).toFixed(5));
};
var AsyncEngine = /** @class */ (function () {
    function AsyncEngine(name) {
        this.tasks = [];
        this.subscriptions = [];
        this.deferred = [];
        this.scheduled = false;
        this.name = name || 'default';
    }
    AsyncEngine.prototype.publish = function (task) {
        if (task.done) {
            return;
        }
        this.tasks.push(task);
        !this.scheduled && this.schedule();
    };
    AsyncEngine.prototype.subscribe = function (engine) {
        if (this.subscriptions.indexOf(engine) == -1) {
            this.subscriptions.push(engine);
            return true;
        }
        return false;
    };
    AsyncEngine.prototype.unsubscribe = function (engine) {
        this.subscriptions = this.subscriptions.filter(function (sub) { return sub != engine; });
    };
    AsyncEngine.prototype.task = function (fn, arg, target) {
        return { fn: fn, arg: arg, target: target, engine: this };
    };
    AsyncEngine.prototype.schedule = function () {
        var _this = this;
        if (this.scheduled) {
            return;
        }
        this.scheduled = true;
        setTimeout(function () {
            //            console.log(`[${this.name}] tick start`, this.tasks.length)
            var t0 = performance.now();
            _this.scheduled = false;
            _this.processing = true;
            //            console.log('tick')
            var tasks = _this.tasks;
            _this.tasks = [];
            _this.deferred = _this.deferred.concat(_this.process(tasks));
            // отправляем чужие задачи дальше по конвейеру
            if (_this.tasks.length == 0) {
                _this.deferred
                    .filter(utils_1.subscriptionTaskFilter(_this.subscriptions))
                    .filter(utils_1.unknownTaskFilter(_this.subscriptions));
            }
            else if (!_this.scheduled) {
                console.error('Non scheduled tasks detected', _this.tasks);
            }
            _this.processing = false;
            var t1 = performance.now();
            console.log("[" + _this.name + "] patch end", tasks.length, Math.round(t1 - t0), avgTimeInterval(t0, t1, tasks.length) /*, deleted ? '-'+deleted : ''*/);
        });
    };
    AsyncEngine.prototype.process = function (tasks) {
        return tasks.filter(utils_1.ownTaskFilter(this));
    };
    Object.defineProperty(AsyncEngine.prototype, "isProcessing", {
        get: function () {
            return this.processing;
        },
        enumerable: false,
        configurable: true
    });
    return AsyncEngine;
}());
exports.AsyncEngine = AsyncEngine;


/***/ }),

/***/ "./src/pipe/buffered.ts":
/*!******************************!*\
  !*** ./src/pipe/buffered.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BufferedEngine = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/pipe/utils.ts");
var BufferedEngine = /** @class */ (function () {
    function BufferedEngine() {
        this.tasks = [];
        this.subscriptions = [];
        this.processing = false;
    }
    BufferedEngine.prototype.publish = function (task) {
        if (task.done) {
            return;
        }
        this.tasks.push(task);
    };
    BufferedEngine.prototype.subscribe = function (engine) {
        if (this.subscriptions.indexOf(engine) == -1) {
            this.subscriptions.push(engine);
            return true;
        }
        return false;
    };
    BufferedEngine.prototype.unsubscribe = function (engine) {
        this.subscriptions = this.subscriptions.filter(function (sub) { return sub != engine; });
    };
    BufferedEngine.prototype.task = function (fn, arg, target) {
        return { fn: fn, arg: arg, target: target, engine: this };
    };
    BufferedEngine.prototype.flush = function () {
        this.processing = true;
        var tasks = this.tasks;
        this.tasks = [];
        tasks
            .filter(utils_1.ownTaskFilter(this))
            .filter(utils_1.subscriptionTaskFilter(this.subscriptions))
            .filter(utils_1.unknownTaskFilter(this.subscriptions));
        if (this.tasks.length > 0) {
            this.flush();
        }
        this.processing = false;
    };
    Object.defineProperty(BufferedEngine.prototype, "isProcessing", {
        get: function () {
            return this.processing;
        },
        enumerable: false,
        configurable: true
    });
    return BufferedEngine;
}());
exports.BufferedEngine = BufferedEngine;


/***/ }),

/***/ "./src/pipe/index.ts":
/*!***************************!*\
  !*** ./src/pipe/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./utils */ "./src/pipe/utils.ts"), exports);
__exportStar(__webpack_require__(/*! ./async */ "./src/pipe/async.ts"), exports);
__exportStar(__webpack_require__(/*! ./buffered */ "./src/pipe/buffered.ts"), exports);
__exportStar(__webpack_require__(/*! ./pipe */ "./src/pipe/pipe.ts"), exports);


/***/ }),

/***/ "./src/pipe/pipe.ts":
/*!**************************!*\
  !*** ./src/pipe/pipe.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pipe = void 0;
var SimplePipe = /** @class */ (function () {
    function SimplePipe(schedulers) {
        this.head = schedulers[0];
        this.subscriptions = [];
        for (var i = 1; i < schedulers.length; i++) {
            if (schedulers[i - 1].subscribe(schedulers[i])) {
                this.subscriptions.push([schedulers[i - 1], schedulers[i]]);
            }
        }
    }
    SimplePipe.prototype.push = function (task) {
        this.head.publish(task);
        return this;
    };
    SimplePipe.prototype.asap = function (task) {
        if (task.engine && task.engine.isProcessing) {
            task.engine.publish(task);
        }
        else {
            this.head.publish(task);
        }
        return this;
    };
    SimplePipe.prototype.destroy = function () {
        this.subscriptions.forEach(function (sub) {
            sub[0].unsubscribe(sub[1]);
        });
    };
    return SimplePipe;
}());
var pipe = function () {
    var schedulers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schedulers[_i] = arguments[_i];
    }
    return new SimplePipe(schedulers);
};
exports.pipe = pipe;


/***/ }),

/***/ "./src/pipe/utils.ts":
/*!***************************!*\
  !*** ./src/pipe/utils.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unknownTaskFilter = exports.subscriptionTaskFilter = exports.ownTaskFilter = exports.ownTask = void 0;
var ownTask = function (fn, arg, target) {
    return { fn: fn, arg: arg, target: target };
};
exports.ownTask = ownTask;
var ownTaskFilter = function (owner) { return function (task) {
    var _a;
    if (!task.engine || task.engine == owner) {
        //        console.log('task', task.arg, task.target)
        // исполняем задачу
        (_a = task.fn) === null || _a === void 0 ? void 0 : _a.call(task.target, task.arg);
        task.done = true;
    }
    else {
        return true;
    }
}; };
exports.ownTaskFilter = ownTaskFilter;
var subscriptionTaskFilter = function (subscriptions) { return function (task) {
    var engine = subscriptions.find(function (sub) { return sub == task.engine; });
    if (engine) {
        engine.publish(task);
    }
    else {
        return true;
    }
}; };
exports.subscriptionTaskFilter = subscriptionTaskFilter;
var unknownTaskFilter = function (subscriptions) { return function (task) {
    subscriptions.forEach(function (sub) {
        sub.publish(task);
    });
}; };
exports.unknownTaskFilter = unknownTaskFilter;


/***/ }),

/***/ "./src/reconcile.ts":
/*!**************************!*\
  !*** ./src/reconcile.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reconcile = exports.ItemOp = void 0;
var ItemOp;
(function (ItemOp) {
    ItemOp["ADD"] = "add";
    ItemOp["DELETE"] = "delete";
    ItemOp["UPDATE"] = "update";
})(ItemOp = exports.ItemOp || (exports.ItemOp = {}));
var toSequence = function (items) {
    var head = null;
    var tail = null;
    var map = {};
    items.forEach(function (itm, i) {
        var link = {
            item: itm,
            key: itm.key,
            index: i,
            before: tail,
            after: null
        };
        map[itm.key] = link;
        if (head == null) {
            head = link;
        }
        if (tail) {
            tail.after = link;
        }
        tail = link;
    });
    return [head, map];
};
// const toMap = (items: KVItem[]) : {[key: string]: KVItem} => {
//     const map: {[key: string]: KVItem} = {}
//     items.forEach(itm => {
//         map[itm.key] = itm
//     })
// }
// const mergeLinks = (prevLink: Link, nextLink: Link) : Link => {
// }
var reconcile = function (prevItems, nextItems) {
    // TODO должна быть проверка на уникальность ключей
    //    console.log('----------------------------------------------')
    if (prevItems.length == 0) {
        return nextItems.map(function (itm) {
            itm.op = ItemOp.ADD;
            return itm;
        });
    }
    if (nextItems.length == 0) {
        return prevItems.map(function (itm) {
            itm.op = ItemOp.DELETE;
            return itm;
        });
    }
    //  преобразуем массивы в последовательности
    var _a = toSequence(prevItems), prevSeq = _a[0], prevMap = _a[1];
    var _b = toSequence(nextItems), nextSeq = _b[0], nextMap = _b[1];
    var seqMap = {};
    // сливаем последовательности
    for (var k in prevMap) {
        seqMap[k] = prevMap[k];
    }
    for (var k in nextMap) {
        if (!seqMap[k]) {
            seqMap[k] = { key: k, index: -1 }; //nextMap[k].index}
        }
    }
    for (var k in nextMap) {
        var next = nextMap[k];
        var link = seqMap[k];
        link.item2 = next.item;
        link.before2 = next.before && seqMap[next.before.key];
        link.after2 = next.after && seqMap[next.after.key];
    }
    var sequence = [];
    var head = seqMap[nextItems[0].key];
    //    console.log(seqMap)
    var tail = head;
    // двигаемся вдоль новой головы до первого общего узла
    while (tail && tail.item == null) {
        tail.merged = true;
        sequence.push(tail);
        tail = tail.after2;
    }
    var saved = tail;
    if (tail == null) {
        tail = seqMap[prevItems[0].key];
    }
    // ищем старую голову
    while (tail.before) {
        tail = tail.before;
    }
    // двигаемся вдоль старой головы до первого общего узла
    while (tail && tail.item2 == null) {
        tail.merged = true;
        sequence.push(tail);
        tail = tail.after;
    }
    // возвращаемся к прерванному обходу
    tail = saved;
    while (tail) {
        tail.merged = true;
        sequence.push(tail);
        if (tail.after2) {
            if (tail.after2.index > tail.index) {
                // собираем старые узлы после
                var node = tail.after;
                while (node && node.item2 == null && !node.merged) {
                    node.merged = true;
                    sequence.push(node);
                    node = node.after;
                }
            }
            else {
                // собираем старые узлы до
                var node = tail.before;
                while (node && node.item2 == null && !node.merged) {
                    node.merged = true;
                    sequence.push(node);
                    node = node.before;
                }
            }
        }
        tail = tail.after2;
    }
    // двигаемся назад по новому хвосту
    tail = sequence[sequence.length - 1];
    while (tail && tail.item == null) {
        tail = tail.before2;
    }
    while (tail) {
        if (!tail.merged) {
            sequence.push(tail);
        }
        tail = tail.after;
    }
    //     console.log(sequence)
    return sequence.map(function (link) {
        var item = {
            key: link.key,
            value: null //link.item || link.item2
        };
        if (link.item && link.item2) {
            item.op = ItemOp.UPDATE;
            item.value = link.item.value;
        }
        else if (link.item) {
            item.op = ItemOp.DELETE;
            item.value = link.item.value;
        }
        else {
            item.op = ItemOp.ADD;
            item.value = link.item2.value;
        }
        return item;
    });
};
exports.reconcile = reconcile;


/***/ }),

/***/ "./src/render/index.ts":
/*!*****************************!*\
  !*** ./src/render/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./utils */ "./src/render/utils.ts"), exports);
__exportStar(__webpack_require__(/*! ./node */ "./src/render/node.ts"), exports);


/***/ }),

/***/ "./src/render/node.ts":
/*!****************************!*\
  !*** ./src/render/node.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomNode = void 0;
var value_1 = __webpack_require__(/*! ../value */ "./src/value/index.ts");
var pubsub_1 = __webpack_require__(/*! ../value/pubsub */ "./src/value/pubsub.ts");
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


/***/ }),

/***/ "./src/render/utils.ts":
/*!*****************************!*\
  !*** ./src/render/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildClassName = void 0;
//export type VNodeFactory = <P, O>(key: string, vnodeProps: P, htmlProps: O&Dom, children?: any[]) => VNode
var buildClassName = function (cn, co) {
    var classes = {};
    if (cn) {
        cn.split(' ').forEach(function (n) {
            classes[n] = true;
        });
    }
    if (!co) {
    }
    else if (Array.isArray(co)) {
        for (var _i = 0, co_1 = co; _i < co_1.length; _i++) {
            var cls = co_1[_i];
            classes[cls] = true;
        }
    }
    else if (typeof co === 'string') {
        classes[co] = true;
    }
    else {
        for (var i in co) {
            if (co[i] !== undefined) {
                classes[i] = co[i];
            }
        }
        //Object.assign(classes, co)
    }
    var cn_a = [];
    for (var i in classes) {
        if (classes[i]) {
            cn_a.push(i);
        }
    }
    return cn_a.length ? cn_a.join(' ') : null;
};
exports.buildClassName = buildClassName;


/***/ }),

/***/ "./src/rules.ts":
/*!**********************!*\
  !*** ./src/rules.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultRules = void 0;
var mix_1 = __webpack_require__(/*! ./mix */ "./src/mix/index.ts");
var Option = function (x, y) {
    return new mix_1.Mixin(x, y);
};
//const State = (x, y) => {return new State(x, y)}
var OptionCollection = function (x, y) {
    if (y === false) {
        return false;
    }
    else if (y === true) {
        return true;
    }
    // if (x === undefined && y == undefined) {
    //   return 
    // }
    if (y && y.constructor != Object) {
        x && console.warn('Ignore prev options', x);
        return y;
    }
    if (x && x.constructor != Object) {
        y && console.warn('Ignore new options', y);
        return x;
    }
    //    console.log(x && x.constructor, y && y.constructor)
    var kv = undefined;
    if (x != null) {
        kv = kv || {};
        for (var i in x) {
            kv[i] = new mix_1.Mixin(x[i]);
        }
    }
    if (y != null) {
        kv = kv || {};
        //      console.log('y', y)
        for (var i in y) {
            kv[i] = kv[i] ? kv[i].mix(y[i]) : new mix_1.Mixin(y[i]);
        }
    }
    //  console.log(kv)
    return kv;
};
var OptionArray = function (x, y) {
    // TODO
};
var StringArray = function (x, y) {
    var arr = [];
    if (x != null) {
        arr = [].concat(x);
    }
    if (y != null) {
        arr = arr.concat(y);
    }
    return arr;
};
var Overlap = function (x, y) {
    return y;
};
var OptionCollectionOverlap = function (x, y) {
    //    console.log('overlap', x, y)
    if (y === false) {
        return false;
    }
    else if (y === true) {
        return x;
    }
    if (y && y.constructor != Object) {
        x && console.warn('Ignore prev options', x);
        return y;
    }
    if (x && x.constructor != Object) {
        y && console.warn('Ignore new options', y);
        return x;
    }
    //     console.log(x && x.constructor, y && y.constructor)
    var kv = {};
    if (x != null) {
        for (var i in x) {
            kv[i] = new mix_1.Mixin(x[i]);
        }
    }
    if (y != null) {
        //      console.log('y+', y)
        for (var i in y) {
            kv[i] = new mix_1.Mixin(y[i]);
        }
    }
    //    console.log(JSON.stringify(kv))
    return kv;
};
exports.DefaultRules = {
    Option: Option,
    OptionCollection: OptionCollection,
    OptionArray: OptionArray,
    StringArray: StringArray,
    Overlap: Overlap,
    OptionCollectionOverlap: OptionCollectionOverlap
};


/***/ }),

/***/ "./src/value/bus.ts":
/*!**************************!*\
  !*** ./src/value/bus.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {


var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),

/***/ "./src/value/callable.ts":
/*!*******************************!*\
  !*** ./src/value/callable.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isCallable = exports.callable = void 0;
var node_1 = __webpack_require__(/*! ./node */ "./src/value/node.ts");
var observable_1 = __webpack_require__(/*! ./observable */ "./src/value/observable.ts");
var _Node = /** @class */ (function (_super) {
    __extends(_Node, _super);
    function _Node() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return _Node;
}(node_1.Node));
var CallableNode = /** @class */ (function (_super) {
    __extends(CallableNode, _super);
    function CallableNode(initValue) {
        var _this = _super.call(this) || this;
        _this._memoValue = initValue;
        _this._value = new _Node();
        return _this;
        //this._events = new EventNode()
    }
    CallableNode.prototype.$subscribe = function (subscriber) {
        return this._value.$subscribe(subscriber);
    };
    CallableNode.prototype.$unsubscribe = function (subscription) {
        this._value.$unsubscribe(subscription);
    };
    CallableNode.prototype.$touch = function (subscriber) {
        //throw new Error("Method not implemented.")
    };
    CallableNode.prototype.$untouch = function () {
        //throw new Error("Method not implemented.")
    };
    CallableNode.prototype.$publish = function (next, prev, keys) {
        this._value.$publish(next, prev, keys);
    };
    CallableNode.prototype.$call = function (thisArg, args) {
        var _this = this;
        if (this._memoValue == null) {
            console.warn('Possible uninitialized callable', args);
        }
        var result = this._memoValue != null ? this._memoValue.apply(thisArg, args) : args[0];
        if (observable_1.isValueSet(result)) {
            result = result.$value;
        }
        if (result && result.then) {
            this.$emit('wait');
            result = result.then(function (response) {
                _this.$emit('done', response);
                //                this.$publish(response)
                return response;
            }, function (fail) {
                _this.$emit('fail', fail);
                return fail;
            });
        }
        else {
            this.$emit('done', result);
            //            this.$publish(result)
        }
        return result;
    };
    CallableNode.prototype.$emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._value.$emit.apply(this._value, __spreadArray([name], args));
    };
    CallableNode.prototype.$on = function (name, callback, target) {
        return this._value.$on(name, callback, target);
    };
    CallableNode.prototype.$off = function (callbackOrTargetOrListener) {
        this._value.$off(callbackOrTargetOrListener);
    };
    CallableNode.prototype.$event = function (name) {
        return null;
        //throw new Error("Method not implemented.")
    };
    CallableNode.prototype.$hasEvent = function (name) {
        return false;
        //throw new Error("Method not implemented.")
    };
    Object.defineProperty(CallableNode.prototype, "$value", {
        get: function () {
            return this._memoValue;
        },
        set: function (value) {
            this._memoValue = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CallableNode.prototype, "$uid", {
        get: function () {
            return '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CallableNode.prototype, "$isTerminal", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    // FIXME убрать после проверки наличия событий в Hub
    CallableNode.prototype.$has = function () {
        return false;
    };
    CallableNode.prototype.$at = function () {
        return null;
    };
    return CallableNode;
}(Function));
var callable = function (initValue) {
    //const value = isValueSet(initValue) ? initValue.$value : initValue
    return observable_1.proxify(initValue, new CallableNode(initValue));
};
exports.callable = callable;
var isCallable = function (v) {
    return v && typeof v.$call === 'function';
};
exports.isCallable = isCallable;


/***/ }),

/***/ "./src/value/computable.ts":
/*!*********************************!*\
  !*** ./src/value/computable.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.computable = void 0;
var engine_1 = __webpack_require__(/*! ./engine */ "./src/value/engine.ts");
var node_1 = __webpack_require__(/*! ./node */ "./src/value/node.ts");
var observable_1 = __webpack_require__(/*! ./observable */ "./src/value/observable.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/value/utils.ts");
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


/***/ }),

/***/ "./src/value/engine.ts":
/*!*****************************!*\
  !*** ./src/value/engine.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var _this = this;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.commitEngine = exports.currentTransaction = exports.transactionUpdates = exports.closeTransaction = exports.openTransaction = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/value/utils.ts");
var _Session = null;
var openTransaction = function () {
    var t = { joined: true };
    if (!_Session) {
        _Session = {
            nodes: new Set(),
            head: _this,
            deleted: [],
            updated: []
        };
        t.joined = false;
    }
    // else {
    //     debugger
    // }
    return t;
};
exports.openTransaction = openTransaction;
var closeTransaction = function (t) {
    if (!t.joined) {
        if (_Session.updated.length > 0 || _Session.deleted.length > 0) {
            _engine.addSession(_Session);
        }
        _Session = null;
    }
};
exports.closeTransaction = closeTransaction;
var transactionUpdates = function (t) {
    return _Session.updated;
};
exports.transactionUpdates = transactionUpdates;
var currentTransaction = function () {
    return _Session;
};
exports.currentTransaction = currentTransaction;
var UpdateEngine = /** @class */ (function () {
    //    _commitedSubscriptions: Set<Subscription>
    function UpdateEngine() {
        this._sessions = [];
        this._commitedNodes = new Map();
        //        this._commitedSubscriptions = new Set<Subscription>()
    }
    UpdateEngine.prototype.addSession = function (session) {
        this._sessions.push(session);
    };
    UpdateEngine.prototype.commit = function () {
        var _this = this;
        if (!this._commiting) {
            //            console.log('commit', this._sessions)
            //            this._commitedNodes.size == 0 && console.log('Commit start')
            this._commiting = true;
            var sessions = this._sessions;
            this._sessions = [];
            sessions.forEach(function (session) {
                //                console.log('session', session.updated)
                // ?
                session.deleted.forEach(function (del) {
                    //                    if (del.$subscriptions.length == 0) {
                    del.$destroy();
                    // }
                    // console.log('del has subscriptions', del)
                });
                //                const lastUpdateMap = new Map<Subscriber<any>, NodeUpdate>()
                session.updated.forEach(function (upd) {
                    if (_this._commitedNodes.has(upd.node)) {
                        //console.warn('Cyclic update detected', upd.prev, upd.next)
                        if (upd.next === _this._commitedNodes.get(upd.node)) {
                            console.warn('Possible cyclic update', upd);
                            return;
                        }
                        //                        return
                    }
                    upd.node.$subscriptions.forEach(function (sub) {
                        //                        console.log('publish to subscriber', upd.next)
                        sub.subscriber.$publish(upd.next, upd.prev, utils_1.EMPTY);
                    });
                    _this._commitedNodes.set(upd.node, upd.next);
                });
                // lastUpdateMap.forEach((upd, sub) => {
                //     sub.$publish(upd.next, upd.prev, EMPTY)
                // })
                //                 session.updated.forEach(upd => {
                //                     if (this._commitedNodes.has(upd.node)) {
                //                         if (upd.next == 'filter: Albania') {
                //                             debugger
                //                         }
                // //                        console.log('Already commited', upd, upd.node._memoValue)
                //                         return
                //                     }
                //                     upd.node._subscriptions.forEach(sub => {
                //                         sub.subscriber.$publish(upd.next, upd.prev, EMPTY)
                //                     })
                //                 })
                //                this._commitedNodes.add(session.head as Node<any>)
            });
            this._commiting = false;
            if (this._sessions.length > 0) {
                this.commit();
                //                console.log('commit')
            }
            else {
                this._commitedNodes.clear();
                //                console.log('Commit end')
            }
        }
    };
    return UpdateEngine;
}());
var _engine = new UpdateEngine();
var commitEngine = function () {
    return _engine;
};
exports.commitEngine = commitEngine;


/***/ }),

/***/ "./src/value/index.ts":
/*!****************************!*\
  !*** ./src/value/index.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./utils */ "./src/value/utils.ts"), exports);
__exportStar(__webpack_require__(/*! ./node */ "./src/value/node.ts"), exports);
__exportStar(__webpack_require__(/*! ./observable */ "./src/value/observable.ts"), exports);
__exportStar(__webpack_require__(/*! ./computable */ "./src/value/computable.ts"), exports);
__exportStar(__webpack_require__(/*! ./iterator */ "./src/value/iterator.ts"), exports);
__exportStar(__webpack_require__(/*! ./iterable */ "./src/value/iterable.ts"), exports);
__exportStar(__webpack_require__(/*! ./callable */ "./src/value/callable.ts"), exports);
__exportStar(__webpack_require__(/*! ./pubsub */ "./src/value/pubsub.ts"), exports);


/***/ }),

/***/ "./src/value/iterable.ts":
/*!*******************************!*\
  !*** ./src/value/iterable.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isIterable = exports.iterable = exports.IterableNode = void 0;
var node_1 = __webpack_require__(/*! ./node */ "./src/value/node.ts");
var observable_1 = __webpack_require__(/*! ./observable */ "./src/value/observable.ts");
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


/***/ }),

/***/ "./src/value/iterator.ts":
/*!*******************************!*\
  !*** ./src/value/iterator.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ObservableValueIterator = void 0;
var ObservableValueIterator = /** @class */ (function () {
    function ObservableValueIterator(source, key) {
        this.source = source;
        this.index = -1;
        this.key = key;
    }
    ObservableValueIterator.prototype.next = function () {
        if (this.source == null) {
            return { done: true };
        }
        if (this.index == -1) {
            var v = this.source.$value;
            if (Array.isArray(v)) {
                this.maxIndex = v.length;
            }
            else if (typeof v === 'object') {
                this.keys = Object.keys(v);
            }
            else {
                console.error('Value is not iterable', v);
            }
        }
        this.index++;
        var result = {
            done: false
        };
        if (this.keys) {
            if (this.index < this.keys.length) {
                result.value = this.source.$at(this.keys[this.index]);
            }
            else {
                result.done = true;
            }
        }
        else {
            if (this.index < this.maxIndex) {
                result.value = this.source.$at(this.index);
            }
            else {
                result.done = true;
            }
        }
        return result;
    };
    Object.defineProperty(ObservableValueIterator.prototype, "$name", {
        get: function () {
            return this.key;
        },
        enumerable: false,
        configurable: true
    });
    return ObservableValueIterator;
}());
exports.ObservableValueIterator = ObservableValueIterator;
// export const iterator = <T extends []|{}>(source: T, name: string = '__it') : ValueIterator<T> => {
//     return new ObservableValueIterator(source as any, String(name))
// }
// export const next = <T>(scope: any, name: string = '__it') : Value<T> => {
//     return scope[name]
// }


/***/ }),

/***/ "./src/value/node.ts":
/*!***************************!*\
  !*** ./src/value/node.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Node = exports.spyGetters = exports.IsCheck = exports.HasCheck = exports.UpdateDirection = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/value/utils.ts");
var engine_1 = __webpack_require__(/*! ./engine */ "./src/value/engine.ts");
var pubsub_1 = __webpack_require__(/*! ./pubsub */ "./src/value/pubsub.ts");
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


/***/ }),

/***/ "./src/value/observable.ts":
/*!*********************************!*\
  !*** ./src/value/observable.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.proxify = exports.__isValue = exports.__isProxy = exports.isValueIterator = exports.isValueSet = exports.isObservable = exports.reactive = exports.observable = exports.ObservableNode = exports.isAutoTerminal = exports.noAutoTerminal = exports.autoTerminalAware = void 0;
var node_1 = __webpack_require__(/*! ./node */ "./src/value/node.ts");
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


/***/ }),

/***/ "./src/value/pubsub.ts":
/*!*****************************!*\
  !*** ./src/value/pubsub.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PubSub = exports.spySubscriptions = void 0;
var bus_1 = __webpack_require__(/*! ./bus */ "./src/value/bus.ts");
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


/***/ }),

/***/ "./src/value/utils.ts":
/*!****************************!*\
  !*** ./src/value/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEventBus = exports.defaultUidFunc = exports.EMPTY = void 0;
exports.EMPTY = Object.seal({});
// let _SubscriptionSpy = []
// export const spySubscriptions = (fn: Function) : Subscription[] => {
//     // TODO
//     return []
// }
// let _AutoSubscriber : Subscriber<any> = null
// export const checkAutoSubscriber = () : Subscriber<any> => {
//     return _AutoSubscriber
// }
var defaultUidFunc = function (v) {
    if (v == null) {
        return undefined;
    }
    var uid = undefined;
    if (typeof v == 'string' || typeof v == 'number' || typeof v == 'boolean' || typeof v == 'symbol') {
        uid = String(v);
    }
    else if (v.id != null) {
        uid = String(v.id);
    }
    else {
        //        console.warn('Uid function should be defined', v)
    }
    if (uid == '[object Object]') {
        console.warn('Uid should be a primitive value', uid, v);
    }
    return uid;
};
exports.defaultUidFunc = defaultUidFunc;
var isEventBus = function (v) {
    return v != null && v.$hasEvent != undefined;
};
exports.isEventBus = isEventBus;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map