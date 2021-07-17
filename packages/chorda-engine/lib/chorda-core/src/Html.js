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
exports.Html = exports.defaultRender = exports.defaultLayout = exports.defaultHtmlFactory = exports.defaultHtmlPatchRules = exports.defaultInitHtmlRules = void 0;
var Gear_1 = require("./Gear");
var render_1 = require("./render");
var rules_1 = require("./rules");
exports.defaultInitHtmlRules = __assign({ css: rules_1.DefaultRules.StringArray }, Gear_1.defaultInitRules);
exports.defaultHtmlPatchRules = __assign({ css: rules_1.DefaultRules.StringArray }, Gear_1.defaultPatchRules);
var defaultHtmlFactory = function (opts, scope, rules) {
    return new Html(opts, scope);
};
exports.defaultHtmlFactory = defaultHtmlFactory;
var defaultLayout = function (key, props, ext, children) {
    return [key, props, ext, children && children.map(exports.defaultRender)];
};
exports.defaultLayout = defaultLayout;
var defaultRender = function (html) { return (html.render) ? html.render() : html; };
exports.defaultRender = defaultRender;
var Html = /** @class */ (function (_super) {
    __extends(Html, _super);
    function Html(options, scope) {
        var _this = _super.call(this, options, scope) || this;
        _this.scope.$dom = new render_1.DomNode();
        _this.ext = {};
        return _this;
        //        this.dirty = true
    }
    Html.prototype.patch = function (optPatch) {
        _super.prototype.patch.call(this, optPatch);
        var o = this.options;
        // TODO
        if (optPatch.classes) {
            this.ext.className = render_1.buildClassName(this.ext.className, o.classes);
        }
        if (optPatch.css) {
            this.ext.className = render_1.buildClassName(this.ext.className, o.css);
        }
        if (optPatch.styles) {
            this.ext.styles = __assign(__assign({}, this.ext.styles), o.styles);
        }
        if (optPatch.html) {
            this.ext.html = o.html;
        }
        // помечаем путь до корня "грязным"
        var html = this;
        while (html && !html.dirty) {
            html.dirty = true;
            html = html.parent;
        }
        // this.visit((h) => {
        //     if (h.dirty) return false
        //     h.dirty = true
        // })
    };
    Html.prototype.initRules = function () {
        return Gear_1.defaultInitRules;
    };
    Html.prototype.patchRules = function () {
        return Gear_1.defaultPatchRules;
    };
    Html.prototype.attach = function (root) {
        this.scope.$renderer.attach(root, this);
        this.attached = true;
    };
    Html.prototype.detach = function () {
        this.scope.$renderer.detach(this);
        this.attached = false;
    };
    Html.prototype.render = function () {
        if (!this.dirty) {
            return this.vnode;
        }
        var o = this.options;
        var layout = o.layout || this.scope.$defaultLayout;
        var renderer = this.scope.$renderer;
        var text = o.text;
        var children = this.children;
        var key = this.uid || this.key || this.index;
        if (text || children.length > 0) {
            this.vnode = renderer.createVNode(layout(key, this.options.dom, this.ext, text ? __spreadArray([text], children) : children));
        }
        else {
            this.vnode = renderer.createVNode(layout(key, this.options.dom, this.ext));
        }
        this.dirty = false;
        return this.vnode;
    };
    Html.prototype.destroy = function (defer) {
        var _this = this;
        _super.prototype.destroy.call(this, function () {
            if (_this.attached) {
                _this.detach();
            }
            defer && defer();
        });
    };
    return Html;
}(Gear_1.Gear));
exports.Html = Html;
