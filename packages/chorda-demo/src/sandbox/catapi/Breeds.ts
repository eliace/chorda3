import { callable, computable, EventBus, HtmlBlueprint, observable, Value } from "@chorda/core"
import { Card, Field, Title } from "chorda-bulma"
import { Coerced, createValueEffect, Custom } from "../../utils"
import { Carousel, DropdownOld, DropdownOldItem, Paragraph, Text } from "../../helpers"
import { CatApi , api} from "./api"


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
                    api.getBreeds().then(data => {
                        loadingBreeds.$value = false
                        breeds.$value = data
                        onLoadBreeds()
                    })
                }

                const loadImages = (filter: CatApi.SearchImageFilter) => {
                    loadingImages.$value = true
                    images.$value = []
                    api.searchImages(filter).then(data => {
                        loadingImages.$value = false
                        images.$value = data
                    })
                }

                // при изменении выбранной породы загружаем список изображений
                selected.$subscribe((next) => {
                    if (next) {
                        loadImages({breed_id: next.id, limit: 8})    
                    }
                })

                // FIXME хак из-за того, что события выбрасываются в том же потоке
                setTimeout(() => {
                    loadBreeds()
                })
            },
        },
        events: {
            onLoadBreeds: (e, {selected, breeds}) => {
                selected.$value = breeds[0]
            },
        },
        templates: {
            breedSelect: {
                styles: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                },
                templates: {
                    content: Field({
                        label: 'Breeds',
                        control: DropdownOld<CatApi.Breed, CatApi.Breed, BreedsScope>({
                            as: {
                                css: 'catapi-breed-dropdown'
                            },
                            defaultItem: DropdownOldItem<CatApi.Breed>({
                                text$: (scope) => scope.__it.name
                            }),
                            items$: (scope) => scope.breeds,
                            text$: (scope) => scope.selected.name,
                            value$: (scope) => scope.$context.selected,
                            loading$: (scope) => scope.loadingBreeds,
                            itemToValue: (itm) => itm,
                            valueToKey: (v) => v.id
                        })
                    })
                }
            },
            breedGallery: Custom({
                content: Card({
                    content: Carousel({
                        images$: (scope) => scope.imageUrls
                    })
                })
            }),
            breedDescription: Custom({
                content: Card({
                    header: false,
                    content: Coerced<{data: CatApi.Breed}, BreedsScope>({
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
                    })
                })
            })
        }
    }
}
