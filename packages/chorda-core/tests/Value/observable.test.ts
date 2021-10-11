import { expect } from "chai"
import { size } from "lodash"
import { autoTerminalAware, isMixed, isObservable, mix, Mixed, Mixin, observable, ObservableValue, ObservableValueSet, PublishFunc, spyGetters, spySubscriptions, Value, ValueSet } from "../../src"

type Data = {
    a?: string
    b?: number
}

const subscribeToAllOf = (v: ObservableValueSet<any>, subscriber: PublishFunc<any>) => {
    v.$subscribe(subscriber)
    if (!v.$isTerminal) {
        v.$ownKeys().forEach(k => {
            subscribeToAllOf(v.$at(k), subscriber)
        })
    }
}



    
describe('observable', () => {

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

        a.$value = 1
        //a.$publish(1)

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

//        console.log(m2)

//        console.log((observable({a: 5}) as any).mix)

        autoTerminalAware(() => {
            expect(isMixed(m2)).is.true
            expect(m2._raw.length).to.eq(1)
        })
    })

    it ('Should keep removed entries with subscription', () => {

        const v = observable({a: 5, b: 'hello'})

        // init entries
        v.a = 10
        v.b = 'bye'

        expect(size((v as any)._entries)).is.eq(2)

        v.$at('b').$subscribe(() => {})

        v.$value = {} as any

        console.log((v as any)._entries)

        expect((v as any)._entries['a']).is.undefined
        expect((v as any)._entries['b']).is.not.undefined
    })

    it ('Should destroy entries with subscription', () => {

        const v = observable({a: 5, b: 'hello'})

        // init entries
        v.a = 10
        v.b = 'bye'

        v.$at('a').$subscribe(() => {})
        v.$at('b').$subscribe(() => {})

        v.$value = null

        expect(size((v as any)._entries)).is.eq(0)

    })



    it ('Should remove array entries', () => {

        const arr = observable([1, 2, 3, 4, 5], (v) => v)

        arr.$at(0).$subscribe(() => {})
        arr.$at(1).$subscribe(() => {})
        arr.$at(2).$subscribe(() => {})
        arr.$at(3).$subscribe(() => {})
        arr.$at(4).$subscribe(() => {})


        arr.$value = [3, 4, 5]

        expect(arr.$value.length).to.be.eq(3)
        expect((arr[0] as any)._key).to.be.eq('0')
        expect((arr[1] as any)._key).to.be.eq('1')
        expect((arr[2] as any)._key).to.be.eq('2')
        expect((arr[0] as any)._memoValue).to.be.eq(3)
        expect((arr[1] as any)._memoValue).to.be.eq(4)
        expect((arr[2] as any)._memoValue).to.be.eq(5)

    })


    // it ('Should not update not indexed entries', () => {

    //     const arr = observable([1,2,5], (v) => v)
    //     const l = arr.length



    // })


})