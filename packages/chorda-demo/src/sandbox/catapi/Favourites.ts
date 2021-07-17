import { computable, HtmlBlueprint, iterable, observable, patch } from "@chorda/core";
import { Field, Fields } from "chorda-bulma";
import { Coerced, createValueEffect, IteratorScope } from "../../utils";
import { BgImage, Dropdown, DropdownItem } from "../../helpers";
import { api, CatApi } from "./api";


type FavouritesScope = {
    images: CatApi.Favourite[]
    limit: number
    order: string
    page: number
    filters: {
        limit: number
        page: number
    }
}

type Record = {
    id: string
    name: string
}


const ORDERS = observable([
    {id: 'random', name: 'Random'},
    {id: 'desc', name: 'Desc'},
    {id: 'asc', name: 'Asc'},
])

const LIMITS = observable([
    {id: 9, name: '9'},
    {id: 18, name: '18'},
    {id: 80, name: '80'},
])



export const Favourites = () : HtmlBlueprint<FavouritesScope> => {
    return {
        injectors: {
            images: () => observable(null),
            limit: () => observable(9),
            page: () => observable(null),
            order: () => observable('random'),
            filters: ({limit, page}) => computable(() => {
                return {limit, page}
                // return {
                //     limit: scope.limit, 
                //     page: scope.page
                // }
            })
        },
        joints: {
            images: {
                autoLoad: (images, {filters}) => {

                    const search = createValueEffect(images, 'loadFavourites', api.searchFavourites)

                    filters.$subscribe(next => {
//                        debugger
                        search(next)
                    })

                }
            }
        },
        styles: {
            width: '600px',
            margin: '0 auto'
        },
        templates: {
            header: {
                css: 'mb-5',
                items: [
                    Field({
                        label: 'Order',
                        control: Dropdown<Record, string, FavouritesScope>({
                            items$: (scope) => ORDERS,
                            value$: (scope) => scope.order,
                            text$: (scope) => scope.selected.name,
                            defaultItem: DropdownItem<Record, string>({
                                text$: (scope) => scope.item.name
                            })
                        })
                    })
                ]
            },
            images: {
                css: 'catapi-search',
                templates: {
                    tiles: Coerced<IteratorScope<CatApi.Favourite[]>, FavouritesScope>({
                        css: 'flex-tiles',
                        injectors: {
                            __it: (scope) => iterable(scope.images)
                        },
                        reactors: {
                            __it: (v) => patch({items: v})
                        },
                        defaultItem: Coerced<IteratorScope<CatApi.Favourite>>({
                            css: 'flex-tile',
                            templates: {
                                content: BgImage({
                                    url$: (scope) => scope.__it.image.url
                                })
                            }
                        })
                    })
                }
            },
            footer: {
                css: 'mt-5',
                templates: {
                    content: Fields({
                        fields: [
                            Field({
                                label: 'Per page',
                                control: Dropdown<Record, number, FavouritesScope>({
                                    value$: (scope) => scope.limit,
                                    text$: (scope) => scope.selected.name,
                                    items$: () => LIMITS,
                                    defaultItem: DropdownItem<Record, number>({
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            // Field({
                            //     control: Button({
                            //         text: 'More',
                            //         css: 'is-info is-medium',
                            //         rightIcon: FaIcon({icon: faRedo}),
                            //         onClick: (e, {bus}) => {
                            //             bus.$emit('loadNextPage')
                            //         }
                            //     }),
                            // })
                        ]
                    })
                }
            }
        }
    }
}