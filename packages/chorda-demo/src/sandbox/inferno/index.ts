import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const InfernoExample = () : InferBlueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'Basic',
            content: require('./basic').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./basic').default
            }, {
                name: 'with-inferno.ts',
                code: require('!raw-loader!./with-inferno').default
            }]
        }),
    ])
}