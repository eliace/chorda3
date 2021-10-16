import { InferBlueprint, observable } from "@chorda/core"
import { Breadcrumb, Breadcrumbs, RowLayout } from "chorda-bulma"



export default () : InferBlueprint<unknown> => {
    return RowLayout([
        Breadcrumbs({
            items: [
                Breadcrumb({text: 'Europe', link: '#'}),
                Breadcrumb({text: 'Asia'}),
                Breadcrumb({text: 'Africa'}),
                Breadcrumb({text: 'America', active: true})
            ]
        }),
        Breadcrumbs({
            itemAs: Breadcrumb({}),
            items$: () => observable([
                {text: 'Europe'},
                {text: 'Asia'},
                {text: 'Africa'},
                {text: 'America'},
            ])
        })
    ])
}


