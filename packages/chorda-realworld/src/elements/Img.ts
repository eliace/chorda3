import { Injector, HtmlBlueprint, patch, mix, InferBlueprint } from "@chorda/core"




type ImgScope = {
    src: string
}

type ImgProps<T> = {
    src$?: Injector<T>
    css?: string
}



export const Img = <T>(props: ImgProps<T&ImgScope>) : InferBlueprint<T> => {
    return mix<ImgScope>({
        tag: 'img',
        reactions: {
            src: (v) => patch({dom: {src: v}})
        },
    }, props && {
        css: props.css,
        injections: {
            src: props.src$
        }
    })
}

