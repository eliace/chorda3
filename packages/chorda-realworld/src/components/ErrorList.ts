import { Injector, mix, InferBlueprint, Infer } from "@chorda/core"
import { List, ListProps, ListPropsType, ListScope } from "../elements"


// type ErrorListScope = {
//     items: string[]
//     item: string
// }

// type ErrorListProps<T> = {
//     items$?: Injector<T>
// }

type ErrorListProps<T, E> = ListPropsType<string, T, E>


export const ErrorList = <T, E>(props: ErrorListProps<T, E>) : Infer.Blueprint<T, E> => {
    return mix({
        css: 'error-messages',
    }, List(props))
}

// export const ErrorList = <T, E>(props: ErrorListProps<T&ErrorListScope>) : InferBlueprint<T, E> => {
//     return mix<ErrorListScope>(List, {
//         css: 'error-messages',
//         defaultItem: {
//             bindings: {
//                 item: (v) => ({text: v})
//             }
//         },
//         scope: {
//             items: props.items$
//         },
//         bindings: {
//             items: (v) => ({items: iterator(v, 'item')})
//         }
//     })
// }
