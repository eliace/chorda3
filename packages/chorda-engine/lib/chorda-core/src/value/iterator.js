"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterator = exports.ObservableValueIterator = void 0;
var ObservableValueIterator = /** @class */ (function () {
    function ObservableValueIterator(source, key) {
        this.source = source;
        this.index = -1;
        this.key = key;
    }
    ObservableValueIterator.prototype.next = function () {
        if (this.index == -1) {
            var v = this.source.$value;
            if (Array.isArray(v)) {
                this.maxIndex = v.length;
            }
            else {
                this.keys = Object.keys(v);
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
var iterator = function (source, name) {
    return new ObservableValueIterator(source, name);
};
exports.iterator = iterator;
