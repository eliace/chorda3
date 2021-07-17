import { expect } from 'chai'
import { isArrayLike } from 'lodash'
import { describe } from 'mocha'
import { observable, ObservableValue, Value, ValueSet, ObservableValueSet, isObservable, autoTerminalAware, spyGetters, spySubscriptions, Observable, computable, PublishFunc, iterator, EventBus, ObservableNode, mix, Mixin, isMixed, Mixed} from '../src'


type Data = {
    a?: string
    b?: number
}


const subscribeToAllOf = (v: ObservableValueSet<any>, subscriber: PublishFunc<any>) => {
    v.$subscribe(subscriber)
    if (!v.$isTerminal) {
        v.$each(itm => {
            subscribeToAllOf(itm, subscriber)
        })    
    }
}




describe ('Value', () => {

    describe ('bus', () => {

        it ('Should on and emit event', () => {
            
            const v : EventBus = observable(null)

            const result: any[] = []
    
            v.$on('test', (s: string) => {
                result.push(s)
            })
    
            v.$emit('test', 'hello')
    
    
            expect(result).to.deep.eq(['hello'])
    
        })


        it ('Should define and emit event', () => {
            
            const v : EventBus = observable(null)

            const result: any[] = []
    
            v.$on('test', (s: string) => {
                result.push(s)
            })

            const test = v.$event('test')
    
            test('hi')
    
            expect(result).to.deep.eq(['hi'])
    
        })

        it ('Should define and check event', () => {

            const v : EventBus = observable(null)

            v.$event('test')

            expect(v.$hasEvent('test')).to.be.true

        })

    })

    describe ('observable', () => {

        it ('Should set and get value', () => {

            const v: Value<number> = observable(0)
            v.$value = 5
    
            expect(v.$value).to.be.eq(5)
        })
    
        it ('Should subscribe changes', () => {
    
            const changes: any[] = []
            
            const v: ObservableValue<number> = observable(0)
            v.$subscribe((next: number) => {
                changes.push(next)
            })
    
            v.$value = 5
            v.$value = 12
    
            expect(changes).to.be.deep.eq([5, 12])
        })
    
        it ('Should not duplicate subscriptions', () => {

            const a: ObservableValue<number> = observable(null)
            const b: ObservableValue<number> = observable(null)

            a.$subscribe(b)
            a.$subscribe(b)

            expect((a as any)._subscriptions.length).to.be.eq(1)

            a.$unsubscribe(b)

            const sub = () => {}

            a.$subscribe(sub)
            a.$subscribe(sub)

            expect((a as any)._subscriptions.length).to.be.eq(1)
        })
    
        it ('Should process value publish', () => {
    
            const v: ObservableValue<number> = observable(10)
    
            v.$publish(12)
    
            expect(v.$value).to.be.eq(12)
        })
    
        it ('Should get entry at key', () => {
    
            const v: Value<Data> = observable({
                a: 'Alice',
                b: 10
            })
    
            const a = (v as ValueSet<Data>).$at('a')
            const b = (v as ValueSet<Data>).$at('b')
    
            expect(a.$value).to.be.eq('Alice')
            expect(b.$value).to.be.eq(10)
        })
    
        it ('Should proxy property get', () => {

            const v: Data = observable({
                a: 'Alice',
                b: 10
            })
    
            expect(isObservable(v.a)).to.be.true
            expect(isObservable(v.b)).to.be.true
            expect((v.a as any).$value).to.be.eq('Alice')
            expect((v.b as any).$value).to.be.eq(10)
        })
    
        it ('Should proxy property set', () => {
            
            const v: Data = observable({
                a: 'Alice',
                b: 10
            })
    
            v.a = 'Bob'
            v.b = 15
    
            expect((v.a as any).$value).to.be.eq('Bob')
            expect((v.b as any).$value).to.be.eq(15)
        })
    
        it ('Should auto terminal get values', () => {
            autoTerminalAware(() => {
    
                const v = observable({
                    a: 'Alice',
                    b: 10
                })
    
                expect(v.a).to.be.eq('Alice')
                expect(v.b).to.be.eq(10)
            })
        })
    
        it ('Should spy value getters', () => {
    
            const v: Value<Data> = observable({
                a: 'Alice',
                b: 10
            })
    
            const v2: Value<Data> = observable({
                a: 'Bob',
                b: 25
            })
    
            const getters = spyGetters(() => {
                const s = v.$value
                const n = v2.$value
            })
    
            expect(getters.length).to.be.eq(2)
        })
    
        it ('Should spy value subscriptions', () => {
    
            const v: ObservableValueSet<Data> = observable({
                a: 'Alice',
                b: 10
            })

            const subscriptions = spySubscriptions(() => {
                v.$at('a').$subscribe((next) => {
                    // any
                })
            })

            expect(subscriptions.length).to.be.eq(1)
        })

        it ('Should notify ascendant and descendant subscribers', () => {

            type ComplexData = {
                name: string
                address: {
                    country: string
                    city: string
                }
            }

            const v: ObservableValueSet<ComplexData> = observable({
                name: 'Alice',
                address: {
                    country: 'Great Britain',
                    city: 'London'
                }
            })

            let updated: any[] = []

            subscribeToAllOf(v, (next) => {
                updated.push(next)
            })

            v.$at('address').$at('city').$value = 'Manchester'

            expect(updated).to.be.deep.eq([
                { name: 'Alice', address: { country: 'Great Britain', city: 'Manchester' } },
                { country: 'Great Britain', city: 'Manchester' },
                'Manchester'
            ])

            updated = []

            v.$at('address').$value = {country: 'Sweden', city: 'Stockholm'}

            expect(updated).to.be.deep.eq([
                'Sweden',
                'Stockholm',
                { name: 'Alice', address: { country: 'Sweden', city: 'Stockholm' } },
                { country: 'Sweden', city: 'Stockholm' }              
            ])
        })

        it ('Should break looped update cycle', () => {

            let a : ObservableValue<number> = observable(5)
            let b : ObservableValue<number> = observable(8)

            a.$subscribe(b)
            b.$subscribe(a)

            a.$publish(1)

            expect(a.$value).to.be.eq(1)
            expect(b.$value).to.be.eq(1)
        })

        it ('Should call own methods', () => {

            console.log(typeof observable(5))

            const a = observable([1, 2, 3])
            //console.log(JSON.stringify(a))

            const result: number[] = []

            a.forEach(v => {
                result.push(v)
            })

            expect(result.length).to.eq(3)

            const b = observable([4, 5, 6])

            const c = a.concat(b)
            expect(c.length).to.eq(6)

            let d = null
            autoTerminalAware(() => {
                d = a.concat(b)
            })

            expect(d).to.deep.eq([1,2,3,4,5,6])

        })

        // it ('Should publish changed array value', () => {

        //     const a = observable([1, 2, 3])
        //     a.$subscribe((next: number[]) => {
        //         console.log(next)
        //     })


        //     a.$value = []

        //     expect(a.$value).to.be.deep.eq([])

        // })


        it ('Should mix observable', () => {

            const num = observable(5)
            const arr = observable([1, 2, 3])
            const obj = observable({a: 1, b: 2, c: 3})

            const concatNum = [].concat(num)
            const concatArr = [].concat(arr)
            const concatObj = [].concat(obj)

            expect(concatNum.length).to.eq(1)
            expect(concatArr.length).to.eq(3)
            expect(concatObj.length).to.eq(1)


            const m = mix(observable({text: 'Hello'}))

            expect((m as Mixin<any>)._raw.length).to.eq(1)

        })

        it ('Should observable mix', () => {

            const m = observable(mix({text: 'Hello'}))

            
            expect(typeof (m as Mixed<any>).mix).to.eq('function')

            expect(isMixed(m)).is.true

            const m2 = new Mixin(observable({text: 'Hello 2'}))

            console.log(m2)

            console.log((observable({a: 5}) as any).mix)

            autoTerminalAware(() => {
                expect(isMixed(m2)).is.true
                expect(m2._raw.length).to.eq(1)
            })
        })

    })

    describe ('computable', () => {

        it ('Should recompute on publish', () => {

            const v: ObservableValueSet<number> = computable(() => 2 + 7)

            expect(v.$value).is.undefined

            v.$publish(null)

            expect(v.$value).to.be.eq(9)
        })

        it ('Should recompute on next app loop cycle', (done) => {
            const v: ObservableValueSet<number> = computable(() => 2 + 7)
            setTimeout(() => {
                expect(v.$value).to.be.eq(9)
                done()
            })
            expect(v.$value).is.undefined
        })

        it ('Should safe compute null', () => {

            const v: ObservableValueSet<number> = computable(() => null)
            v.$publish(null)
            
        })

        it ('Should subscribe to observable expression', (done) => {

            const x: Value<number>&number = observable(2)
            const y: number = observable(7)

            const v: ObservableValue<number> = computable(() => x + y)

            const updates: any[] = []
            v.$subscribe((next) => updates.push(next))

            v.$touch({$publish: () => {}})

            setTimeout(() => {
                expect(v.$value).to.be.eq(9)
                expect(updates).to.deep.eq([9])
                expect((x as any)._subscriptions.length).to.eq(1)

                x.$value = 100

                expect(v.$value).to.be.eq(107)
                expect(updates).to.deep.eq([9, 107])
                expect((x as any)._subscriptions.length).to.eq(1)

                done()
            })
        })

        it ('Should subscribe to observable expression with nested', (done) => {

            const x = observable({address: {postCode: 123}})
            const y: Value<number>&number = observable(7)

            const v: ObservableValue<boolean> = computable(() => x.address.postCode == y)

            const updates: any[] = []
            v.$subscribe((next) => updates.push(next))

            setTimeout(() => {
                expect(v.$value).to.be.eq(false)
                expect(updates).to.deep.eq([false])

                y.$value = 123

                expect(v.$value).to.be.eq(true)
                expect(updates).to.deep.eq([false, true])

                done()
            })
        })


        it ('Should break looped update cycle', (done) => {

            let a: number
            let b: number

            a = computable(() => b + 1, 0)
            b = computable(() => a + 1, 0)

            setTimeout(() => {
                expect(+a).to.be.equal(3)
                expect(+b).to.be.equal(2)
                done()
            })

        })

        it ('Should resubscribe to removed publisher', (done) => {

            const a = observable({
                address: {
                    city: {
                        postCode: 123
                    }
                }
            })
            const b = computable(() => {
                return `Post code: ${a.address.city.postCode}`
            })

            setTimeout(() => {
                expect(b.$value).to.eq('Post code: 123')

                a.$value = {
                    address: {
                        city: {
                            postCode: 456
                        }
                    }
                }

                setTimeout(() => {
                    expect(b.$value).to.eq('Post code: 456')
                    done()
                })

            })

        })        

    })

    describe ('Iterator', () => {

        it ('Should iterate array', () =>{

            const v: number[] = observable([1, 2, 3])

            const it = iterator(v)

            const a: Value<number>[] = []

            let result = it.next()
            while(!result.done) {
                a.push(result.value)

                result = it.next()
            }

            expect(a.length).to.eq(3)
            expect(a.map(v => v.$uid)).to.deep.eq(['1', '2', '3'])
        })

        it ('Should iterate objects', () => {

            const v: {a: number, b: number, c: number} = observable({a: 1, b: 2, c: 3})

            const it = iterator(v)

            const a: Value<any>[] = []

            let result = it.next()
            while(!result.done) {
                a.push(result.value)
                result = it.next()
            }

            expect(a.length).to.eq(3)
            expect(a.map(v => v.$uid).sort()).to.deep.eq(['1', '2', '3'])
        })

        it ('Should ignore null source', () => {

            const it = iterator(null)

            expect(it.next().done).is.true

        })

        it ('Should use default iterator key', () => {

            const it = iterator([])

            expect(it.$name).to.eq('__it')
            
        })

        it ('Should', () => {


            const context : any = {
                a: 1,
                b: 2
            }

            const obj : any = {}

            const p = new Proxy(obj, {
                get: (target, p) : any => {
                    return (target as any)[p] || context[p]
                },
                set: (target, p, value) : boolean => {
                    (target as any)[p] = value
                    return true
                },
                ownKeys: (target) : ArrayLike<string|symbol> => {
                    console.log('ownKeys')
                    return ['a', 'b']
                },
                has: (target, p) : boolean => {
                    console.log('has', p)
                    return true
                },
                getOwnPropertyDescriptor: (target, p) => {
                    console.log('descriptor', p)
                    return Reflect.getOwnPropertyDescriptor(context, p)
                }
            })

            for (let k in p) {
                console.log('key', k)
            }

        })

    })

})
