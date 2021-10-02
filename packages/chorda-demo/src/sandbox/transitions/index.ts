import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"

import "./transitions.scss"

export const TransitionsExample = () : InferBlueprint<unknown> => {
    return RowLayout([
        Example({
            title: 'Toggle',
            content: require('./toggle').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./toggle').default
            }]
        }),
        Example({
            title: 'Toggle slide',
            content: require('./toggle-slide').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./toggle-slide').default
            }]
        }),
        Example({
            title: 'Add-Remove',
            content: require('./add-remove').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./add-remove').default
            }]
        }),
        Example({
            title: 'Shuffle',
            content: require('./shuffle').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./shuffle').default
            }]
        }),
        Example({
            title: 'Smooth Add-Remove',
            content: require('./smooth-add-remove').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./smooth-add-remove').default
            }]
        }),
    ])
}