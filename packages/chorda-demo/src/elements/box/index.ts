import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"




export const BoxExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Form',
            content: require('./form').default,
            code: require('!raw-loader!./form').default
        }),
        // Example({
        //     title: 'Styles',
        //     content: require('./box2').default,
        //     code: require('!raw-loader!./box2').default
        // }),
    ])
}