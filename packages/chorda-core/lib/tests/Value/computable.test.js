"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../../src");
describe('computable', function () {
    it('Should recompute on publish', function () {
        var v = src_1.computable(function () { return 2 + 7; });
        chai_1.expect(v._memoValue).is.undefined;
        v.$publish(null);
        chai_1.expect(v.$value).to.be.eq(9);
    });
    it('Should recompute on value get', function () {
        var v = src_1.computable(function () { return 2 + 7; });
        chai_1.expect(v._memoValue).is.undefined;
        chai_1.expect(v.$value).to.be.eq(9);
    });
    it('Should safe compute null', function () {
        var v = src_1.computable(function () { return null; });
        v.$publish(null);
    });
    it('Should subscribe to observable expression', function () {
        var x = src_1.observable(2);
        var y = src_1.observable(7);
        var v = src_1.computable(function () { return x + y; });
        var updates = [];
        v.$subscribe(function (next) { return updates.push(next); });
        //v.$value = 10
        //v.$touch({$publish: () => {}})
        chai_1.expect(v.$value).to.be.eq(9);
        //expect(updates).to.deep.eq([9])
        chai_1.expect(x._subscriptions.length).to.eq(1);
        x.$value = 100;
        chai_1.expect(v.$value).to.be.eq(107);
        chai_1.expect(updates).to.deep.eq([107]);
        chai_1.expect(x._subscriptions.length).to.eq(1);
    });
    it('Should subscribe to observable expression with nested', function () {
        var x = src_1.observable({ address: { postCode: 123 } });
        var y = src_1.observable(7);
        var v = src_1.computable(function () { return x.address.postCode == y; });
        var updates = [];
        v.$subscribe(function (next) { return updates.push(next); });
        chai_1.expect(v.$value).to.be.eq(false);
        //            expect(updates).to.deep.eq([false])
        y.$value = 123;
        chai_1.expect(v.$value).to.be.eq(true);
        chai_1.expect(updates).to.deep.eq([true]);
    });
    it('Should break looped update cycle', function () {
        var a;
        var b;
        a = src_1.computable(function () { return b + 1; }, 0);
        b = src_1.computable(function () { return a + 1; }, 0);
        chai_1.expect(+a).to.be.equal(2);
        chai_1.expect(+b).to.be.equal(1);
    });
    it('Should resubscribe to removed publisher', function (done) {
        var a = src_1.observable({
            address: {
                city: {
                    postCode: 123
                }
            }
        });
        var b = src_1.computable(function () {
            return "Post code: " + a.address.city.postCode;
        });
        setTimeout(function () {
            chai_1.expect(b.$value).to.eq('Post code: 123');
            a.$value = {
                address: {
                    city: {
                        postCode: 456
                    }
                }
            };
            setTimeout(function () {
                chai_1.expect(b.$value).to.eq('Post code: 456');
                done();
            });
        });
    });
});
//# sourceMappingURL=computable.test.js.map