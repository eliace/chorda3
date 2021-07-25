import { computable, HtmlBlueprint, iterable, observable, patch } from "@chorda/core"
import { Button, Field, Fields } from "chorda-bulma"
import { Coerced, createAppScope, createValueEffect, IteratorScope } from "../../utils"
import { BgImage, Dropdown, DropdownItem, FaIcon } from "../../helpers"
import { api, CatApi } from "./api"
import { DomEvents } from "@chorda/react"
import { faHeart, faRedo } from "@fortawesome/free-solid-svg-icons"



type SearchScope = {
    orderId: string
    typeId: string
    categoryId: number
    breedId: string
    limit: number
    page: number
    breeds: CatApi.Breed[]
    categories: CatApi.Category[]
    searchResults: CatApi.SearchResult[]
    filters: CatApi.SearchImageFilter
    bus: {
        loadCategories: () => void
        loadBreeds: () => void
        search: (filter: CatApi.SearchImageFilter) => Promise<any>
        loadNextPage: () => void
        markAsFavourite: (image: CatApi.SearchResult) => void
    }
}

type FavouriteScope = {
    favourite: boolean
}

type Record = {
    id: string
    name: string
}

type SearchEvents = {
    loadBreedsDone: () => CatApi.Breed[]
    loadCategoriesDone: () => CatApi.Category[]
    loadNextPage: () => void
    markAsFavourite: () => CatApi.SearchResult & {favourite?: boolean}
}

const ORDERS = observable([
    {id: 'random', name: 'Random'},
    {id: 'desc', name: 'Desc'},
    {id: 'asc', name: 'Asc'},
])

const TYPES = observable([
    {id: 'all', name: 'All'},
    {id: 'static', name: 'Static'},
    {id: 'animated', name: 'Animated'},
])

const LIMITS = observable([
    {id: 9, name: '9'},
    {id: 18, name: '18'},
    {id: 80, name: '80'},
])

const RECORD_NONE: Record = {id: null, name: 'None'}



export const Search = () : HtmlBlueprint<SearchScope, SearchEvents&DomEvents> => {
    return {
        injectors: {
            orderId: () => observable('random'),
            typeId: () => observable('all'),
            categoryId: () => observable(null),
            breedId: () => observable(null),
            categories: () => observable([RECORD_NONE]),
            breeds: () => observable([RECORD_NONE]),
            filters: (scope) => computable(() => {
                return {
                    breed_id: scope.breedId,
                    order: scope.orderId,
                    category_ids: scope.categoryId,
                    limit: scope.limit,
                    page: scope.page
                } as CatApi.SearchImageFilter
            }),
            page: () => observable(0),
            limit: () => observable(9),
            searchResults: () => observable([{}, {}, {}, {}, {}, {}, {}, {}, {}]),
            bus: () => observable({})
        },
        joints: {
            autoLoad: ({bus, breeds, categories, searchResults, filters}) => {

                bus.search.$value = createValueEffect(searchResults, 'search', api.searchImages)
                
                bus.$event('loadNextPage')

                bus.loadBreeds.$value = createValueEffect(breeds, 'loadBreeds', () => {
                    return api.getBreeds().then(data => {
                        return [RECORD_NONE].concat(data)
                    })
                })
                bus.loadCategories.$value = createValueEffect(categories, 'loadCategories', () => {
                    return api.getCategories().then(data => {
                        return [RECORD_NONE].concat(data)
                    })
                })
                bus.markAsFavourite = bus.$event('markAsFavourite') as any
                bus.$on('markAsFavourite', (image: CatApi.SearchResult) => {
                    api.saveAsFavourite(String(image.id))
                })


                filters.$subscribe((next) => {
                    bus.search(next)
                })

                setTimeout(() => {
                    bus.loadBreeds()
                    bus.loadCategories()
                })
            }
        },
        events: {
            loadBreedsDone: (breeds, {breedId}) => {
                breedId.$value = breeds[0].id
            },
            loadCategoriesDone: (categories, {categoryId}) => {
                categoryId.$value = categories[0].id
            },
            loadNextPage: (e, {page}) => {
                page.$value = page + 1
            },
            markAsFavourite: (image) => {
                image.favourite = true
            }
        },
        styles: {
            width: '600px',
            margin: '0 auto'
        },
        templates: {
            form: {
                css: 'mb-5 catapi-search-form',
                items: [
                    Fields({
                        fields: [
                            Field({
                                label: 'Order',
                                control: Dropdown<Record, string, SearchScope>({
                                    items$: () => ORDERS,
                                    value$: (scope) => scope.orderId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem<Record, string>({
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            Field({
                                label: 'Type',
                                control: Dropdown<Record, string, SearchScope>({
                                    items$: () => TYPES,
                                    value$: (scope) => scope.typeId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem<Record, string>({
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                        ]
                    }),
                    Fields({
                        fields: [
                            Field({
                                label: 'Category',
                                control: Dropdown<Record, string, SearchScope>({
                                    items$: (scope) => scope.categories,
                                    value$: (scope) => scope.categoryId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem<Record, string>({
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            Field({
                                label: 'Breed',
                                control: Dropdown<CatApi.Breed, string, SearchScope>({
                                    items$: (scope) => scope.breeds,
                                    value$: (scope) => scope.breedId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem<CatApi.Breed, string>({
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                        ]
                    })
                ]
            },
            images: Coerced<IteratorScope<CatApi.SearchResult[]>, SearchScope>({
                injectors: {
                    __it: (scope) => iterable(scope.searchResults),
                },
                css: 'catapi-search',
                templates: {
                    tiles: {
                        css: 'flex-tiles',
                        defaultItem: Coerced<IteratorScope<CatApi.SearchResult&{favourite: boolean}>&FavouriteScope, SearchScope>({
                            css: 'flex-tile',
                            templates: {
                                content: BgImage({
                                    url$: (scope) => scope.__it.url
                                }),
                                favicon: FaIcon({
                                    icon: faHeart,
                                    as: {
                                        injectors: {
                                            favourite: (scope) => scope.__it.favourite
                                        },
                                        reactors: {
                                            favourite: (v) => patch({classes: {'is-favourited': v}})
                                        },
                                        events: {                                                                                                                
                                            click: (e, {bus, __it}) => {
                                                bus.markAsFavourite(__it)
                                            }
                                        }
                                    }
                                    
                                })
                            },
                        }),
                        reactors: {
                            __it: (v) => patch({items: v})
                        }
                    }
                }
            }),
            footer: {
                css: 'mt-5',
                templates: {
                    content: Fields({
                        fields: [
                            Field({
                                label: 'Per page',
                                control: Dropdown<Record, number, SearchScope>({
                                    value$: (scope) => scope.limit,
                                    text$: (scope) => scope.selected.name,
                                    items$: () => LIMITS,
                                    defaultItem: DropdownItem<Record, number>({
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            Field({
                                control: Button({
                                    text: 'More',
                                    css: 'is-info is-medium',
                                    rightIcon: FaIcon({icon: faRedo}),
                                    onClick: (e, {bus}) => {
                                        bus.$emit('loadNextPage')
                                    }
                                }),
                            })
                        ]
                    })
                }
            }
        }
    }
}