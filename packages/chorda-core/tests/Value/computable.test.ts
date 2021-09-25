import { expect } from "chai"
import { computable, observable, ObservableValue, ObservableValueSet, Value } from "../../src"



describe ('computable', () => {

    it ('Should recompute on publish', () => {

        const v: ObservableValueSet<number> = computable(() => 2 + 7)

        expect((v as any)._memoValue).is.undefined

        v.$publish(null)

        expect(v.$value).to.be.eq(9)
    })

    it ('Should recompute on value get', () => {
        const v: ObservableValueSet<number> = computable(() => 2 + 7)
        expect((v as any)._memoValue).is.undefined
        expect(v.$value).to.be.eq(9)
    })

    it ('Should safe compute null', () => {

        const v: ObservableValueSet<number> = computable(() => null)
        v.$publish(null)
        
    })

    it ('Should subscribe to observable expression', () => {

        const x: Value<number>&number = observable(2)
        const y: number = observable(7)

        const v: ObservableValue<number> = computable(() => x + y)

        const updates: any[] = []
        v.$subscribe((next) => updates.push(next))

        //v.$value = 10
        //v.$touch({$publish: () => {}})

        expect(v.$value).to.be.eq(9)
        //expect(updates).to.deep.eq([9])
        expect((x as any)._subscriptions.length).to.eq(1)

        x.$value = 100

        expect(v.$value).to.be.eq(107)
        expect(updates).to.deep.eq([107])
        expect((x as any)._subscriptions.length).to.eq(1)
    })

    it ('Should subscribe to observable expression with nested', () => {

        const x = observable({address: {postCode: 123}})
        const y: Value<number>&number = observable(7)

        const v: ObservableValue<boolean> = computable(() => x.address.postCode == y)

        const updates: any[] = []
        v.$subscribe((next) => updates.push(next))

        expect(v.$value).to.be.eq(false)
//            expect(updates).to.deep.eq([false])

        y.$value = 123

        expect(v.$value).to.be.eq(true)
        expect(updates).to.deep.eq([true])
    })


    it ('Should break looped update cycle', () => {

        let a: number
        let b: number

        a = computable(() => b + 1, 0)
        b = computable(() => a + 1, 0)

        expect(+a).to.be.equal(2)
        expect(+b).to.be.equal(1)

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
