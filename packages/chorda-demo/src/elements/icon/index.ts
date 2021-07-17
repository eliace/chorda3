import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const IconExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Font Awesome (Icon)',
            content: require('./all').default,
            code: require('!raw-loader!./all').default
        }),
        Example({
            title: 'Font Awesome (SVG)',
            content: require('./svg').default,
            code: require('!raw-loader!./svg').default
        }),
    ])
}