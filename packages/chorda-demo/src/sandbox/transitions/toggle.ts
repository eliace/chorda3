import { callable, InferBlueprint, observable } from "@chorda/core"
import { Button } from "chorda-bulma"
import { Text } from "../../helpers"
import { withShowHide } from "./utils"


export default () : InferBlueprint<{active: boolean, toggle: Function}> => {
    return {
        injections: {
            active: () => observable(true),
            toggle: $ => callable(() => {
                $.active.$value = !$.active.$value
            })
        },
        reactions: {
            active: (v) => ({components: {text: v}}),
        },
        templates: {
            button: Button({
                text: 'Toggle',
                css: 'mr-4',
                onClick: (e, {toggle}) => toggle(),
            }),
            text: withShowHide(Text({
                text: 'Hello'
            }))
        }
    }
}