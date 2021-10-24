import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"


export const ProgressExample = () : InferBlueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Colors',
            content: require('./colors').default,
            code: require('!raw-loader!./colors').default
        }),
    ])
}