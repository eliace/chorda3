"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=iterator.js.map