import { HtmlBlueprint, Injector, mix, patch } from "@chorda/core"




type ImageProps<T> = {
    url?: string
    css?: string
    url$?: Injector<T>
    rounded?: boolean
}


export const Image = <T>(props: ImageProps<T>) : HtmlBlueprint<T> => {
    return mix({
        tag: 'figure',
        css: 'image',
        templates: {
            image: {
                tag: 'img',
                reactors: {
                    url: (v) => patch({dom: {src: v}})
                }
            }
        }    
    }, props && {
        css: props.css,
        components: {
            image: {
                dom: {
                    src: props.url
                },
                classes: {
                    'is-rounded': props.rounded
                }
            }
        },
        injectors: {
            url: props.url$
        }
    })
}