import { InferBlueprint, observable, patch } from "@chorda/core"
import { Button } from "chorda-bulma"
import { Text } from "../../helpers"
import { withShowHide } from "./utils"


export default () : InferBlueprint<{active: boolean}> => {
    return {
        injections: {
            active: () => observable(true),
        },
        reactions: {
            active: (v) => patch({components: {text: v}}),
        },
        templates: {
            button: Button({
                text: 'Toggle',
                css: 'mr-4',
                onClick: (e, {active}) => {
                    active.$value = !active.$value
                },
            }),
            text: withShowHide(Text({
                text: 'Hello'
            }))
        }
    }
}