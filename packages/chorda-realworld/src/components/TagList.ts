import { Blueprint, HtmlBlueprint, InferBlueprint, Injector, Listener, mix, patch } from "@chorda/core"
import { ItemScope, List, ListProps, ListPropsType, ListScope, Text, TextPropsType } from "../elements"




//type TagListScope = ListScope<string>

// type TagListScope = {
//     items: string[]
//     item: string
// }

type TagListProps<T, E> = ListPropsType<string, T, E> 

//type Overwrite<T1, T2> = Pick<T1, Exclude<keyof T1, keyof T2>> & T2

export const TagList = <T, E>(props: TagListProps<T, E>) : InferBlueprint<T, E> => {
    return mix(List(props), {
        css: 'tag-list',
//        tag: 'div',
        defaultItem: Text(<TextPropsType<ItemScope<string>, unknown>>{
            text$: $ => $.item
        })
    })
//     return mix<TagListScope>(props.as, {
//         css: 'tag-list',
//         defaultItem: {
// //            tag: 'span',
//             bindings: {
//                 item: (v) => patch({text: v})
//             }
//         },
//         bindings: {
//             items: (v) => patch({items: iterator(v, 'item')})
//         }
//     }, {
//         defaultItem: props.item,
//         scope: {
//             items: props.items$
//             //item: (ctx) => iterable2(() => ctx.items, 'item')
//         }
//     })
}
