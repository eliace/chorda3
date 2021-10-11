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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html = exports.defaultLayout = exports.passthruLayout = exports.defaultRender = exports.defaultHtmlFactory = exports.defaultHtmlPatchRules = exports.defaultHtmlInitRules = void 0;
var _1 = require(".");
var Gear_1 = require("./Gear");
var render_1 = require("./render");
var rules_1 = require("./rules");
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
//# sourceMappingURL=Html.js.map