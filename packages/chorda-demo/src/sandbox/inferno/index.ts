import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const InfernoExample = () : InferBlueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'React',
            content: require('./react').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./react').default
            }, {
                name: 'with-react.ts',
                code: require('!raw-loader!./with-react').default
            }]
        }),
        Example({
            title: 'Inferno',
            content: require('./basic').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./basic').default
            }, {
                name: 'with-inferno.ts',
                code: require('!raw-loader!./with-inferno').default
            }]
        }),
        Example({
            title: 'Preact',
            content: require('./preact').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./preact').default
            }, {
                name: 'with-preact.ts',
                code: require('!raw-loader!./with-preact').default
            }]
        }),
    ])
}