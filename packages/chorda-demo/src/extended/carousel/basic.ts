import { computable, InferBlueprint, observable } from '@chorda/core'
import { Box } from 'chorda-bulma'
import { Picsum } from '../../api'
import { Carousel, Text } from '../../helpers'


const images = observable<Picsum.ImageData[]>([])

Picsum.api.list().then(data => {
    images.$value = data
})


export default () : InferBlueprint<unknown> => {
    return Box({
        content: Carousel({
            css: 'carousel-dark',
            current: 4,
            images$: $ => computable(() => {
                return images.map(img => img.download_url)
            }),
            title: {
                templates: {
                    author: Text({
                        text$: $ => computable(() => {
                            return images[$.current]?.author
                        })
                    })
                }
            }
        })
    })
}