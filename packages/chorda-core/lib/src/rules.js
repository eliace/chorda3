"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRules = void 0;
var mix_1 = require("./mix");
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
//# sourceMappingURL=rules.js.map