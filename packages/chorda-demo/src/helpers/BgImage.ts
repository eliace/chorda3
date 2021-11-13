import { HtmlBlueprint, Injector, mix, observable } from "@chorda/core"



export type BgImageScope = {
    url: string
}

type BgImageProps<T, E> = {
    url?: string
    url$?: Injector<T>
    width?: number
    height?: number
    as?: HtmlBlueprint<T, E>
}

export type BgImagePropsType<T, E=unknown> = BgImageProps<T&BgImageScope, E>

export const BgImage = <T, E>(props: BgImageProps<T&BgImageScope, E>) : HtmlBlueprint<T, E> => {
    return mix<BgImageScope>({
        css: 'bg-image',
        templates: {
            content: {
                css: 'bg-image-content',
                reactions: {
                    url: (v: any) => v && {
                        styles: {
                            backgroundImage: `url(${v})`
                        }
                    }
                }        
            }
        },
    },
    props?.as,
    props && {
        injections: {
            url: props.url$
        },
        defaults: {
            url: () => observable(props.url)
        },
        styles: {
            width: props.width,
            height: props.height,
        },
    })
}
