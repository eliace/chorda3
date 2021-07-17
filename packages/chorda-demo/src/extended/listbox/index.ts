import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"


export const ListBoxExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Data',
            content: require('./basic-data').default,
            code: require('!raw-loader!./basic-data').default
        }),
    ])
}