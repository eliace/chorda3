import { expect } from "chai"
import { mixin } from "../src/mix"





describe ('Mixin', () => {

    it ('Should mix options', () => {

        const m = mixin({name: 'Alice'}, {name: 'Bob'})

        expect(m.entries).to.deep.eq([{name: 'Alice'}, {name: 'Bob'}])

    })



})