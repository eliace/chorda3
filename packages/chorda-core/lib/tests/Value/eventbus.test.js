"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../../src");
describe('EventBus', function () {
    it('Should on and emit event', function () {
        var v = src_1.observable(null);
        var result = [];
        v.$on('test', function (s) {
            result.push(s);
        });
        v.$emit('test', 'hello');
        chai_1.expect(result).to.deep.eq(['hello']);
    });
    it('Should define and emit event', function () {
        var v = src_1.observable(null);
        var result = [];
        v.$on('test', function (s) {
            result.push(s);
        });
        var test = v.$event('test');
        test('hi');
        chai_1.expect(result).to.deep.eq(['hi']);
    });
    it('Should define and check event', function () {
        var v = src_1.observable(null);
        v.$event('test');
        chai_1.expect(v.$hasEvent('test')).to.be.true;
    });
});
//# sourceMappingURL=eventbus.test.js.map