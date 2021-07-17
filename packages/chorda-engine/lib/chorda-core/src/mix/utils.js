"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOpts = exports.deepClone = void 0;
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
    if (nextProp && nextProp.$at) {
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
    if (nextOpts && nextOpts.$at) {
        //    console.warn('Resolve observable mix', nextOpts)
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
    if (nextOpts.mix) {
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
