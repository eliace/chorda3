import { HtmlBlueprint } from "@chorda/core"
import { ExamplePanel } from "../helpers"
import { CarouselExample } from "./carousel"
import { ListBoxExample } from "./listbox"



export const Extended = () : HtmlBlueprint => {
    return ExamplePanel({
        title: 'Components+',
        tabs: [{
            title: 'Carousel',
            name: 'carousel',
            link: '/#/extended/carousel',
            example: CarouselExample
        }, {
            title: 'ListBox',
            name: 'listbox',
            link: '/#/extended/listbox',
            example: ListBoxExample
        }]
    })
}