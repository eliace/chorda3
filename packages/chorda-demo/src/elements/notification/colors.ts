import { InferBlueprint } from "@chorda/core"
import { Box, Notification } from "chorda-bulma"
import { LOREM_IPSUM } from "../../data"


export default () : InferBlueprint<unknown> => {
    return {
        items: [
            Box({
                css: 'is-paddingless is-roundless',
                content: Notification({
                    text: LOREM_IPSUM,
                    css: 'is-primary'
                })
            }),        
            Box({
                css: 'is-paddingless is-roundless',
                content: Notification({
                    text: LOREM_IPSUM,
                    css: 'is-link'
                })
            }),        
            Box({
                css: 'is-paddingless is-roundless',
                content: Notification({
                    text: LOREM_IPSUM,
                    css: 'is-info'
                })
            }),        
            Box({
                css: 'is-paddingless is-roundless',
                content: Notification({
                    text: LOREM_IPSUM,
                    css: 'is-success'
                })
            }),        
            Box({
                css: 'is-paddingless is-roundless',
                content: Notification({
                    text: LOREM_IPSUM,
                    css: 'is-warning'
                })
            }),        
            Box({
                css: 'is-paddingless is-roundless',
                content: Notification({
                    text: LOREM_IPSUM,
                    css: 'is-danger'
                })
            }),        
        ]
    }
}