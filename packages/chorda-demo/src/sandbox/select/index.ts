import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const SelectExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'HTML',
            content: require('./html').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./html').default
            }]
        }),
        Example({
            title: 'Component',
            content: require('./html-component').default,
            files: [
                { name: 'index.ts', code: require('!raw-loader!./html-component').default },
                { name: 'select.ts', code: require('!raw-loader!./common/select').default },
            ]
        }),
        Example({
            title: 'Component + reactive',
            content: require('./html-ext').default,
            files: [
                { name: 'index.ts', code: require('!raw-loader!./html-ext').default },
                { name: 'select2.ts', code: require('!raw-loader!./common/select2').default },
            ]
        }),
    ])
}
