import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const ListExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'List + async intersect',
            content: require('./list-async-intersect').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./list-async-intersect').default
            }]
        }),
        //  Example({
        //     title: 'List + async',
        //     content: require('./list-async').default,
        //     files: [{
        //         name: 'index.ts',
        //         code: require('!raw-loader!./list-async').default
        //     }]
        // }),
        // Example({
        //     title: 'List + async blocks',
        //     content: require('./list-async-blocks').default,
        //     files: [{
        //         name: 'index.ts',
        //         code: require('!raw-loader!./list-async-blocks').default
        //     }]
        // }),
    ])
}
