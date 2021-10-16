import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const TabsExample = () => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            code: require('!raw-loader!./basic').default
        }),
        Example({
            title: 'Align',
            content: require('./align').default,
            code: require('!raw-loader!./align').default
        }),
    ])
}