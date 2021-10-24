import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"


export const ImageExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Round',
            content: require('./round').default,
            code: require('!raw-loader!./round').default
        }),
    ])
}