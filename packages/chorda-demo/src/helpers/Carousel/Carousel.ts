import { computable, HtmlBlueprint, HtmlScope, InferBlueprint, Injector, iterable, mix, observable, patch } from "@chorda/core"
import { DomEvents } from "@chorda/react"
import { Coerced } from "../../utils"

import './Carousel.scss'


type CarouselScope = {
    images: string[]
//    slide: CarouselSlide
    current: number
    slides: CarouselSlide[]
    __it: CarouselSlide[]
}

type CarouselSlide = {
    id: number
    hidden: boolean
    url: string
}

type CarouselSlideScope = {
    slide: CarouselSlide
}

type CarouselProps<T> = {
    css?: string
    height?: number|string
    images$?: Injector<T>
    image?: HtmlBlueprint<T>
    title?: HtmlBlueprint<T>
    current?: number
}


export const Carousel = <T>(props: CarouselProps<T&CarouselScope>) : InferBlueprint<T> => {
    return mix<CarouselScope, DomEvents>({
        css: 'carousel',
        templates: {
            slides: {
                css: 'carousel__slides',
                styles: {
                    height: 400
                },
                defaultItem: {
                    css: 'carousel__slide',
                    templates: {
                        content: Coerced<CarouselSlideScope, CarouselScope>({
                            reactions: {
                                slide: (v) => {v && patch({
                                    styles: {
                                        backgroundImage: `url(${v.url})`
                                    },
                                    classes: {
                                        'hidden': v.hidden//.valueOf()
                                    },
                                    dom: {
                                        key: v.url//.valueOf()
                                    }
                                })}                                
                            }
                        }),
                    }
                },
                reactions: {
                    __it: (v) => patch({items: v})
                }
            },
            indicators: {
                tag: 'ul',
                css: 'carousel__indicators',
                defaultItem: Coerced<CarouselSlideScope, CarouselScope&DomEvents>({
                    tag: 'li',
                    reactions: {
                        slide: (v) => {v && patch({
                            classes: {
                                'active': !v.hidden//.valueOf()
                            }
                        })}
                    },
                    events: {
                        $dom: {
                            click: (e, {current, slide}) => {
                                current.$value = slide.id
                                e.stopPropagation()
                            }    
                        }
                    }
                }),
                reactions: {
                    __it: (v) => patch({items: v})
                }
            },
            title: {
                css: 'carousel__title'
            }
        }
    }, props && {
        css: props.css,
        templates: {
            slides: {
                defaultItem: props.image
            },
            title: props.title
        },
        initials: {
            images: () => observable([]),
            current: () => observable(props.current || 0),
//            slides: () => observable([]),
        },
        injections: {
            images: props.images$,
            slides: ({images, current}) => computable(() => {
                return images.map((img, i) => {
                    return {id: i, url: img, hidden: i != current}
                })
            }),
            __it: (scope) => iterable(scope.slides, 'slide')
        },
        joints: {
            init: ({current, images}) => {
                images.$subscribe((next) => {
                    if (next.length) {
                        current.$value = Math.min(current, next.length-1)
                    }
                })
            }
            // current: {
            //     init: (current, {slides, images}) => {

            //         images.$subscribe((next) => {
            //             if (next.length) {
            //                 current.$value = Math.min(current, next.length-1)
            //             }
            //         })

            //     }
            // }
        },
        events: {
            $dom: {
                click: (e, {current, slides}) => {
                    console.log('slides', slides)
                    if (current.$value >= slides.length - 1) {
                        current.$value = 0
                    }
                    else {
                        current.$value = current + 1
                        console.log('current', current.$value)
                    }
                }    
            }
        }
    })
}
