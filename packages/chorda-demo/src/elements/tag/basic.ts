import { InferBlueprint } from "@chorda/core"
import { Box, Tag } from "chorda-bulma"


export default () : InferBlueprint<unknown> => {
    return Box({
        css: 'is-roundless is-shadowless has-text-centered',
        content: Tag({
            text: 'Tag label',
            as: {
                css: 'has-box-shadow'
            }
        })
    })
}