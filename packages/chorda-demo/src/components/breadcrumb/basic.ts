import { InferBlueprint } from "@chorda/core"
import { RowLayout } from "chorda-bulma"



export default () : InferBlueprint<unknown> => {
    return RowLayout([
        // rows: [
        //     Breadcrumb({
        //         items: [
        //             BreadcrumbItem({text: 'Europe', link: '#'}),
        //             BreadcrumbItem({text: 'Asia'}),
        //             BreadcrumbItem({text: 'Africa'}),
        //             BreadcrumbItem({text: 'America', active: true})
        //         ]
        //     }),
        //     Breadcrumb({
        //         data: [
        //             {text: 'Europe', link: '#'},
        //             {text: 'Asia'},
        //             {text: 'Africa'},
        //             {text: 'America'}
        //         ]
        //     })
        // ]
    ])
}