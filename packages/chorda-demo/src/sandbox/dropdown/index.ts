import { HtmlBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"
import { Example } from "../../helpers"



export const DropdownExample = () : HtmlBlueprint => {
    return RowLayout([
        Example({
            title: 'Dropdown + template',
            content: require('./dropdown').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown').default
            }]
        }),
        Example({
            title: 'Dropdown + value',
            content: require('./dropdown-component').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown-component').default
            }, {
                name: 'dropdown.ts',
                code: require('!raw-loader!../../helpers/dropdown').default
            }]
        }),
        Example({
            title: 'Dropdown + multi',
            content: require('./dropdown-multi').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown-multi').default
            }, {
                name: 'with-multiselect.ts',
                code: require('!raw-loader!./common/with-multiselect').default
            }]
        }),
        Example({
            title: 'Dropdown + detached',
            content: require('./dropdown-detach').default,
            files: [{
                name: 'index.ts',
                code: require('!raw-loader!./dropdown-detach').default
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
        // Example({
        //     title: 'Dropdown + async',
        //     content: require('./dropdown-async').default,
        //     files: [{
        //         name: 'index.ts',
        //         code: require('!raw-loader!./dropdown-async').default
        //     }]
        // }),
    ])
}
