import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const ModalExample = () : InferBlueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Image',
            content: require('./image').default,
            code: require('!raw-loader!./image').default
        }),
    ])
}