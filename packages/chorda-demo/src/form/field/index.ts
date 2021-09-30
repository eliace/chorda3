import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"


export const FieldExample = () : InferBlueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Addons',
            content: require('./addons').default,
            code: require('!raw-loader!./addons').default
        }),
        Example({
            title: 'Icons + Colors',
            content: require('./icons').default,
            code: require('!raw-loader!./icons').default
        }),
    ])
}