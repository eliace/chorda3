import { InferBlueprint } from "@chorda/core"
import { ExamplePanel } from "../helpers"
import { FieldExample } from "./field"



export const Form = () : InferBlueprint<unknown> => {
    return ExamplePanel({
        title: 'Form',
        tabs: [{
            title: 'Field',
            name: 'field',
            link: '/#/form/field',
            example: FieldExample
        }]
    })
}
