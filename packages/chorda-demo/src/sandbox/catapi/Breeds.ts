import { Blueprint, callable, computable, EventBus, HtmlBlueprint, InferBlueprint, mix, observable, watch } from "@chorda/core"
import { Card, Field, Title } from "chorda-bulma"
import { Content } from "../../utils"
import { Carousel, Dropdown, DropdownItem, DropdownItemPropsType, DropdownPropsType, DropdownScope, Paragraph, Text } from "../../helpers"
import { CatApi } from "../../api"


type BreedsScope = {
    breeds: CatApi.Breed[]
    selected: CatApi.Breed
//    imageUrl: string
    images: CatApi.Image[]
    imageUrls: string[]
    loadingBreeds: boolean
    loadingImages: boolean
    onLoadBreeds: () => void
}

type BreedsEvents = Pick<BreedsScope, 'onLoadBreeds'> & {
    // loadBreedsStart?: () => any
    // loadBreedsDone?: () => CatApi.Breed[]
    // loadImagesDone?: () => CatApi.Image[]
//    selectBreed?: () => CatApi.Breed
}



const BreedSelect = () : InferBlueprint<BreedsScope, BreedsEvents> => {
    return {
        styles: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem'
        },
        templates: {
            content: Field({
                label: 'breeds',
                control: Dropdown(<DropdownPropsType<CatApi.Breed, BreedsScope>>{
                    as: {
                        css: 'catapi-breed-dropdown'
                    },
                    defaultItem: DropdownItem(<DropdownItemPropsType<CatApi.Breed>>{
                        text$: (scope) => scope.item.name
                    }),
                    items$: ({breeds}) => breeds,
                    value$: ({$context}) => $context.selected,
                    loading$: ({loadingBreeds}) => loadingBreeds,
                    valueToKey: (v) => v != null && v.id,
                    itemToValue: (itm) => itm
                })
            })
    
        }
    }
}

const BreedGallery = () : InferBlueprint<BreedsScope, BreedsEvents> => {
    return Content({
        content: Card({
            content: Carousel({
                images$: (scope) => scope.imageUrls,
                title: false
            })
        })
    })
}

const BreedDescription = () : InferBlueprint<BreedsScope, BreedsEvents> => {
    return Content({
        content: Card({
            header: false,
            content: <Blueprint<BreedsScope&{data: CatApi.Breed}>>{
                injections: {
                    data: (scope) => scope.selected
                },
                css: 'has-text-centered',
                styles: {
                    fontSize: '14px'
                },
                items: [
                    Title({
                        size: 'is-3',
                        text$: ({data}) => data.name
                    }),
                    Title({
                        size: 'is-4',
                        text$: ({data}) => computable(() => `id: ${data.id}`)
                    }),
                    Text({
                        as: Paragraph,
                        text$: ({data}) => data.description
                    }),
                    Text({
                        as: Paragraph,
                        text$: ({data}) => data.temperament
                    }),
                    Text({
                        as: Paragraph,
                        text$: ({data}) => data.country_code
                    }),
                    Text({
                        as: Paragraph,
                        text$: ({data}) => computable(() => `${data.weight?.metric} kgs`)
                    }),
                    Text({
                        as: Paragraph,
                        text$: ({data}) => computable(() => `${data.life_span} average life span`)
                    }),
                ]
            }
        })
    })
}



export const Breeds = () : HtmlBlueprint<BreedsScope, BreedsEvents> => {
    return {
        injections: {
            images: () => observable([]),
            imageUrls: ({images}) => computable(() => {
                return images.map(img => img.url)
            }),
            breeds: () => observable([]),
            selected: () => observable(null),
            loadingBreeds: () => observable(null),
            loadingImages: () => observable(null),
            onLoadBreeds: () => callable(null),
        },
        joints: {
            autoLoad: ({breeds, images, selected, loadingBreeds, onLoadBreeds, loadingImages}) => {

                const loadBreeds = () => {
                    loadingBreeds.$value = true
                    CatApi.api
                        .getBreeds()
                        .then(data => {
                            loadingBreeds.$value = false
                            breeds.$value = data
                        })
                        .then(onLoadBreeds)
                }

                const loadImages = (filter: CatApi.SearchImageFilter) => {
                    loadingImages.$value = true
                    images.$value = []
                    CatApi.api
                        .searchImages(filter)
                        .then(data => {
                            loadingImages.$value = false
                            images.$value = data
                        })
                }

                // ?????? ?????????????????? ?????????????????? ???????????? ?????????????????? ???????????? ??????????????????????
                watch(() => {
                    if (selected.$value) {
                        loadImages({breed_id: selected.id.$value, limit: 8})    
                    }
                }, [selected])

                // FIXME ?????? ????-???? ????????, ?????? ?????????????? ?????????????????????????? ?? ?????? ???? ????????????
                //setTimeout(() => {
                    loadBreeds()
                //})
            },
        },
        events: {
            onLoadBreeds: (e, {selected, breeds}) => {
                selected.$value = breeds[0]
            },
        },
        templates: {
            BreedSelect,
            BreedGallery,
            BreedDescription
        }
    }
}
