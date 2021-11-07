import { Blueprint, callable, computable, HtmlBlueprint, HtmlEvents, HtmlScope, InferBlueprint, Injector, iterable, Listener, mix, observable } from "@chorda/core"
import { Button, Field, Fields } from "chorda-bulma"
import { Coerced, createAppScope, IteratorScope, ListBlueprint, watch, withList } from "../../utils"
import { BgImage, BgImagePropsType, Dropdown, DropdownItem, DropdownItemPropsType, DropdownOld, DropdownOldItem, DropdownPropsType, FaIcon, SvgImagePlaceholder } from "../../helpers"
import { faHeart, faRedo, faUserLock } from "@fortawesome/free-solid-svg-icons"
import { CatApi } from "../../api"
import { IMAGE_BASE64, IMAGE_PLACEHOLDER } from "../../data"
import { ReactDomEvents } from "@chorda/react"
import { ProgressPlugin } from "webpack"

const favourites = observable(null)

// CatApi.api.searchFavourites({page: 1}).then(result => {
//     favourites.$value = result
// })


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
    filter: CatApi.SearchImageFilter
    search: (filter: CatApi.SearchImageFilter) => void
    loadNextPage: () => void
    loadCategories: () => void
    loadBreeds: () => void
    markAsFavourite: (image: CatApi.SearchResult & {favourite?: boolean}) => void
}

type FavouriteScope = {
    favourite: boolean
}

type Record = {
    id: any
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


const asyncImageLoad = (url: string) : Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.addEventListener('load', () => {
            console.log('image loaded')
            resolve(url)
        })    
    })
}



type AsyncImageLoadScope = {
    asyncUrl: string
    url: string
    onBeforeLoad: () => {}
}

type AsyncImageLoadActions = {
    onBeforeLoad: () => {}
}

const withAsyncImageLoad = <T, E>(props: Blueprint<T&AsyncImageLoadScope, E&AsyncImageLoadActions>) : InferBlueprint<T, E> => {
    return mix<AsyncImageLoadScope>({
        initials: {
            onBeforeLoad: () => callable(null)
        },
        joints: {
            asyncLoad: ({url, asyncUrl, onBeforeLoad}) => {

                console.log('init bgimage')

                watch(() => {
                    // console.log('url changed to', IMAGE_PLACEHOLDER)
                    console.log('url to load', asyncUrl.$value)
                    // url.$value = IMAGE_PLACEHOLDER
                    onBeforeLoad()
                    if (asyncUrl.$value) {
                        asyncImageLoad(asyncUrl).then((u) => {
                            console.log('url changed to', ''+u)
                            url.$value = u
                        })                                                        
                    }
                }, [asyncUrl])

            }
        }
    }, props)
}




type FavouriteButtonProps<T, E> = {
    as?: Blueprint<T, E>,
    onClick?: Listener<T, unknown>
    isFavourite$?: Injector<T>
}

const FavouriteButton = <T, E>(props: FavouriteButtonProps<T&FavouriteScope, E>) : InferBlueprint<T, E> => {
    return mix<FavouriteScope, ReactDomEvents>({
        css: 'action',
        injections: {
            favourite: props.isFavourite$
        },
        reactions: {
            favourite: (v) => ({classes: {'is-favourited': v}})
        },
        events: {
            $dom: {
                click: props.onClick
            }
        }
    }, props.as)
}


export const Search = () : HtmlBlueprint<SearchScope, SearchEvents> => {
    return {
        initials: {
            orderId: () => observable('random'),
            typeId: () => observable('all'),
            categoryId: () => observable(null),
            breedId: () => observable(null),
            categories: () => observable([RECORD_NONE]),
            breeds: () => observable([RECORD_NONE as CatApi.Breed]),
            page: () => observable(0),
            limit: () => observable(9),
            searchResults: () => observable([{}, {}, {}, {}, {}, {}, {}, {}, {}] as CatApi.SearchResult[], () => undefined),
        },
        injections: {
            filter: (scope) => computable(() => {
                return {
                    breed_id: scope.breedId,
                    order: scope.orderId,
                    category_ids: scope.categoryId,
                    limit: scope.limit,
                    page: scope.page
                }
            }),
            search: ({searchResults, limit}) => (filter: CatApi.SearchImageFilter) => {
                searchResults.$value = Array(limit.$value).fill(null).map(() => {return {} as CatApi.SearchResult})
                console.log('start search', filter)
                CatApi.api.searchImages(filter).then(result => {
                    console.log('pre stop search')
                    searchResults.$value = result
                    console.log('stop search')
                })
            },
            loadNextPage: ({page}) => () => {
                page.$value = page + 1
            },
            loadBreeds: ({breeds, breedId}) => () => {
                CatApi.api.getBreeds().then(data => {
                    breeds.$value = [RECORD_NONE as CatApi.Breed].concat(data)
                    breedId.$value = breeds[0].id
                })
            },
            loadCategories: ({categories, categoryId}) => () => {
                CatApi.api.getCategories().then(data => {
                    categories.$value = [RECORD_NONE as CatApi.Category].concat(data)
                    categoryId.$value = categories[0].id
                })
            },
            markAsFavourite: () => (image) => {
                image.favourite = true
                CatApi.api.saveAsFavourite(String(image.id))
            }
        },
        joints: {
            autoLoad: ({loadBreeds, loadCategories, search, filter}) => {

                filter.$subscribe((next) => {
                    search(next)
                })

                setTimeout(() => {
                    loadBreeds()
                    loadCategories()
                })
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
                                control: Dropdown(<DropdownPropsType<Record, SearchScope>>{
                                    items$: () => ORDERS,
                                    value$: ($) => $.orderId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem(<DropdownItemPropsType<Record>>{
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            Field({
                                label: 'Type',
                                control: Dropdown(<DropdownPropsType<Record, SearchScope>>{
                                    items$: () => TYPES,
                                    value$: (scope) => scope.typeId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem(<DropdownItemPropsType<Record>>{
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
                                control: Dropdown(<DropdownPropsType<Record, SearchScope>>{
                                    items$: (scope) => scope.categories,
                                    value$: (scope) => scope.categoryId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem(<DropdownItemPropsType<Record>>{
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            Field({
                                label: 'Breed',
                                control: Dropdown(<DropdownPropsType<CatApi.Breed, SearchScope>>{
                                    items$: (scope) => scope.breeds,
                                    value$: (scope) => scope.breedId,
                                    text$: (scope) => scope.selected.name,
                                    defaultItem: DropdownItem(<DropdownItemPropsType<CatApi.Breed>>{
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                        ]
                    })
                ]
            },
            images: {
                css: 'catapi-search',
                templates: {
                    content: withList(<ListBlueprint<CatApi.SearchResult&{favourite?: boolean}, SearchScope>>{
                        injections: {
                            items: ($) => $.searchResults
                        },
                        css: 'flex-tiles',
                        defaultItem: {
                            css: 'flex-tile',
                            templates: {
                                image: withAsyncImageLoad(BgImage({
                                    as: {
                                        injections: {
                                            asyncUrl: ($) => $.item.url
                                        },
                                        events: {
                                            onBeforeLoad: (e, {url}) => {
                                                url.$value = IMAGE_PLACEHOLDER
                                            } 
                                        }
                                    },
                                })),
                                favicon: FavouriteButton({
                                    isFavourite$: $ => $.item.favourite,
                                    onClick: (e, {markAsFavourite, item}) => markAsFavourite(item),
                                    as: FaIcon({
                                        icon: faHeart
                                    }),
                                })
                            },
                            // joints: {
                            //     debugItem: ({item}) => {
                            //         watch(() => {
                            //             console.log('update item', item.url)
                            //         }, [item.url])
                            //     }
                            // }
                        }
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
                                control: Dropdown(<DropdownPropsType<Record, SearchScope>>{
                                    value$: (scope) => scope.limit,
                                    text$: (scope) => scope.selected.name,
                                    items$: () => LIMITS,
                                    defaultItem: DropdownItem(<DropdownItemPropsType<Record>>{
                                        text$: (scope) => scope.item.name
                                    })
                                })
                            }),
                            Field({
                                control: Button({
                                    text: 'More',
                                    css: 'is-info is-medium',
                                    rightIcon: FaIcon({icon: faRedo}),
                                    onClick: (e, {loadNextPage}) => loadNextPage(),
                                    //disabled$: ($) => computable(() => $.)
                                }),
                            })
                        ]
                    })
                }
            }
        }
    }
}