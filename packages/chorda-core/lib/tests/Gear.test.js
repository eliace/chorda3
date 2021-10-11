"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../src");
var utils_1 = require("./utils");
var _ = __importStar(require("lodash"));
var createGear = function (o) {
    var s = new src_1.Gear(o, { $engine: utils_1.createPatchScheduler(), $defaultFactory: src_1.defaultGearFactory });
    utils_1.immediateTick();
    return s;
};
var createGearList = function (list) {
    return createGear({
        defaultItem: {
            injections: {
                name: function (ctx) { return ctx.__it; }
            }
        },
        reactions: {
            __it: function (v) {
                //                console.log('new value', iterator(v, ''))
                return src_1.patch({ items: v });
            }
        },
        injections: {
            items: function () { return src_1.observable(list); },
            __it: function (_a) {
                var items = _a.items;
                return src_1.iterable(items);
            }
        }
    });
};
var toNames = function (itm) { return itm.scope.name.$value; };
describe('Gear', function () {
    describe('Scope', function () {
        it('Should iterate through nested scope', function () {
            var g = createGear({
                components: {
                    a: {
                        components: {
                            b: {
                                injections: {
                                    x: function () { return 1; },
                                    y: function () { return 2; }
                                }
                            }
                        }
                    }
                }
            });
            var result = [];
            console.log('--------------------------------');
            for (var k in g.components['a'].components['b'].scope) {
                result.push(k);
            }
            console.log(g._local);
            console.log(g.components['a']._local);
            console.log(g.components['a'].components['b']._local);
        });
        it('Should inject nested property in nested', function () {
            var profile = src_1.observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            });
            var h = createGear({
                injections: {
                    profile: function () { return profile; }
                },
                components: {
                    a: {
                        injections: {
                            postCode: function (scope) { return scope.profile.address.city.postCode; }
                        }
                    }
                }
            });
            console.log(h.components['a'].scope.postCode);
            //expect(h.scope.postCode).not.instanceOf(Number)
        });
        it('Should redefine nested scope entry with the same name', function () {
            var g = createGear({
                injections: {
                    data: function () { return src_1.observable({ x: 7 }); }
                },
                components: {
                    a: {
                        injections: {
                            data: function (scope) { return scope.data.x; }
                        }
                    }
                }
            });
            g.components['a'].scope.data;
        });
    });
    describe('Keyed components', function () {
        it('Should create components', function () {
            var g = createGear({
                components: {
                    a: {}
                }
            });
            var a = g.components['a'];
            chai_1.expect(a).is.exist;
            chai_1.expect(a.parent).to.eq(g);
            chai_1.expect(a.key).to.eq('a');
        });
        it('Should create component with template', function () {
            var g = createGear({
                templates: {
                    a: {
                        name: 'default'
                    }
                },
                components: {
                    a: {}
                }
            });
            chai_1.expect(g.components['a'].options.name).to.eq('default');
        });
        it('Should create component from template by default', function () {
            var g = createGear({
                templates: {
                    a: {}
                }
            });
            chai_1.expect(g.components['a']).is.not.null;
        });
        it('Should create components from value', function () {
            var v = src_1.observable({
                a: {},
                b: {}
            });
            var g = createGear({});
            g.patch({ components: v });
            utils_1.immediateTick();
            chai_1.expect(g.components['a']).is.not.null;
            chai_1.expect(g.components['b']).is.not.null;
        });
        it('Shoud not create undefined templates', function () {
            var g = createGear({
                templates: {
                    content: undefined
                }
            });
            chai_1.expect(g.children.length).to.eq(0);
        });
        it('Should create nested component from observable mixed', function () {
            var g = createGear({});
            var observableMix = src_1.observable(src_1.mix({
                name: 'Test'
            }));
            g.patch({
                components: {
                    //                    a: observableMix,
                    b: src_1.observable({ name: 'Test B' })
                }
            });
            utils_1.immediateTick();
            // expect(g.components['a']).is.exist
            // expect(g.components['a'].options.name).to.eq('Test')
            chai_1.expect(g.components['b']).is.exist;
            chai_1.expect(g.components['b'].options.name).to.eq('Test B');
        });
    });
    describe('Indexed components', function () {
        it('Should create items empty', function () {
            var g = createGear({
                items: []
            });
            chai_1.expect(g.items.length).to.eq(0);
        });
        it('Should create items', function () {
            var g = createGear({
                items: [{}, {}, {}]
            });
            chai_1.expect(g.items.length).to.eq(3);
            var itm = g.items[0];
            chai_1.expect(itm).is.exist;
            chai_1.expect(itm.parent).to.eq(g);
            chai_1.expect(itm.index).to.equal(0);
        });
        it('Should create items from mixed', function () {
            var g = createGear({
                items: [src_1.mixin({}, {}), src_1.mixin(function () { return null; })]
            });
            chai_1.expect(g.items.length).to.eq(1);
        });
        it('Should sync items', function () {
            var g = createGear({
                items: [{}, {}, {}]
            });
            chai_1.expect(g.items.length).to.eq(3);
            g.patch({
                items: [{}, {}]
            });
            utils_1.immediateTick();
            //            g.scope.$engine.immediate()
            chai_1.expect(g.items.length).to.eq(2);
        });
        it('Should remove item', function () {
            var g = createGear({
                items: [{}, {}, {}]
            });
            chai_1.expect(g.items.length).to.eq(3);
            g.items[1].destroy();
            chai_1.expect(g.items.length).to.eq(2);
            chai_1.expect(g.items[0].index).to.eq(0);
            chai_1.expect(g.items[1].index).to.eq(1);
        });
        it('Should create item with defaultOptions', function () {
            var g = createGear({
                defaultItem: {
                    name: 'hello'
                },
                items: [{}]
            });
            chai_1.expect(g.items[0].options.name).to.eq('hello');
        });
        it('Should create items from value', function () {
            var v = src_1.observable([{}, {}, {}]);
            var g = createGear({});
            g.patch({ items: v });
            utils_1.immediateTick();
            chai_1.expect(g.items.length).to.eq(3);
        });
    });
    describe('Dynamic keyed', function () {
        it('Should create components from iterator', function () {
            var g = createGear({
                injections: {
                    data: function () { return src_1.iterable({ a: 'a', b: 'b', c: 'c' }); }
                },
                reactions: {
                    data: function (v) { return src_1.patch({ components: v }); }
                }
            });
            chai_1.expect(_.size(g.components)).to.eq(3);
            chai_1.expect(g.components['a'].scope.data).is.exist;
            chai_1.expect(g.components['a'].scope.__it).is.exist;
        });
        it('Should change iterable components [ADD]', function () {
            var v = src_1.observable({});
            var g = createGear({
                injections: {
                    data: function () { return src_1.iterable(v); }
                },
                reactions: {
                    data: function (v) { return src_1.patch({ components: v }); }
                }
            });
            chai_1.expect(_.size(g.components)).to.eq(0);
            v.$value = { a: 'test' };
            utils_1.immediateTick();
            //            g.scope.$engine.immediate()
            chai_1.expect(_.size(g.components)).to.eq(1);
        });
        it('Should change iterable components [UPD]', function () {
            var v = src_1.observable({ a: 1, b: 2 });
            var g = createGear({
                injections: {
                    data: function () { return src_1.iterable(v); }
                },
                reactions: {
                    data: function (v) { return src_1.patch({ components: v }); }
                }
            });
            chai_1.expect(_.size(g.components)).to.eq(2);
            v.$value = { a: 5, b: 7 };
            utils_1.immediateTick();
            //            g.scope.$engine.immediate()
            chai_1.expect(_.size(g.components)).to.eq(2);
        });
        it('Should change iterable components [DEL]', function () {
            var v = src_1.observable({ a: 1, b: 2 });
            var g = createGear({
                injections: {
                    data: function () { return src_1.iterable(v); }
                },
                reactions: {
                    data: function (v) { return src_1.patch({ components: v }); }
                }
            });
            chai_1.expect(_.size(g.components)).to.eq(2);
            v.$value = { a: 5 };
            utils_1.immediateTick();
            //            g.scope.$engine.immediate()
            chai_1.expect(_.size(g.components)).to.eq(1);
        });
    });
    describe('Dynamic indexed', function () {
        it('Should create list', function () {
            var gear = createGearList([1, 2, 3, 4, 5]);
            chai_1.expect(gear.items.length).to.be.eq(5);
        });
        it('Should clear list', function () {
            var gear = createGearList([1, 2, 3, 4, 5]);
            gear.scope.items.$value = [];
            utils_1.immediateTick();
            //            gear.scope.$engine.immediate()
            chai_1.expect(gear.items.length).to.be.eq(0);
        });
        it('Should revert list', function () {
            var gear = createGearList([1, 2, 3, 4, 5]);
            gear.scope.items.$value = [5, 4, 3, 2, 1];
            utils_1.immediateTick();
            chai_1.expect(gear.items.length).to.be.eq(5);
            chai_1.expect(gear.items.map(toNames)).to.be.deep.eq([5, 4, 3, 2, 1]);
        });
        it('Should add items to list', function () {
            var gear = createGearList([1, 2, 3]);
            gear.scope.items.$value = [1, 2, 3, 4, 5];
            utils_1.immediateTick();
            //            gear.scope.$engine.immediate()
            chai_1.expect(gear.items.length).to.be.eq(5);
            chai_1.expect(gear.items.map(toNames)).to.be.deep.eq([1, 2, 3, 4, 5]);
        });
        it('Should remove items from list', function () {
            var gear = createGearList([1, 2, 3, 4, 5]);
            gear.scope.items.$value = [3, 4, 5];
            utils_1.immediateTick();
            // console.log('NAME', gear.items[0].scope['name'])
            // console.log('NAME', gear.items[1].scope['name'])
            // console.log('NAME', gear.items[2].scope['name'])
            chai_1.expect(gear.items.length).to.be.eq(3);
            chai_1.expect(gear.items.map(function (itm) { return itm.index; })).to.be.deep.eq([0, 1, 2]);
            chai_1.expect(gear.items.map(toNames)).to.be.deep.eq([3, 4, 5]);
        });
    });
    describe('Compositions', function () {
        it('Should create keyed groups', function () {
            var g = createGear({
                components: {
                    group1: {
                        weight: 0,
                        items: [{}, {}]
                    },
                    group2: {
                        weight: 1,
                        items: [{}, {}, {}]
                    }
                }
            });
        });
        it('Should create indexed groups', function () {
            var g = createGear({
                items: [
                    { components: { a: {}, b: {} } },
                    { components: { c: {}, d: {} } },
                    { components: { e: {}, f: {} } },
                ]
            });
        });
        it('Should sort children by weight and index', function () {
            var g = createGear({
                components: {
                    a: { weight: -1 },
                    b: { weight: 1 }
                },
                items: [{}, {}, {}]
            });
            var keys = g.children.map(function (child) { return child.key == null ? child.index : child.key; });
            chai_1.expect(keys).to.deep.eq(['a', 0, 1, 2, 'b']);
        });
    });
});
//# sourceMappingURL=Gear.test.js.map