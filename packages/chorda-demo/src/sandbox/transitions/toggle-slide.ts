import { InferBlueprint, observable, patch } from "@chorda/core"
import { Button } from "chorda-bulma"
import { Paragraph, Text } from "../../helpers"
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
                text: 'Toggle slide',
                onClick: (e, {active}) => {
                    active.$value = !active.$value
                },
            }),
            text: withShowHide(Paragraph({
                text: 'Hello'
            }), 'slide-fade', 'slide-fade')
        }
    }
}