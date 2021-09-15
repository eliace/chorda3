import { HtmlBlueprint } from "@chorda/core"
import { Box, Image } from "chorda-bulma"
import { IMAGE_1 } from "../../data"

export default () : HtmlBlueprint => {
    return Box({
        css: 'is-paddingless is-radiusless',
        styles: {
            width: 300,
            margin: '0 auto'
        },
        content: Image({
            css: 'is-16by9',
            url: IMAGE_1
        })
    })
}