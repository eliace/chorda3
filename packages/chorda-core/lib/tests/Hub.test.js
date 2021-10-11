"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../src");
var utils_1 = require("./utils");
var createHub = function (o) {
    var s = new src_1.Hub(o, { $engine: utils_1.createPatchScheduler(), $pipe: null });
    utils_1.immediateTick();
    return s;
};
describe('Hub', function () {
    describe('Scope', function () {
        it('Should iterate through scope entries', function () {
            var s = createHub({
                injections: {
                    a: function () { return 5; },
                    b: function () { return 'hello'; }
                }
            });
            var result = [];
            for (var k in s.scope) {
                result.push(k);
            }
            chai_1.expect(result.sort()).to.deep.eq(['$engine', '$pipe', 'a', 'b']);
        });
        it('Should set value with setter', function () {
            var s = createHub({
                injections: {
                    a: function () { return 5; },
                    b: function () { return src_1.observable('hello'); }
                }
            });
            var scope = s.scope;
            scope.a = 10;
            scope.b = 'bye';
            chai_1.expect(s.scope.a).to.eq(10);
            chai_1.expect(s.scope.b.$value).to.eq('bye');
        });
    });
    describe('Injectors + reactions', function () {
        it('Should be initialized with empty options', function () {
            var s = createHub({});
            chai_1.expect(s.state).to.be.eq(src_1.State.Initialized);
        });
        it('Should be initialized with injections', function () {
            var s = createHub({
                injections: {
                    _injector: function () { return 'Alice'; },
                    _undefined: undefined,
                    _null: null,
                }
            });
            chai_1.expect(s.state).to.be.eq(src_1.State.Initialized);
            chai_1.expect(s.scope['_injector']).to.be.eq('Alice');
        });
        it('Should bind changed array', function () {
            var s = createHub({
                injections: {
                    name: function () { return src_1.observable([1, 2, 3]); }
                },
                reactions: {
                    name: function (v) {
                        //                    console.log(v)
                    }
                }
            });
            chai_1.expect(s.scope.name.$value).to.deep.eq([1, 2, 3]);
            s.scope.name.$value = [];
            chai_1.expect(s.scope.name.$value).to.deep.eq([]);
        });
        it('Should bind reactor without injector', function () {
            var s = createHub({
                reactions: {
                    name: function (v) { }
                }
            });
        });
        it('Should inject terminal', function () {
            var profile = src_1.observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            });
            var s = createHub({
                injections: {
                    postCode: function () { return profile.address.city.postCode; }
                }
            });
            chai_1.expect(s.scope.postCode).is.exist;
            chai_1.expect(s.scope.postCode.$at).is.exist;
        });
        it('Should inject referenced observable and computable', function (done) {
            var profile = src_1.observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            });
            var h = createHub({
                injections: {
                    postCode: function () { return profile.address.city.postCode; },
                    reverted: function (scope) { return src_1.computable(function () {
                        //                        console.log(scope.postCode)
                        return scope.postCode == 123;
                    }); }
                }
            });
            // явная инициализация инжектора
            h.scope.reverted;
            setTimeout(function () {
                chai_1.expect(typeof h.scope.postCode.$publish).is.exist;
                // console.log(h.scope.reverted)
                // //            profile.address.city.postCode = 321
                //             expect(h.scope.postCode).is.exist
                //console.log(h.scope.postCode)
                //             expect(h.scope.postCode).not.instanceOf(Number)
                done();
            });
        });
    });
    describe('Events', function () {
        it('Should subscibe and emit event', function () {
            var result = [];
            var v = src_1.observable(null);
            v.$event('test');
            var hub = createHub({
                injections: {
                    data: function () { return v; }
                },
                events: {
                    data: {
                        test: function () {
                            result.push('ok');
                        }
                    }
                }
            });
            v.$emit('test');
            chai_1.expect(v.$hasEvent('test')).is.true;
            chai_1.expect(hub.handlers.length).is.eq(1);
            chai_1.expect(result).to.deep.eq(['ok']);
        });
    });
    describe('Joints', function () {
        it('Should join custom subscription', function () {
            var result = [];
            var s = createHub({
                injections: {
                    name: function () { return src_1.observable('Alice'); }
                },
                joints: {
                    init: function (_a) {
                        var name = _a.name;
                        name.$subscribe(function (v) {
                            result.push(v);
                        });
                    }
                }
            });
            s.scope.name.$value = 'Bob';
            chai_1.expect(result).to.deep.eq(['Alice', 'Bob']);
        });
        it('Should call disjoin handler', function () {
            var result = [];
            var s = createHub({
                injections: {
                    name: function () { return src_1.observable('Alice'); }
                },
                joints: {
                    init: function (_a) {
                        var name = _a.name;
                        return function () {
                            result.push('ok');
                        };
                    }
                }
            });
            s.destroy();
            chai_1.expect(result).to.deep.eq(['ok']);
        });
        it('Should defer disjoin', function (done) {
            var s = createHub({
                injections: {
                    name: function () { return src_1.observable('Alice'); }
                },
                joints: {
                    init: function (name) { return function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve(null);
                            });
                        });
                    }; }
                }
            });
            s.destroy();
            chai_1.expect(s.scope).not.to.deep.eq(null);
            setTimeout(function () {
                chai_1.expect(s.scope).to.deep.eq(null);
                done();
            });
        });
    });
});
//# sourceMappingURL=Hub.test.js.map