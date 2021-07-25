import { HtmlBlueprint, mix } from "@chorda/core"



type TagProps<T> = {
    text?: string
    as?: HtmlBlueprint<T>
    icon?: HtmlBlueprint<T>
}


export const Tag = <T>(props: TagProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'tag',
    }, 
    props?.as,
    props && {
    })
}




type TagsProps<T> = {
    tags?: HtmlBlueprint<T>[]
    as?: HtmlBlueprint<T>
    defaultTag?: HtmlBlueprint<T>
}

export const Tags = <T>(props: TagsProps<T>) : HtmlBlueprint<T> => {
    return mix({
        css: 'tags',
        defaultItem: Tag
    }, 
    props?.as,
    props && {
        items: props.tags,
        defaultItem: props.defaultTag,
    })
}

