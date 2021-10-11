"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMixed = exports.mixin = exports.lastEffectiveValue = exports.Mixin = void 0;
var value_1 = require("../value");
var utils_1 = require("./utils");
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
        if (false && obj[value_1.__isProxy]) {
            return ('mix' in obj);
        }
        else {
            return typeof obj.mix === 'function';
        }
    }
    return false;
    //    return !!(obj && (obj as Mixed<T>).mix)
};
exports.isMixed = isMixed;
//# sourceMappingURL=Mixin.js.map