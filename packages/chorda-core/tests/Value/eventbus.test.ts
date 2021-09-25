import { expect } from "chai"
import { EventBus, observable } from "../../src"



describe ('EventBus', () => {

    it ('Should on and emit event', () => {
        
        const v : EventBus<unknown> = observable(null)

        const result: any[] = []

        v.$on('test', (s: string) => {
            result.push(s)
        })

        v.$emit('test', 'hello')


        expect(result).to.deep.eq(['hello'])

    })


    it ('Should define and emit event', () => {
        
        const v : EventBus<unknown> = observable(null)

        const result: any[] = []

        v.$on('test', (s: string) => {
            result.push(s)
        })

        const test = v.$event('test')

        test('hi')

        expect(result).to.deep.eq(['hi'])

    })

    it ('Should define and check event', () => {

        const v : EventBus<unknown> = observable(null)

        v.$event('test')

        expect(v.$hasEvent('test')).to.be.true

    })

})
