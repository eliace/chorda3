import { InferBlueprint } from "@chorda/core"
import { Field } from "chorda-bulma"
import { TextInput } from "../../helpers"



export default () : InferBlueprint<unknown> => {
    return Field({
        label: 'Name',
        control: TextInput({ 
            placeholder: 'Text input' 
        })
    })
}