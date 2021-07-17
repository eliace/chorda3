import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const SelectExample = () : HtmlBlueprint => {
    return RowLayout([
        // Example({
        //     title: 'HTML',
        //     content: require('./html').default,
        //     files: [{
        //         name: 'index.ts',
        //         code: require('!raw-loader!./html').default
        //     }]
        // }),
        // Example({
        //     title: 'Component',
        //     content: require('./html-component').default,
        //     files: [
        //         { name: 'index.ts', code: require('!raw-loader!./html-component').default },
        //         { name: 'select.ts', code: require('!raw-loader!./common/select').default },
        //     ]
        // }),
        // Example({
        //     title: 'Component + reactive',
        //     content: require('./html-ext').default,
        //     files: [
        //         { name: 'index.ts', code: require('!raw-loader!./html-ext').default },
        //         { name: 'select2.ts', code: require('!raw-loader!./common/select2').default },
        //     ]
        // }),
        // Example({
        //     title: 'Dropdown',
        //     content: require('./dropdown').default,
        //     files: [{
        //         name: 'index.ts',
        //         code: require('!raw-loader!./dropdown').default
        //     }]
        // }),
        Example({
            title: 'Dropdown + component',
            content: require('./dropdown-component').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown-component').default
            }, {
                name: 'dropdown.ts',
                code: require('!raw-loader!../../helpers/dropdown').default
            }, {
                name: 'events.ts',
                code: require('!raw-loader!../../helpers/events').default
            }]
        }),
        Example({
            title: 'Dropdown + portal',
            content: require('./dropdown-portal').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown-portal').default
            }]
        }),
        Example({
            title: 'Dropdown + input',
            content: require('./dropdown-input').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown-input').default
            }]
        }),
    ])
}
