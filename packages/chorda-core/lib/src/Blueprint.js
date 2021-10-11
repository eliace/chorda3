"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.attach = exports.createHtmlContext = exports.createHtmlOptions = exports.mix = void 0;
var Html_1 = require("./Html");
var mix_1 = require("./mix");
var pipe_1 = require("./pipe");
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
//# sourceMappingURL=Blueprint.js.map