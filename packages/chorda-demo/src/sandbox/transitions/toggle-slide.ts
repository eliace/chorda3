import { InferBlueprint, observable } from "@chorda/core"
import { Button } from "chorda-bulma"
import { Paragraph, Text } from "../../helpers"
import { withShowHide } from "./utils"


export default () : InferBlueprint<{isActive: boolean}> => {
    return {
        injections: {
            isActive: () => observable(true),
        },
        reactions: {
            isActive: (v) => ({components: {text: v}}),
        },
        templates: {
            button: Button({
                text: 'Toggle slide',
                onClick: (e, {isActive}) => {
                    isActive.$value = !isActive.$value
                },
            }),
            text: withShowHide(Paragraph({
                text: 'Hello'
            }), 'slide-fade', 'slide-fade')
        }
    }
}