import { expect } from "chai"
import { defaultHtmlFactory, defaultLayout, EventBus, Gear, Html, HtmlBlueprint, HtmlEvents, HtmlOptions, HtmlScope, iterable, observable, patch, pipe, render, Value } from "../src"
import { attachRoot, createTestPatcher, createTestRenderer, immediateRender, immediateTick } from "./utils"




const createHtml = <D, E=unknown, H=any>(o: HtmlOptions<D&HtmlScope, E, H>) : Html<D, E> => {
    const patcher = createTestPatcher()
    const renderer = createTestRenderer()
    const s = new Html<D, E>(o, {
        $patcher: patcher, 
        $renderer: renderer,
        $pipe: pipe(patcher, renderer),
        $defaultFactory: defaultHtmlFactory,
        $defaultLayout: defaultLayout,
//        $vnodeFactory: defaultVNodeFactory
    })
    // s.scope.$engine.chain(s.scope.$renderer)

    // s.scope.$engine.addPostEffect(() => {
    //     s.scope.$renderer.schedule()
    // })

    immediateTick()
    attachRoot(s)

    return s
}





describe ('Html', () => {

    it ('Should render empty nodes', () => {

        const html = createHtml({
            items: []
        })

//        setTimeout(() => {
            expect(html.children.length).to.eq(0)
        //     done()
        // }, 20)
    })

    it ('Should render child nodes', () => {

        const html = createHtml({
            components: {
                a: {},
                b: {}
            }
        })

        immediateRender()

        expect(html.vnode).to.deep.eq({children: [{key: 'a'}, {key: 'b'}]})

        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a'}, {key: 'b'}]})
        //     done()
        // }, 20)
    })

    it ('Should render dom props', () => {

        const html = createHtml({
            components: {
                a: {
                    dom: {
                        tag: 'hello'
                    }
                }
            }
        })

        immediateRender()

        expect(html.vnode).to.deep.eq({children: [{key: 'a', tag: 'hello'}]})

        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a', tag: 'hello'}]})
        //     done()
        // }, 20)
    })

    it ('Should render ext props', () => {

        const html = createHtml({
            components: {
                a: {
                    css: 'my-class'
                }
            }
        })

        immediateRender()

        expect(html.vnode).to.deep.eq({children: [{key: 'a', className: 'my-class'}]})

        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a', className: 'my-class'}]})
        //     done()
        // }, 10)
    })

    it ('Should render text child nodes', () => {

        const html = createHtml({
            components: {
                a: {
                    text: 'foo'
                }
            }
        })

        immediateRender()

        expect(html.vnode).to.deep.eq({children: [{key: 'a', children: ['foo']}]})

        // setTimeout(() => {
        //     expect(html.vnode).to.deep.eq({children: [{key: 'a', children: ['foo']}]})
        //     done()
        // }, 20)
    })


    it ('Should render shared components', () => {

        const portal = observable([])

        const onUpdate = (portal as any).$event('update')

        const html = createHtml<{portal: HtmlBlueprint[]}, {update: () => boolean}>({
            components: {
                a: {
                    components: {
                        c: {
                            injections: {
                                portal: () => portal
                            },
                            events: {
                                update: (isOpen, {portal}) => {
                                    portal.$value = isOpen ? [{text: 'Hello'}, {}] : []
                                }
                            }
                        }
                    }
                },
                b: {
                    injections: {
                        portal: () => portal,
                    },
                    reactions: {
                        portal: (v) => patch({items: v})
                    }
                }
            }
        });

        immediateRender()

        expect(html.vnode).to.deep.eq({
            children: [{
                key: 'a',
                children: [{key: 'c'}]
            }, {
                key: 'b'
            }]
        })
        onUpdate(true)

        immediateTick()
        immediateRender()

        expect(html.vnode).to.deep.eq({
            children: [{
                key: 'a',
                children: [{key: 'c'}]
            }, {
                key: 'b',
                children: [{key: 0, children: ['Hello']}, {key: 1}]
            }]
        })
        onUpdate(false)

        immediateTick()
        immediateRender()

        expect(html.vnode).to.deep.eq({
            children: [{
                key: 'a',
                children: [{key: 'c'}]
            }, {
                key: 'b',
            }]
        })


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
    })

    it ('Should render shared components', () => {

        const portal = observable([])

        const html = createHtml<{portal: Gear[]}, HtmlEvents>({
            injections: {
                portal: () => portal
            },
            components: {
                a: {
                    items: [{}, 'Hello'],
                    childFilter: () => false,
                    events: {
                        afterSyncIndexed: (items, {portal}) => {
                            portal.$value = items
                        }
                    }
                },
                b: {
                    reactions: {
                        portal: (v) => patch({items: v})
                    }
                }
            }
        });

        immediateRender()

        console.log(html.vnode)

        // setTimeout(() => {
        //     console.log(html.vnode)
        //     done()
        // }, 20)

    })



    describe ('Render', () => {

        it ('Should render new nodes', () => {

            const html = createHtml<{data: any[], __it: any[]}>({
                injections: {
                    data: () => observable([]),
                    __it: $ => iterable($.data),
                },
                reactions: {
                    __it: v => patch({items: v})
                }
            })

            html.scope.data.$value = [{id: 1}, {id: 2}, {id: 3}]
            immediateTick()

            // let commands = [] as any[]
            // render(html, {children: html.children}, commands)
            // console.log(commands)

            // html.scope.data.$value = [{id: 2}, {id: 1}, {id: 3}]
            // immediateTick()

            // commands = []
            // render(html, {children: html.children}, commands)
            // console.log(commands)

        })


    })


})