import { expect } from 'chai'
import { Blueprint, defaultGearFactory, Gear, GearOptions, observable, patch, mixin, mix, iterable } from '../src'
import { createEngine, immediateTick, nextTick } from './utils'
import * as _ from 'lodash'


type TestScope = {
    data: string
    name: string
}

type TestEvents = {
    hello: {
        name: string
    }
}


const createGear = <D>(o: Blueprint<D>) : Gear<D> => {
    const s = new Gear<D>(o as GearOptions, {$engine: createEngine(), $defaultFactory: defaultGearFactory} as any)
    immediateTick()
    return s
}

const createGearList = <T>(list: any[]) : Gear<T> => {
    return createGear<any>({
        defaultItem: {
            injectors: {               
                name: (ctx) => (ctx as any).__it.$value
            }
        },
        reactors: {
            items: (v) => {
//                console.log('new value', iterator(v, ''))
                return patch({items: v})
            }
        },
        injectors: {
            items: () => iterable(list)
        }
    })
}


const toNames = (itm: Gear) => itm.scope.name




describe ('Gear', () => {

    describe ('Scope', () => {

        it ('Should iterate through nested scope', () => {

            const g = createGear({
                components: {
                    a: {
                        components: {
                            b: {
                                injectors: {
                                    x: () => 1,
                                    y: () => 2
                                }
                            }
                        }
                    }
                }
            })

            const result = []


            console.log('--------------------------------')

            for (let k in g.components['a'].components['b'].scope) {
                result.push(k)
            }

            console.log(g._local)
            console.log(g.components['a']._local)
            console.log(g.components['a'].components['b']._local)

        })

        it ('Should inject nested property in nested', () => {

            const profile = observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            })

            const h = createGear<{profile: any, postCode: any}>({
                injectors: {
                    profile: () => profile
                },
                components: {
                    a: {
                        injectors: {
                            postCode: (scope) => scope.profile.address.city.postCode
                        }
                    }
                }
            })

            console.log(h.components['a'].scope.postCode)
            //expect(h.scope.postCode).not.instanceOf(Number)

        })

        it ('Should redefine nested scope entry with the same name', () => {

            const g = createGear({
                injectors: {
                    data: () => observable({x: 7})
                },
                components: {
                    a: {
                        injectors: {
                            data: (scope) => (scope.data as any).x
                        }
                    }
                }
            })

            g.components['a'].scope.data

        })

    })

    describe ('Keyed components', () => {

        it ('Should create components', () => {

            const g = createGear({
                components: {
                    a: {}
                }
            })

            const a = g.components['a']

            expect(a).is.exist
            expect(a.parent).to.eq(g)
            expect(a.key).to.eq('a')
        })

        it ('Should create component with template', () => {

            const g = createGear({
                templates: {
                    a: {
                        name: 'default'
                    }
                },
                components: {
                    a: {}
                }
            })

            expect(g.components['a'].options.name).to.eq('default')
        })

        it ('Should create component from template by default', () => {

            const g = createGear({
                templates: {
                    a: {}
                }
            })

            expect(g.components['a']).is.not.null
        })

        it ('Should create components from value', () => {

            const v = observable({
                a: {},
                b: {}
            })

            const g = createGear({})
            g.patch({components: v as any})

            immediateTick()

            expect(g.components['a']).is.not.null
            expect(g.components['b']).is.not.null
        })

        it ('Shoud not create undefined templates', () => {

            const g = createGear({
                templates: {
                    content: undefined
                }
            })

            expect(g.children.length).to.eq(0)

        })

        it ('Should create nested component from observable mixed', () => {

            const g = createGear({
            })

            const observableMix = observable(mix({
                name: 'Test'
            }))

            g.patch({
                components: {
//                    a: observableMix,
                    b: observable({name: 'Test B'})
                }
            })

            immediateTick()

            // expect(g.components['a']).is.exist
            // expect(g.components['a'].options.name).to.eq('Test')

            expect(g.components['b']).is.exist
            expect(g.components['b'].options.name).to.eq('Test B')

        })
    })



    describe ('Indexed components', () => {

        it ('Should create items empty', () => {

            const g = createGear({
                items: []
            })

            expect(g.items.length).to.eq(0)
        })

        it ('Should create items', () => {

            const g = createGear({
                items: [{}, {}, {}]
            })

            expect(g.items.length).to.eq(3)

            const itm = g.items[0]
            expect(itm).is.exist
            expect(itm.parent).to.eq(g)
            expect(itm.index).to.equal(0)
        })

        it ('Should create items from mixed', () => {

            const g = createGear({
                items: [mixin({}, {}), mixin(() => null)]
            })

            expect(g.items.length).to.eq(1)

        })

        it ('Should sync items', () => {

            const g = createGear({
                items: [{}, {}, {}]
            })

            expect(g.items.length).to.eq(3)

            g.patch({
                items: [{}, {}]
            })

            g.scope.$engine.immediate()

            expect(g.items.length).to.eq(2)
        })

        it ('Should remove item', () => {

            const g = createGear({
                items: [{}, {}, {}]
            })

            expect(g.items.length).to.eq(3)

            g.items[1].destroy()

            expect(g.items.length).to.eq(2)
        })

        it ('Should create item with defaultOptions', () => {

            const g = createGear({
                defaultItem: {
                    name: 'hello'
                },
                items: [{}]
            })

            expect(g.items[0].options.name).to.eq('hello')
        })

        it ('Should create items from value', () => {

            const v = observable([{}, {}, {}])

            const g = createGear({})
            g.patch({items: v as any})

            immediateTick()

            expect(g.items.length).to.eq(3)
        })

    })

    describe ('Dynamic keyed', () => {

        it ('Should create components from iterator', () => {

            const g = createGear({
                injectors: {
                    data: () => iterable({a: 'a', b: 'b', c: 'c'})
                },
                reactors: {
                    data: (v) => patch({components: v})
                }
            })

            expect(_.size(g.components)).to.eq(3)
            expect(g.components['a'].scope.data).is.exist
            expect(g.components['a'].scope.__it).is.exist
        })

        it ('Should change iterable components [ADD]', () => {

            const v = observable({})

            const g = createGear({
                injectors: {
                    data: () => iterable(v)
                },
                reactors: {
                    data: (v) => patch({components: v})
                }
            })

            expect(_.size(g.components)).to.eq(0)

            v.$value = {a: 'test'}

            g.scope.$engine.immediate()

            expect(_.size(g.components)).to.eq(1)
        
        })

        it ('Should change iterable components [UPD]', () => {

            const v = observable({a: 1, b: 2})

            const g = createGear({
                injectors: {
                    data: () => iterable(v)
                },
                reactors: {
                    data: (v) => patch({components: v})
                }
            })

            expect(_.size(g.components)).to.eq(2)

            v.$value = {a: 5, b: 7}

            g.scope.$engine.immediate()

            expect(_.size(g.components)).to.eq(2)
        
        })

        it ('Should change iterable components [DEL]', () => {

            const v = observable({a: 1, b: 2})

            const g = createGear({
                injectors: {
                    data: () => iterable(v)
                },
                reactors: {
                    data: (v) => patch({components: v})
                }
            })

            expect(_.size(g.components)).to.eq(2)

            v.$value = {a: 5} as any

            g.scope.$engine.immediate()

            expect(_.size(g.components)).to.eq(1)
        
        })

    })

    describe ('Dynamic indexed', () => {

        it ('Should create list', () => {

            const gear = createGearList([1,2,3,4,5])

            expect(gear.items.length).to.be.eq(5)
        })

        it ('Should clear list', () => {

            const gear = createGearList([1,2,3,4,5])
            gear.scope.items.$value = []

            gear.scope.$engine.immediate()

            expect(gear.items.length).to.be.eq(0)
        })

        it ('Should revert list', () => {

            const gear = createGearList([1,2,3,4,5])
            gear.scope.items.$value = [5,4,3,2,1]

            gear.scope.$engine.immediate()

            expect(gear.items.length).to.be.eq(5)
            expect(gear.items.map(toNames)).to.be.deep.eq([5,4,3,2,1])
        })

        it ('Should add items to list', () => {

            const gear = createGearList([1,2,3])
            gear.scope.items.$value = [1,2,3,4,5]

            gear.scope.$engine.immediate()

            expect(gear.items.length).to.be.eq(5)
            expect(gear.items.map(toNames)).to.be.deep.eq([1,2,3,4,5])
        })

        it ('Should remove items from list', () => {

            const gear = createGearList([1,2,3,4,5])
            gear.scope.items.$value = [3,4,5]

            gear.scope.$engine.immediate()

            expect(gear.items.length).to.be.eq(3)
            expect(gear.items.map(toNames)).to.be.deep.eq([3,4,5])
        })

    })

    describe ('Compositions', () => {

        it ('Should create keyed groups', () => {

            const g = createGear({
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
            })

        })

        it ('Should create indexed groups', () => {

            const g = createGear({
                items: [
                    {components: {a: {}, b: {}}},
                    {components: {c: {}, d: {}}},
                    {components: {e: {}, f: {}}},
                ]
            })

        })

        it ('Should sort children by weight and index', () => {

            const g = createGear({
                components: {
                    a: {weight: -1},
                    b: {weight: 1}
                },
                items: [{}, {}, {}]
            })

            const keys = g.children.map(child => child.key == null ? child.index : child.key)
            expect(keys).to.deep.eq(['a', 0, 1, 2, 'b'])

        })


    })


})


