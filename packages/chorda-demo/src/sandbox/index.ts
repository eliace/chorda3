import { HtmlBlueprint } from "@chorda/core"
import { ExamplePanel } from "../helpers"
import { CatApi } from "./catapi"
import Countries from './countries'
import { DropdownExample } from "./dropdown"
import { InfernoExample } from "./inferno"
import { ListExample } from "./list"
import { SelectExample } from "./select"
import { TransitionsExample } from "./transitions"



export const Sandbox = () : HtmlBlueprint => {
    return ExamplePanel({
        title: 'Sandbox',
        tabs: [{
            title: 'Countries',
            name: 'countries',
            link: '/#/sandbox/countries',
            example: Countries
        }, {
            title: 'Cat API',
            name: 'catapi',
            link: '/#/sandbox/catapi',
            example: CatApi
        }, {
            title: 'Select',
            name: 'select',
            link: '/#/sandbox/select',
            example: SelectExample
        }, {
            title: 'Dropdown',
            name: 'dropdown',
            link: '/#/sandbox/dropdown',
            example: DropdownExample
        }, {
            title: 'List',
            name: 'list',
            link: '/#/sandbox/list',
            example: ListExample
        }, {
            title: 'Inferno',
            name: 'inferno',
            link: '/#/sandbox/inferno',
            example: InfernoExample
        }, {
            title: 'Transitions',
            name: 'transitions',
            link: '/#/sandbox/transitions',
            example: TransitionsExample
        }]
    })
}
