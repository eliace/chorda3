import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const ButtonExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Buttons',
            content: require('./buttons').default,
            code: require('!raw-loader!./buttons').default
        }),
        Example({
            title: 'Icon',
            content: require('./icon').default,
            code: require('!raw-loader!./icon').default
        }),
        Example({
            title: 'Group',
            content: require('./group').default,
            code: require('!raw-loader!./group').default
        }),
    ])
}