import { expect } from "chai"
import { defaultHtmlFactory, defaultLayout, EventBus, Gear, Html, HtmlBlueprint, HtmlEvents, HtmlOptions, HtmlScope, iterator, observable, patch, Value } from "../src"
import { attachRoot, createEngine, createRenderer, defaultVNodeFactory, nextFrame, nextTick } from "./utils"




const createHtml = <D extends {}, E=unknown>(o: HtmlOptions<D, E&HtmlEvents>) : Html<D, E> => {
    const s = new Html<D, E>(o, {
        $engine: createEngine(), 
        $renderer: createRenderer(), 
        $defaultFactory: defaultHtmlFactory,
        $defaultLayout: defaultLayout,
        $vnodeFactory: defaultVNodeFactory
    })
    s.scope.$engine.chain(s.scope.$renderer)

    s.scope.$engine.addPostEffect(() => {
        s.scope.$renderer.schedule()
    })

    nextTick()
    attachRoot(s)

    return s
}





describe ('Html', () => {

    it ('Should render empty nodes', (done) => {

        const html = createHtml({
            items: []
        })

        setTimeout(() => {
            expect(html.children.length).to.eq(0)
            done()
        }, 20)
    })

    it ('Should render child nodes', (done) => {

        const html = createHtml({
            components: {
                a: {},
                b: {}
            }
        })

        setTimeout(() => {
            expect(html.vnode).to.deep.eq({children: [{key: 'a'}, {key: 'b'}]})
            done()
        }, 20)
    })

    it ('Should render dom props', (done) => {

        const html = createHtml({
            components: {
                a: {
                    dom: {
                        tag: 'hello'
                    }
                }
            }
        })

        setTimeout(() => {
            expect(html.vnode).to.deep.eq({children: [{key: 'a', tag: 'hello'}]})
            done()
        }, 20)
    })

    it ('Should render ext props', (done) => {

        const html = createHtml({
            components: {
                a: {
                    css: 'my-class'
                }
            }
        })

        setTimeout(() => {
            expect(html.vnode).to.deep.eq({children: [{key: 'a', className: 'my-class'}]})
            done()
        }, 10)
    })

    it ('Should render text child nodes', (done) => {

        const html = createHtml({
            components: {
                a: {
                    text: 'foo'
                }
            }
        })

        setTimeout(() => {
            expect(html.vnode).to.deep.eq({children: [{key: 'a', children: ['foo']}]})
            done()
        }, 20)
    })


    it ('Should render shared components', (done) => {

        const portal = observable([])

        const onUpdate = (portal as any).$event('update')

        const html = createHtml<{portal: HtmlBlueprint[]}, {update: boolean}>({
            components: {
                a: {
                    components: {
                        c: {
                            injectors: {
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
                    injectors: {
                        portal: () => portal,
                    },
                    reactors: {
                        portal: (v) => patch({items: v})
                    }
                }
            }
        });


        setTimeout(() => {
            expect(html.vnode).to.deep.eq({
                children: [{
                    key: 'a',
                    children: [{key: 'c'}]
                }, {
                    key: 'b'
                }]
            })
            onUpdate(true)
            nextTick()
            setTimeout(() => {
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
                nextTick()
                setTimeout(() => {
                    expect(html.vnode).to.deep.eq({
                        children: [{
                            key: 'a',
                            children: [{key: 'c'}]
                        }, {
                            key: 'b',
                        }]
                    })
                    done()
                }, 20)
            }, 20)
        }, 20)
    })

    it ('Should render shared components', (done) => {

        const portal = observable([])

        const html = createHtml<{portal: Gear[]}>({
            injectors: {
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
                    reactors: {
                        portal: (v) => patch({items: v})
                    }
                }
            }
        });

        setTimeout(() => {
            console.log(html.vnode)
            done()
        }, 20)

    })


})