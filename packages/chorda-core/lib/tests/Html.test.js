"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../src");
var utils_1 = require("./utils");
var createHtml = function (o) {
    var s = new src_1.Html(o, {
        $engine: utils_1.createPatchScheduler(),
        $renderer: utils_1.createRenderScheduler(),
        $pipe: null,
        $defaultFactory: src_1.defaultHtmlFactory,
        $defaultLayout: src_1.defaultLayout,
        //        $vnodeFactory: defaultVNodeFactory
    });
    // s.scope.$engine.chain(s.scope.$renderer)
    // s.scope.$engine.addPostEffect(() => {
    //     s.scope.$renderer.schedule()
    // })
    utils_1.immediateTick();
    utils_1.attachRoot(s);
    return s;
};
describe('Html', function () {
    it('Should render empty nodes', function (done) {
        var html = createHtml({
            items: []
        });
        setTimeout(function () {
            chai_1.expect(html.children.length).to.eq(0);
            done();
        }, 20);
    });
    it('Should render child nodes', function () {
        var html = createHtml({
            components: {
                a: {},
                b: {}
            }
        });
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({ children: [{ key: 'a' }, { key: 'b' }] });
        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a'}, {key: 'b'}]})
        //     done()
        // }, 20)
    });
    it('Should render dom props', function () {
        var html = createHtml({
            components: {
                a: {
                    dom: {
                        tag: 'hello'
                    }
                }
            }
        });
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({ children: [{ key: 'a', tag: 'hello' }] });
        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a', tag: 'hello'}]})
        //     done()
        // }, 20)
    });
    it('Should render ext props', function () {
        var html = createHtml({
            components: {
                a: {
                    css: 'my-class'
                }
            }
        });
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({ children: [{ key: 'a', className: 'my-class' }] });
        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a', className: 'my-class'}]})
        //     done()
        // }, 10)
    });
    it('Should render text child nodes', function () {
        var html = createHtml({
            components: {
                a: {
                    text: 'foo'
                }
            }
        });
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({ children: [{ key: 'a', children: ['foo'] }] });
        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a', children: ['foo']}]})
        //     done()
        // }, 20)
    });
    it('Should render shared components', function () {
        var portal = src_1.observable([]);
        var onUpdate = portal.$event('update');
        var html = createHtml({
            components: {
                a: {
                    components: {
                        c: {
                            injections: {
                                portal: function () { return portal; }
                            },
                            events: {
                                update: function (isOpen, _a) {
                                    var portal = _a.portal;
                                    portal.$value = isOpen ? [{ text: 'Hello' }, {}] : [];
                                }
                            }
                        }
                    }
                },
                b: {
                    injections: {
                        portal: function () { return portal; },
                    },
                    reactions: {
                        portal: function (v) { return src_1.patch({ items: v }); }
                    }
                }
            }
        });
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({
            children: [{
                    key: 'a',
                    children: [{ key: 'c' }]
                }, {
                    key: 'b'
                }]
        });
        onUpdate(true);
        utils_1.immediateTick();
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({
            children: [{
                    key: 'a',
                    children: [{ key: 'c' }]
                }, {
                    key: 'b',
                    children: [{ key: 0, children: ['Hello'] }, { key: 1 }]
                }]
        });
        onUpdate(false);
        utils_1.immediateTick();
        utils_1.immediateRender();
        chai_1.expect(html.vnode).to.deep.eq({
            children: [{
                    key: 'a',
                    children: [{ key: 'c' }]
                }, {
                    key: 'b',
                }]
        });
        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({
        //         children: [{
        //             key: 'a',
        //             children: [{key: 'c'}]
        //         }, {
        //             key: 'b'
        //         }]
        //     })
        //     onUpdate(true)
        //     immediateTick()
        //     setTimeout(() => {
        //         expect(html.vnode).to.deep.eq({
        //             children: [{
        //                 key: 'a',
        //                 children: [{key: 'c'}]
        //             }, {
        //                 key: 'b',
        //                 children: [{key: 0, children: ['Hello']}, {key: 1}]
        //             }]
        //         })
        //         onUpdate(false)
        //         immediateTick()
        //         setTimeout(() => {
        //             expect(html.vnode).to.deep.eq({
        //                 children: [{
        //                     key: 'a',
        //                     children: [{key: 'c'}]
        //                 }, {
        //                     key: 'b',
        //                 }]
        //             })
        //             done()
        //         }, 20)
        //     }, 20)
        // }, 20)
    });
    it('Should render shared components', function () {
        var portal = src_1.observable([]);
        var html = createHtml({
            injections: {
                portal: function () { return portal; }
            },
            components: {
                a: {
                    items: [{}, 'Hello'],
                    childFilter: function () { return false; },
                    events: {
                        afterSyncIndexed: function (items, _a) {
                            var portal = _a.portal;
                            portal.$value = items;
                        }
                    }
                },
                b: {
                    reactions: {
                        portal: function (v) { return src_1.patch({ items: v }); }
                    }
                }
            }
        });
        utils_1.immediateRender();
        console.log(html.vnode);
        // setTimeout(() => {
        //     console.log(html.vnode)
        //     done()
        // }, 20)
    });
});
//# sourceMappingURL=Html.test.js.map