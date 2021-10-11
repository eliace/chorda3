"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var utils_1 = require("./utils");
var createAndRun = function (o) {
    var s = new src_1.Gear(o, { $engine: utils_1.createPatchScheduler(), $defaultFactory: src_1.defaultGearFactory });
    utils_1.immediateTick();
    return s;
};
describe('Data', function () {
    it('List + Item', function () {
        var List = function (props) {
            return {
                injections: {
                    data: props.data$,
                    __it: function (scope) { return src_1.iterable(scope.data, '_it'); }
                },
                reactions: {
                    data: function (v) { return src_1.patch({ items: v }); }
                },
                defaultItem: Item({
                    injections: {
                        data: function (s) { return s._it; }
                    }
                })
            };
        };
        var Item = function (props) {
            return props;
        };
        var s = createAndRun(List({
            data$: function () { return src_1.observable([1, 2, 3]); },
            item: Item({
                reactions: {
                    data: function (v) { return src_1.patch({ test: v }); },
                }
            })
        }));
    });
    it('Scope narrow', function () {
        var x = {};
        //        x.router.name
    });
    it('Nested events', function () {
        createAndRun({
            events: {
                onLoad: function (e, scope) {
                },
                data: {
                    load: function (e, scope) {
                    }
                }
            }
        });
    });
    // it ('Should narrown collections to items', () => {
    //     const List = <T extends {items: number[]}>(props: Blueprint<T>) : Blueprint<T> => {
    //         return props
    //     }
    //     // const ListToItem = <T>(props: Blueprint<T&{items: number[], item: number}>) : Blueprint<T> => {
    //     //     return props
    //     // }
    //     const Item = <T>(props: Blueprint<T&{item: number}>) : Blueprint<T> => {
    //         return props
    //     }
    //     const s = createAndRun(List({
    //         injections: {
    //             items: () => observable([1, 2, 3])
    //         },
    //         bindings: {
    //             items: (v) => patch({items: stream(v, '@item')})
    //         },
    //         defaultItem: Item({
    //             injections: {
    //             }
    //         })
    //     }))
    // })
});
//# sourceMappingURL=Api.test.js.map