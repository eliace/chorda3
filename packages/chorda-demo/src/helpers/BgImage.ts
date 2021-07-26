import { HtmlBlueprint, Injector, mix, observable, patch } from "@chorda/core"



export type BgImageScope = {
    url: string
}

type BgImageProps<T> = {
    url?: string
    url$?: Injector<T>
    width?: number
    height?: number
    as?: HtmlBlueprint<T>
}

export const BgImage = <T>(props: BgImageProps<T&BgImageScope>) : HtmlBlueprint<T> => {
    return mix<BgImageScope>({
        css: 'bg-image',
        templates: {
            content: {
                css: 'bg-image-content',
                reactions: {
                    url: (v: any) => v && patch({
                        styles: {
                            backgroundImage: `url(${v})`
                        }
                    })
                }        
            }
        },
    },
    props?.as,
    props && {
        injections: {
            url: props.url$
        },
        initials: {
            url: () => observable(props.url)
        },
        styles: {
            width: props.width,
            height: props.height,
        },
    })
}
