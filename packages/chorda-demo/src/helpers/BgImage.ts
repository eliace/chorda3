import { HtmlBlueprint, Injector, observable, patch } from "@chorda/core"



type BackgroundImageScope = {
    url: string
}

type BackgroundImageProps<T> = {
    url?: string
    url$?: Injector<T>
    width?: number
    height?: number
}

export const BgImage = <T>(props: BackgroundImageProps<T&BackgroundImageScope>) : HtmlBlueprint<T&BackgroundImageScope> => {
    return {
        css: 'bg-image',
        styles: {
            width: props.width,
            height: props.height,
        },
        templates: {
            content: {
                css: 'bg-image-content',
                reactors: {
                    url: (v: any) => v && patch({
                        styles: {
                            backgroundImage: `url(${v})`
                        }
                    })
                }        
            }
        },
        injectors: {
            url: props.url$
        },
        initials: {
            url: () => observable(props.url)
        }
    }
}
