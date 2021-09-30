import { InferBlueprint } from "@chorda/core"
import { Addon, Button, Field, Option, Select } from "chorda-bulma"
import { TextInput } from "../../helpers"



export default () : InferBlueprint<unknown> => {
    return {
        items: [
            Field({
                control: TextInput({ 
                    placeholder: 'Find a repository' 
                }),
                addons: {
                    button: Addon({
                        content: Button({
                            text: 'Search',
                            color: 'is-info'
                        })
                    })
                }
            }),
            Field({
                expanded: true,
                control: TextInput({ 
                    placeholder: 'Amount' 
                }),
                addons: {
                    button: Addon({
                        content: Button({
                            text: 'Transfer'
                        })
                    }),
                    select: Addon({
                        weight: -1,
                        content: Select({
                            options: [
                                Option({text: '$'}),
                                Option({text: '£'}),
                                Option({text: '€'})
                            ]
                        })
                    })
                }
            }),    
        ]
    }
}