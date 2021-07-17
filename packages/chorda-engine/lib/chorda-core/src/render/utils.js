"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClassName = void 0;
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
