import { computable, EventBus, HtmlBlueprint, observable, Value } from "@chorda/core"
import { Card, Field, Title } from "chorda-bulma"
import { Coerced, createValueEffect, Custom } from "../../utils"
import { Carousel, Dropdown, DropdownItem, Paragraph, Text } from "../../helpers"
import { CatApi , api} from "./api"


// console.log('toJSON', observable(5))
// console.log('stringify', JSON.stringify(observable(5)))
// console.log('stringify', JSON.stringify(5))
// console.log('stringify', JSON.stringify(observable("hello")))
// console.log('stringify', JSON.stringify("hello"))
// console.log('typeof', typeof observable("hello"))


type BreedsScope = {
    breeds: CatApi.Breed[]
    selected: CatApi.Breed
//    imageUrl: string
    images: CatApi.Image[]
    imageUrls: string[]
    loadingBreeds: boolean
}

type BreedsEvents = {
    loadBreedsStart?: () => any
    loadBreedsDone?: () => CatApi.Breed[]
    loadImagesDone?: () => CatApi.Image[]
    selectBreed?: () => CatApi.Breed
}





export const Breeds = () : HtmlBlueprint<BreedsScope, BreedsEvents> => {
    return {
        injectors: {
            images: () => observable([]),
            imageUrls: ({images}) => computable(() => {
                return images.map(img => img.url)
            }),
            breeds: () => observable([]),
            selected: () => observable(null),
            loadingBreeds: () => observable(null)
        },
        joints: {
            autoLoad: ({breeds, images, selected}) => {

                const loadImages = createValueEffect(images, 'loadImages', api.searchImages)
                const loadBreeds = createValueEffect(breeds, 'loadBreeds', api.getBreeds)

                // при изменении выбранной породы загружаем список изображений
                selected.$subscribe((next) => {
                    if (next) {
                        images.$value = []
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
            loadBreedsStart: (breeds, {loadingBreeds}) => {
                console.log('breeds:start')
                loadingBreeds.$value = true
            },
            loadBreedsDone: (breeds, {selected, loadingBreeds}) => {
                console.log('breeds:done', breeds)
                selected.$value = breeds[0]
                loadingBreeds.$value = false
            },
            loadImagesDone: (images, {}) => {
                console.log('images:done', images)
            }
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
                        control: Dropdown<CatApi.Breed, CatApi.Breed, BreedsScope>({
                            as: {
                                css: 'catapi-breed-dropdown'
                            },
                            defaultItem: DropdownItem<CatApi.Breed>({
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
                        injectors: {
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
