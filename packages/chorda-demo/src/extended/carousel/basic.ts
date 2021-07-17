import { computable, HtmlBlueprint, observable } from '@chorda/core'
import Axios from 'axios'
import { Box } from 'chorda-bulma'
import { Carousel, Text } from '../../helpers'

type ImageData = {
    id: number
    author: string
    width: number
    height: number
    url: string
    download_url: string
}

Axios.get<ImageData[]>('https://picsum.photos/v2/list?limit=8&page=3').then(response => {
    console.log('Carousel images loaded')
    images.$value = response.data
})

const images = observable<ImageData[]>([])


export default () : HtmlBlueprint => {
    return Box({
        content: Carousel({
            css: 'carousel-dark',
            current: 4,
            images$: () => computable(() => {
                return images.map(img => img.download_url)
            }),
            title: {
                templates: {
                    author: Text({
                        text$: ({current}) => computable(() => {
                            return images[current]?.author
                        })
                    })
                }
            }
        })
    })
}