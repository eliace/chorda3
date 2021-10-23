import { computable, InferBlueprint, observable } from "@chorda/core"
import dayjs from "dayjs"
import { Nasa } from "../../api"
import { Carousel, Text } from "../../helpers"


const images = observable([] as Nasa.Apod.Media[])

export const Apod = () : InferBlueprint<unknown> => {
    return {
        templates: {
            content: Carousel({
                css: 'carousel-dark',
                current: 0,
                images$: $ => computable(() => {
                    return images.map(img => img.url)
                }),
                title: {
                    templates: {
                        author: Text({
                            text$: $ => computable(() => {
                                return (images[$.current]?.copyright || 'Unknown') + ' - ' + images[$.current]?.title
                            })
                        })
                    }
                },
                as: {
                    templates: {
                        slides: {
                            styles: {
                                height: 500
                            }
                        },
                        // copyright: Text({
                        //     css: 'image-copyright',
                        // })
                    }
                }
            })    
        },
        joints: {
            autoLoad: () => {

                if (images.length == 0) {
                    Nasa.api.apod.get({count: 8, thumbs: true, hd: true}).then(data => {
                        images.$value = data
                    })    
                }

            }
        }
    }
}
