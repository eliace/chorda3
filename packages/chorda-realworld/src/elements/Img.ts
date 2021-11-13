import { Infer, Injector, mix } from "@chorda/core"




type ImgScope = {
    src: string
}

type ImgProps<T> = {
    src$?: Injector<T>
    css?: string
}



export const Img = <T>(props: ImgProps<T&ImgScope>) : Infer.Blueprint<T> => {
    return mix<ImgScope>({
        tag: 'img',
        reactions: {
            src: (v) => ({dom: {src: v}})
        },
    }, props && {
        css: props.css,
        injections: {
            src: props.src$
        }
    })
}

