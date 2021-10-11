"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lodash_1 = require("lodash");
var src_1 = require("../../src");
var subscribeToAllOf = function (v, subscriber) {
    v.$subscribe(subscriber);
    if (!v.$isTerminal) {
        v.$ownKeys().forEach(function (k) {
            subscribeToAllOf(v.$at(k), subscriber);
        });
    }
};
describe('observable', function () {
    it('Should set and get value', function () {
        var v = src_1.observable(0);
        v.$value = 5;
        chai_1.expect(v.$value).to.be.eq(5);
    });
    it('Should subscribe changes', function () {
        var changes = [];
        var v = src_1.observable(0);
        v.$subscribe(function (next) {
            changes.push(next);
        });
        v.$value = 5;
        v.$value = 12;
        chai_1.expect(changes).to.be.deep.eq([5, 12]);
    });
    it('Should not duplicate subscriptions', function () {
        var a = src_1.observable(null);
        var b = src_1.observable(null);
        a.$subscribe(b);
        a.$subscribe(b);
        chai_1.expect(a._subscriptions.length).to.be.eq(1);
        a.$unsubscribe(b);
        var sub = function () { };
        a.$subscribe(sub);
        a.$subscribe(sub);
        chai_1.expect(a._subscriptions.length).to.be.eq(1);
    });
    it('Should process value publish', function () {
        var v = src_1.observable(10);
        v.$publish(12);
        chai_1.expect(v.$value).to.be.eq(12);
    });
    it('Should get entry at key', function () {
        var v = src_1.observable({
            a: 'Alice',
            b: 10
        });
        var a = v.$at('a');
        var b = v.$at('b');
        chai_1.expect(a.$value).to.be.eq('Alice');
        chai_1.expect(b.$value).to.be.eq(10);
    });
    it('Should proxy property get', function () {
        var v = src_1.observable({
            a: 'Alice',
            b: 10
        });
        chai_1.expect(src_1.isObservable(v.a)).to.be.true;
        chai_1.expect(src_1.isObservable(v.b)).to.be.true;
        chai_1.expect(v.a.$value).to.be.eq('Alice');
        chai_1.expect(v.b.$value).to.be.eq(10);
    });
    it('Should proxy property set', function () {
        var v = src_1.observable({
            a: 'Alice',
            b: 10
        });
        v.a = 'Bob';
        v.b = 15;
        chai_1.expect(v.a.$value).to.be.eq('Bob');
        chai_1.expect(v.b.$value).to.be.eq(15);
    });
    it('Should auto terminal get values', function () {
        src_1.autoTerminalAware(function () {
            var v = src_1.observable({
                a: 'Alice',
                b: 10
            });
            chai_1.expect(v.a).to.be.eq('Alice');
            chai_1.expect(v.b).to.be.eq(10);
        });
    });
    it('Should spy value getters', function () {
        var v = src_1.observable({
            a: 'Alice',
            b: 10
        });
        var v2 = src_1.observable({
            a: 'Bob',
            b: 25
        });
        var getters = src_1.spyGetters(function () {
            var s = v.$value;
            var n = v2.$value;
        });
        chai_1.expect(getters.length).to.be.eq(2);
    });
    it('Should spy value subscriptions', function () {
        var v = src_1.observable({
            a: 'Alice',
            b: 10
        });
        var subscriptions = src_1.spySubscriptions(function () {
            v.$at('a').$subscribe(function (next) {
                // any
            });
        });
        chai_1.expect(subscriptions.length).to.be.eq(1);
    });
    it('Should notify ascendant and descendant subscribers', function () {
        var v = src_1.observable({
            name: 'Alice',
            address: {
                country: 'Great Britain',
                city: 'London'
            }
        });
        var updated = [];
        subscribeToAllOf(v, function (next) {
            updated.push(next);
        });
        v.$at('address').$at('city').$value = 'Manchester';
        chai_1.expect(updated).to.be.deep.eq([
            { name: 'Alice', address: { country: 'Great Britain', city: 'Manchester' } },
            { country: 'Great Britain', city: 'Manchester' },
            'Manchester'
        ]);
        updated = [];
        v.$at('address').$value = { country: 'Sweden', city: 'Stockholm' };
        chai_1.expect(updated).to.be.deep.eq([
            'Sweden',
            'Stockholm',
            { name: 'Alice', address: { country: 'Sweden', city: 'Stockholm' } },
            { country: 'Sweden', city: 'Stockholm' }
        ]);
    });
    it('Should break looped update cycle', function () {
        var a = src_1.observable(5);
        var b = src_1.observable(8);
        a.$subscribe(b);
        b.$subscribe(a);
        a.$value = 1;
        //a.$publish(1)
        chai_1.expect(a.$value).to.be.eq(1);
        chai_1.expect(b.$value).to.be.eq(1);
    });
    it('Should call own methods', function () {
        console.log(typeof src_1.observable(5));
        var a = src_1.observable([1, 2, 3]);
        //console.log(JSON.stringify(a))
        var result = [];
        a.forEach(function (v) {
            result.push(v);
        });
        chai_1.expect(result.length).to.eq(3);
        var b = src_1.observable([4, 5, 6]);
        var c = a.concat(b);
        chai_1.expect(c.length).to.eq(6);
        var d = null;
        src_1.autoTerminalAware(function () {
            d = a.concat(b);
        });
        chai_1.expect(d).to.deep.eq([1, 2, 3, 4, 5, 6]);
    });
    // it ('Should publish changed array value', () => {
    //     const a = observable([1, 2, 3])
    //     a.$subscribe((next: number[]) => {
    //         console.log(next)
    //     })
    //     a.$value = []
    //     expect(a.$value).to.be.deep.eq([])
    // })
    it('Should mix observable', function () {
        var num = src_1.observable(5);
        var arr = src_1.observable([1, 2, 3]);
        var obj = src_1.observable({ a: 1, b: 2, c: 3 });
        var concatNum = [].concat(num);
        var concatArr = [].concat(arr);
        var concatObj = [].concat(obj);
        chai_1.expect(concatNum.length).to.eq(1);
        chai_1.expect(concatArr.length).to.eq(3);
        chai_1.expect(concatObj.length).to.eq(1);
        var m = src_1.mix(src_1.observable({ text: 'Hello' }));
        chai_1.expect(m._raw.length).to.eq(1);
    });
    it('Should observable mix', function () {
        var m = src_1.observable(src_1.mix({ text: 'Hello' }));
        chai_1.expect(typeof m.mix).to.eq('function');
        chai_1.expect(src_1.isMixed(m)).is.true;
        var m2 = new src_1.Mixin(src_1.observable({ text: 'Hello 2' }));
        //        console.log(m2)
        //        console.log((observable({a: 5}) as any).mix)
        src_1.autoTerminalAware(function () {
            chai_1.expect(src_1.isMixed(m2)).is.true;
            chai_1.expect(m2._raw.length).to.eq(1);
        });
    });
    it('Should keep removed entries with subscription', function () {
        var v = src_1.observable({ a: 5, b: 'hello' });
        // init entries
        v.a = 10;
        v.b = 'bye';
        chai_1.expect(lodash_1.size(v._entries)).is.eq(2);
        v.$at('b').$subscribe(function () { });
        v.$value = {};
        console.log(v._entries);
        chai_1.expect(v._entries['a']).is.undefined;
        chai_1.expect(v._entries['b']).is.not.undefined;
    });
    it('Should destroy entries with subscription', function () {
        var v = src_1.observable({ a: 5, b: 'hello' });
        // init entries
        v.a = 10;
        v.b = 'bye';
        v.$at('a').$subscribe(function () { });
        v.$at('b').$subscribe(function () { });
        v.$value = null;
        chai_1.expect(lodash_1.size(v._entries)).is.eq(0);
    });
    it('Should remove array entries', function () {
        var arr = src_1.observable([1, 2, 3, 4, 5], function (v) { return v; });
        arr.$at(0).$subscribe(function () { });
        arr.$at(1).$subscribe(function () { });
        arr.$at(2).$subscribe(function () { });
        arr.$at(3).$subscribe(function () { });
        arr.$at(4).$subscribe(function () { });
        arr.$value = [3, 4, 5];
        chai_1.expect(arr.$value.length).to.be.eq(3);
        chai_1.expect(arr[0]._key).to.be.eq('0');
        chai_1.expect(arr[1]._key).to.be.eq('1');
        chai_1.expect(arr[2]._key).to.be.eq('2');
        chai_1.expect(arr[0]._memoValue).to.be.eq(3);
        chai_1.expect(arr[1]._memoValue).to.be.eq(4);
        chai_1.expect(arr[2]._memoValue).to.be.eq(5);
    });
    // it ('Should not update not indexed entries', () => {
    //     const arr = observable([1,2,5], (v) => v)
    //     const l = arr.length
    // })
});
//# sourceMappingURL=observable.test.js.map