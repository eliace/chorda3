import { HtmlBlueprint, mix, Blueprint } from "@chorda/core"


type RowProps<T, E> = {
    columns: Blueprint<T, E>[]
    css?: string
}

export const Row = <T, E>(props: RowProps<T, E>) : HtmlBlueprint<T, E> => {
    return mix({
        css: 'row',
    }, {
        css: props.css,
        items: props.columns
    })
}

