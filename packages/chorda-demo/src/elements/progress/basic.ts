import { InferBlueprint } from "@chorda/core"
import { Box, Progress } from "chorda-bulma"



export default () : InferBlueprint<unknown> => {
    return Box({
        css: 'is-paddingless is-roundless',
        styles: {
            maxWidth: 600,
            margin: '0 auto'
        },
        content: Progress({
            max: 100,
            value: 40
        })
    })
}