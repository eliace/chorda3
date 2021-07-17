import { HtmlBlueprint } from "@chorda/core"
import { ExamplePanel } from "../helpers"
import { CatApi } from "./catapi"
import Countries from './countries'
import { SelectExample } from "./select"



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
        }]
    })
}
